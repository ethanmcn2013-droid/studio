/* eslint-disable @typescript-eslint/no-require-imports -- In-process three-store receiving harness. */
const assert = require("node:assert/strict");
const { test } = require("node:test");
const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const { pathToFileURL } = require("node:url");

const studioRoot = path.resolve(__dirname, "../../..");
const appRoot = path.resolve(studioRoot, "../app");
const { usageFixture, SALT } = require(path.join(appRoot, "src/server/sponsored-use/fixture.cjs"));
const { studioUsageFixture } = require("../account/instrumentation/usage-fixture.cjs");
const issuanceSecret = "synthetic-receiving-issuance-purpose-secret";
const usageSecret = "synthetic-receiving-usage-purpose-secret";
const reportSecret = "synthetic-receiving-report-purpose-secret";
const claimAt = Date.parse("2026-06-15T12:00:00Z");
const grantEndsAt = Date.parse("2027-12-15T12:00:00Z");
const reportNow = Date.parse("2026-09-06T12:00:00Z");
const programmeId = "synthetic-venue-programme";
const sponsorId = "synthetic-sponsor";
const month = "2026-06";

async function count(client, sql, args = []) {
  return Number((await client.execute({ sql, args })).rows[0].n);
}

test("actual App actions, authenticated Studio receipt and canonical cohort publish survive receiving and erasure", async () => {
  const originalNow = Date.now;
  const savedEnv = Object.fromEntries(["SPONSOR_USAGE_EVENTS", "SPONSOR_USAGE_HASH_SALT", "SPONSOR_USAGE_SERVICE_SECRET",
    "SPONSOR_USAGE_ACCEPTED_EPOCHS", "SPONSOR_USAGE_ENVIRONMENT", "SPONSOR_USAGE_APP_ORIGIN", "VENUE_ISSUANCE_SECRET"]
    .map(key => [key, process.env[key]]));
  let clock = claimAt;
  Date.now = () => clock;
  const app = await usageFixture({ seedClaim: false });
  const studio = await studioUsageFixture(studioRoot, { withVenue: true });
  try {
    const appAuth = app.load("src/lib/sponsored-use/service-auth.ts");
    const appCanonical = app.load("src/server/venue-issuance/canonical.ts");
    const epoch = appAuth.hashEpoch(SALT);
    Object.assign(process.env, { SPONSOR_USAGE_EVENTS: "1", SPONSOR_USAGE_HASH_SALT: SALT,
      SPONSOR_USAGE_SERVICE_SECRET: usageSecret, SPONSOR_USAGE_ACCEPTED_EPOCHS: epoch,
      SPONSOR_USAGE_ENVIRONMENT: "internal_test", SPONSOR_USAGE_APP_ORIGIN: "http://app.test",
      VENUE_ISSUANCE_SECRET: issuanceSecret });

    const { applySponsorProgrammeMigration } = await import(pathToFileURL(path.join(studioRoot, "scripts/migrate-sponsor-programme.mjs")).href);
    assert.equal((await applySponsorProgrammeMigration(studio.client)).state, "applied");
    const cohort = await app.seedVenueCohort({ count: 40, claimAt, grantEndsAt });
    assert.equal(cohort.rows.length, 40);
    assert.deepEqual(cohort.issuances.map(x => x.codes.length), [25, 15]);
    const protocol = studio.load("src/lib/venue-fulfilment/protocol.ts");
    for (const { manifest, codes } of cohort.issuances) {
      await studio.database.insert(studio.schema.venueFulfilmentRequests).values({
        id: manifest.issuanceId, sponsorId, studioSponsorId: "synthetic-studio-sponsor",
        requestJson: "{}", manifestJson: JSON.stringify(manifest), manifestHash: protocol.manifestHash(manifest),
        operatorId: "fixture", operatorName: "Synthetic fixture", createdAt: manifest.issuedAt,
        updatedAt: claimAt, fulfilledAt: claimAt - 86400000,
      });
      for (const code of codes) await studio.database.insert(studio.schema.licenseCodes).values({
        id: code.licenseCodeId, sponsorId, code: code.code, sourceType: "venue_edition",
        tier: "wedding", durationDays: 548, batchId: manifest.issuanceId,
        createdAt: manifest.issuedAt, updatedAt: manifest.issuedAt,
      });
    }
    await studio.client.execute({ sql: "INSERT INTO sponsor_programmes (id,sponsor_id,kind,timezone,agreement_version,measurement_starts_on,status,policy_version) VALUES (?,?,?,?,?,?,?,?)",
      args: [programmeId, sponsorId, "venue", "Europe/Dublin", "commercial-terms.v2", "2026-06-01", "internal", "sponsor-cohort.v1"] });
    for (const [subject, capability] of [["reader", "report_read"], ["exporter", "report_export"], ["admin", "invitation_admin"]])
      await studio.client.execute({ sql: "INSERT INTO sponsor_programme_members VALUES (?,?,?,?,NULL)",
        args: [programmeId, subject, capability, reportNow + 86400000] });

    const provenance = () => app.load("src/server/sponsored-use/provenance-handler.ts").provenanceHandler(
      app.db, appCanonical.readCanonicalVenueClaim,
      { enabled: true, salt: SALT, secret: usageSecret, issuanceSecret, now: clock });
    studio.state.send = request => provenance()(request);
    const ingest = studio.load("src/app/api/internal/sponsored-use/ingest/route.ts").POST;
    const erase = studio.load("src/app/api/internal/sponsored-use/erase/route.ts").POST;
    const delivery = app.load("src/server/sponsored-use/delivery.ts").deliverUsage;
    async function deliver(enabled = true) {
      const result = await delivery(app.db, { enabled, studioOrigin: "http://studio.test", secret: usageSecret,
        issuanceSecret, now: clock, send: request => new URL(request.url).pathname === appAuth.USAGE_PATHS.erase ? erase(request) : ingest(request) });
      assert.equal(result.failed, 0, "Every signed delivery needs an exact Studio acknowledgement");
      return result.delivered;
    }
    async function action(n, at, suffix = "owner") {
      const row = cohort.rows[n - 1];
      app.state.actor = suffix === "partner" ? "member" : row.userId;
      clock = at;
      await app.actionAt(at, { id: `synthetic-task-${n}-${at}-${suffix}`, title: "PRIVATE SYNTHETIC TASK",
        projectId: row.projectId });
    }
    // Four disjoint groups of ten: M+M+1, M+1 only, M with a next-day return, quiet.
    const june20 = Date.parse("2026-06-20T12:00:00Z");
    const june21 = Date.parse("2026-06-21T12:00:00Z");
    const july10 = Date.parse("2026-07-10T12:00:00Z");
    for (const n of [...Array.from({length:10},(_,i)=>i+1),...Array.from({length:10},(_,i)=>i+21)]) await action(n,june20);
    clock = june20 + 86400000; assert.equal(await deliver(), 20);
    for (let n = 21; n <= 30; n++) await action(n,june21);
    clock = june21 + 86400000; assert.equal(await deliver(), 10);
    for (let n = 1; n <= 20; n++) await action(n,july10);
    await app.db.insert(app.schema.workspaceMembers).values({workspaceId:cohort.rows[0].projectId,userId:"member",role:"member"});
    await action(1,july10,"partner");
    clock = july10 + 86400000; assert.equal(await deliver(), 21);
    assert.equal(await count(studio.client,"SELECT count(*) n FROM sponsor_usage_events"),51);
    assert.equal(await count(studio.client,"SELECT count(*) n FROM sponsor_programme_contributions"),51);
    assert.equal(await count(studio.client,"SELECT count(*) n FROM (SELECT DISTINCT unit_key,local_date FROM sponsor_programme_contributions)"),50,
      "The partner adds an event but not another gift/day unit");

    // Explicit synthetic closed-day attestation. It is fixture evidence, not a
    // claim that live capture covered silent Projects or all product actions.
    for (let date = "2026-06-15"; date <= "2026-09-04"; date = studio.load("src/lib/account/instrumentation/local-date.ts").addLocalDays(date,1))
      await studio.client.execute({ sql: "INSERT INTO sponsor_programme_coverage VALUES (?,?,?,?)",
        args: [programmeId,date,epoch,`synthetic_fixture:closed_day:${date}`] });
    clock = reportNow;
    const deps = studio.load("src/lib/account/instrumentation/usage-runtime.ts").runtimeUsageDependencies(studio.database);
    const published = await studio.load("src/lib/sponsor-programme/publisher.ts").publishCanonicalReport(
      studio.client,deps,programmeId,month,epoch,reportNow);
    assert.equal(published.cohort.month,month);
    assert.equal(published.coverage,"complete");
    assert.ok(Object.values(published.metrics).some(metric=>metric.state!=="unavailable"));

    const {createReportAssertion} = studio.load("src/lib/sponsor-programme/auth.ts");
    const handleReport = studio.load("src/lib/sponsor-programme/handlers.ts").handleReport;
    const request = (subject,format="json") => new Request(`http://studio.test/api/sponsor-programmes/${programmeId}/reports/${month}?format=${format}`,
      {headers:{authorization:"Bearer "+createReportAssertion(subject,reportSecret,Math.floor(clock/1000))}});
    const handlerDeps = {db:studio.client,secret:reportSecret,enabled:true,now:()=>clock,
      claims:async()=>deps.eligible(sponsorId,epoch,0,reportNow)};
    const json = await handleReport(request("reader"),programmeId,month,handlerDeps);
    assert.equal(json.status,200); assert.deepEqual(await json.json(),published);
    const html = await handleReport(request("reader","html"),programmeId,month,handlerDeps);
    assert.equal(html.status,200); const htmlBody=await html.text();
    assert.equal((await handleReport(request("reader","csv"),programmeId,month,handlerDeps)).status,403);
    const csv = await handleReport(request("exporter","csv"),programmeId,month,handlerDeps);
    assert.equal(csv.status,200); const csvBody=await csv.text();
    assert.equal((await handleReport(request("admin"),programmeId,month,handlerDeps)).status,403);
    assert.equal((await handleReport(new Request(request("reader").url),programmeId,month,handlerDeps)).status,403);
    const proxySponsorReport=app.load("src/server/sponsor-report/proxy.ts").proxySponsorReport;
    let proxyCalls=0;
    const proxyConfig={origin:"http://127.0.0.1",secret:reportSecret,enabled:true,usageSecret,issuanceSecret,now:clock,
      send:upstream=>{
        proxyCalls++;
        assert.equal(new URL(upstream.url).origin,"http://127.0.0.1");
        return handleReport(upstream,programmeId,month,handlerDeps);
      }};
    const viaProxy=(actor,format="json")=>proxySponsorReport({actor,programmeId,month,kind:"report",format,method:"GET"},proxyConfig);
    const proxyJson=await viaProxy("reader");
    assert.equal(proxyJson.status,200);assert.deepEqual(await proxyJson.json(),published);
    const proxyHtml=await viaProxy("reader","html");
    assert.equal(proxyHtml.status,200);assert.equal(await proxyHtml.text(),htmlBody);
    const proxyCsv=await viaProxy("exporter","csv");
    assert.equal(proxyCsv.status,200);assert.equal(await proxyCsv.text(),csvBody);
    assert.equal((await viaProxy("reader","csv")).status,403);
    assert.equal((await viaProxy("admin")).status,403);
    assert.equal((await viaProxy("forged-actor")).status,403);
    const beforeNoActor=proxyCalls;
    assert.equal((await viaProxy("")).status,401);
    assert.equal(proxyCalls,beforeNoActor,"A request without an App actor must never reach Studio");
    const handleInvitations=studio.load("src/lib/sponsor-programme/handlers.ts").handleInvitations;
    const invitationConfig={...proxyConfig,send:upstream=>handleInvitations(upstream,programmeId,handlerDeps)};
    const viaInvitation=(actor,method="GET",body)=>proxySponsorReport({actor,programmeId,kind:"invitations",method,
      ...(body===undefined?{}:{body:JSON.stringify(body)})},invitationConfig);
    const initialAdmin=await viaInvitation("admin");
    assert.equal(initialAdmin.status,200);
    const initialAdminBody=await initialAdmin.json();
    assert.equal(initialAdminBody.generated,40);
    assert.equal(initialAdminBody.issued,0);
    assert.equal(initialAdminBody.evidencedDelivery,0);
    assert.deepEqual(initialAdminBody.claimed,{state:"verified",value:40});
    assert.ok(initialAdminBody.invitations.every(row=>row.delivery.state==="unknown"));
    assert.ok(initialAdminBody.invitations.every(row=>row.claim.state==="verified" && row.codeStatus==="minted"),
      "Canonical App claims are verified independently of Studio's unsynchronised code status");
    assert.equal((await viaInvitation("reader","POST",{reference:cohort.rows[0].licenseCodeId,
      issuedAt:claimAt,issuanceEvidence:"synthetic_receipt"})).status,403);
    const issuedAt=cohort.issuances[0].manifest.issuedAt+1000;
    const reference=cohort.rows[0].licenseCodeId;
    const issued={reference,issuedAt,issuanceEvidence:"synthetic_receipt"};
    for(let retry=0;retry<2;retry++)assert.equal((await viaInvitation("admin","POST",issued)).status,200);
    const issuedAdmin=await (await viaInvitation("admin")).json();
    assert.equal(issuedAdmin.issued,1);assert.equal(issuedAdmin.evidencedDelivery,0);
    const delivered={...issued,deliveredAt:issuedAt+1000,deliveryEvidence:"synthetic_delivery_receipt"};
    for(let retry=0;retry<2;retry++)assert.equal((await viaInvitation("admin","POST",delivered)).status,200);
    const deliveredAdmin=await (await viaInvitation("admin")).json();
    assert.equal(deliveredAdmin.generated,40);assert.equal(deliveredAdmin.issued,1);
    assert.equal(deliveredAdmin.evidencedDelivery,1);
    assert.deepEqual(deliveredAdmin.claimed,{state:"verified",value:40});
    assert.equal((await viaInvitation("reader")).status,403);
    await studio.database.insert(studio.schema.licenseCodes).values({id:"legacy-unverified",sponsorId,
      code:"LEGACY-SYNTHETIC-ONLY",tier:"wedding",durationDays:548,createdAt:claimAt,updatedAt:claimAt});
    const mixedInventory=await (await viaInvitation("admin")).json();
    assert.deepEqual(mixedInventory.claimed,{state:"unavailable"});
    assert.deepEqual(mixedInventory.invitations.find(row=>row.reference==="legacy-unverified").claim,{state:"unknown"});

    for (const body of [JSON.stringify(published),htmlBody,csvBody]) {
      assert.doesNotMatch(body,/PRIVATE SYNTHETIC TASK|clerk-cohort|cohort-project|cohort-claim|workspace_hash|subject_hash|licenseCodeId/);
      for(const {codes} of cohort.issuances)for(const code of codes)assert.ok(!body.includes(code.code));
    }
    const specimenDir=process.env.SPONSOR_REPORT_SPECIMEN_DIR;
    if(specimenDir){
      fs.mkdirSync(specimenDir,{recursive:true});
      fs.writeFileSync(path.join(specimenDir,"report.json"),JSON.stringify(published,null,2)+"\n");
      fs.writeFileSync(path.join(specimenDir,"report.html"),htmlBody);
      fs.writeFileSync(path.join(specimenDir,"report.csv"),csvBody);
    }
    // A loopback bridge exercises the real handler with a locally injected
    // synthetic assertion. Browser preview receives only released report HTML.
    const servedFor = Number(process.env.SPONSOR_REPORT_SERVE_MS ?? 0);
    assert.ok(Number.isSafeInteger(servedFor) && servedFor >= 0 && servedFor <= 300000);
    if(specimenDir && !servedFor)fs.rmSync(path.join(specimenDir,"preview-url.txt"),{force:true});
    const reportPath = `/api/sponsor-programmes/${programmeId}/reports/${month}?format=html`;
    const server = http.createServer(async (incoming, outgoing) => {
      if(incoming.method!=="GET" || incoming.url!==reportPath ||
        !["127.0.0.1","::1","::ffff:127.0.0.1"].includes(incoming.socket.remoteAddress)) {
        outgoing.writeHead(404).end();return;
      }
      try {
        const response = await handleReport(request("reader","html"),programmeId,month,handlerDeps);
        outgoing.writeHead(response.status,Object.fromEntries(response.headers.entries()));
        outgoing.end(Buffer.from(await response.arrayBuffer()));
      } catch { outgoing.writeHead(503).end(); }
    });
    await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
    try {
      const url=`http://127.0.0.1:${server.address().port}${reportPath}`;
      if(specimenDir)fs.writeFileSync(path.join(specimenDir,"preview-url.txt"),url+"\n");
      const overHttp=await fetch(url);
      assert.equal(overHttp.status,200);
      assert.equal(await overHttp.text(),htmlBody,"Browser bridge must return actual authenticated handler HTML");
      if(servedFor) {
        process.stdout.write(`Synthetic loopback report preview: ${url}\n`);
        await new Promise(resolve=>setTimeout(resolve,servedFor));
      }
    } finally {
      await new Promise(resolve=>server.close(resolve));
      if(specimenDir)fs.rmSync(path.join(specimenDir,"preview-url.txt"),{force:true});
    }
    await studio.client.execute({sql:"UPDATE sponsor_programme_members SET revoked_at=? WHERE programme_id=? AND subject_id='exporter'",
      args:[clock,programmeId]});
    assert.equal((await handleReport(request("exporter","csv"),programmeId,month,handlerDeps)).status,403);
    assert.equal((await viaProxy("exporter","csv")).status,403);

    app.state.actor=cohort.rows[0].userId;
    await app.load("src/server/actions/preferences.ts").optOutOfSponsoredMeasurementAction();
    assert.equal(await deliver(false),2,"Both actor and sponsor-scoped Project erasure must reach Studio with positive capture disabled");
    const afterChoice=await deps.eligible(sponsorId,epoch,claimAt-86400000,reportNow);
    assert.equal(afterChoice.length,40,"Withdrawal remains in the complete canonical gift census");
    assert.equal(afterChoice.filter(claim=>claim.measurementAllowed===false).length,1,
      "The opted-out gift is excluded from measurement rather than recorded as quiet");
    assert.equal((await handleReport(request("reader"),programmeId,month,handlerDeps)).status,410);
    assert.equal((await viaProxy("reader")).status,410);
    assert.equal(await count(studio.client,"SELECT count(*) n FROM sponsor_programme_reports WHERE state='restricted' AND payload_json IS NULL"),1);
    assert.equal(await count(studio.client,"SELECT count(*) n FROM sponsor_programme_contributions"),0);
    await assert.rejects(()=>studio.load("src/lib/sponsor-programme/publisher.ts").publishCanonicalReport(
      studio.client,deps,programmeId,month,epoch,reportNow),/restricted/);
    if(specimenDir)fs.writeFileSync(path.join(specimenDir,"evidence.json"),JSON.stringify({
      fixture:"synthetic_internal_test",stores:3,canonicalClaims:40,issuanceManifests:2,
      committedActions:51,verifiedStudioEvents:51,distinctGiftDays:50,
      coverage:"synthetic_closed_day_evidence",releasedFormats:["json","html","csv"],
      readRole:200,readerExport:403,exportRole:200,revokedExport:403,afterErasure:410,
      appProxyFormats:["json","html","csv"],appProxyMissingActor:401,appProxyForgedActor:403,
      invitationAdmin:{generated:40,verifiedClaims:40,issued:1,evidencedDelivery:1,readerPost:403},
      canonicalClaimsAfterChoice:40,excludedAfterChoice:1,
      productionProviders:false,
    },null,2)+"\n");
  } finally {
    app.close(); studio.close(); Date.now=originalNow;
    for (const [key,value] of Object.entries(savedEnv)) if(value===undefined)delete process.env[key];else process.env[key]=value;
  }
});
