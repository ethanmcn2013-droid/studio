import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
const root=fileURLToPath(new URL("../",import.meta.url));
const id="0002_usage_delivery";
export async function applyUsageDeliveryMigration(client) {
  const ledger=JSON.parse(readFileSync(resolve(root,"drizzle-entitlements/additive-ledger.json"),"utf8"));
  const entry=ledger.migrations.find(row=>row.id===id);
  const journal=JSON.parse(readFileSync(resolve(root,"drizzle-entitlements/meta/_journal.json"),"utf8"));
  if(!entry || !journal.entries.some(row=>row.tag===id && row.when===entry.journalWhen))throw Error("Usage ledger mismatch");
  const source=readFileSync(resolve(root,entry.sql),"utf8").replace(/\r\n?/g,"\n");
  if(createHash("sha256").update(source).digest("hex")!==entry.sha256)throw Error("Usage migration hash mismatch");
  const tx=await client.transaction("write");
  try {
    const prerequisite=await tx.execute("SELECT id FROM signal_additive_migrations WHERE id='0001_venue_fulfilment'");
    if(prerequisite.rows.length!==1)throw Error("Canonical issuance migration required");
    const prior=await tx.execute({sql:"SELECT sha256 FROM signal_additive_migrations WHERE id=?",args:[id]});
    if(prior.rows.length && prior.rows[0].sha256!==entry.sha256)throw Error("Usage stored hash differs");
    if(!prior.rows.length)for(const statement of source.split("--> statement-breakpoint").map(s=>s.trim()).filter(Boolean))await tx.execute(statement);
    for(const [table,names,pk] of [
      ["usage_subject_workspaces",["epoch","subject_id_hash","workspace_id_hash","sponsor_id","updated_at"],["epoch","subject_id_hash","workspace_id_hash","sponsor_id"]],
      ["usage_erasure_tombstones",["epoch","subject_id_hash","erased_at"],["epoch","subject_id_hash"]],
    ]) {
      const columns=(await tx.execute("PRAGMA table_info("+table+")")).rows;
      if(JSON.stringify(columns.map(r=>r.name))!==JSON.stringify(names) ||
        JSON.stringify(columns.filter(r=>Number(r.pk)>0).sort((a,b)=>Number(a.pk)-Number(b.pk)).map(r=>r.name))!==JSON.stringify(pk) ||
        columns.some(r=>Number(r.notnull)!==1))throw Error("Usage schema proof failed");
    }
    const index=(await tx.execute("PRAGMA index_info(usage_subject_retention_idx)")).rows;
    if(index.length!==1 || index[0].name!=="updated_at")throw Error("Usage retention index proof failed");
    const foreign=(await tx.execute("PRAGMA foreign_key_list(usage_subject_workspaces)")).rows;
    if(foreign.length!==1 || foreign[0].table!=="sponsors" || foreign[0].from!=="sponsor_id" || foreign[0].to!=="id")throw Error("Usage sponsor scope proof failed");
    if(!prior.rows.length)await tx.execute({sql:"INSERT INTO signal_additive_migrations(id,sha256,applied_at)VALUES(?,?,?)",args:[id,entry.sha256,Date.now()]});
    await tx.commit();return {id,state:prior.rows.length?"already_applied":"applied"};
  }catch(error){await tx.rollback();throw error;}finally{tx.close();}
}
async function main() {
  const url=process.env.ENTITLEMENTS_DATABASE_URL ?? "";
  if(!url.startsWith("file:") || process.env.ENTITLEMENTS_AUTH_TOKEN)throw Error("Disposable local file database required");
  const {createClient}=await import("@libsql/client");const client=createClient({url});
  try{console.log(await applyUsageDeliveryMigration(client));}finally{client.close();}
}
if(process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url))
  void main().catch(()=>{console.error("Usage migration failed; no success claimed.");process.exitCode=1;});
