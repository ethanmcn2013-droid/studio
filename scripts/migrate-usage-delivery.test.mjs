import {test} from "node:test";
import assert from "node:assert/strict";
import {readFileSync,mkdtempSync,rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {pathToFileURL} from "node:url";
import {createClient} from "@libsql/client";
import {applyVenueFulfilmentMigration} from "./migrate-venue-fulfilment.mjs";
import {applyUsageDeliveryMigration} from "./migrate-usage-delivery.mjs";
import {applyUsageWorkspaceErasureMigration} from "./migrate-usage-workspace-erasure.mjs";
async function fixture(fn){
 const dir=mkdtempSync(join(tmpdir(),"usage-migration-")),client=createClient({url:pathToFileURL(join(dir,"test.db")).href});
 try{await client.executeMultiple(readFileSync(new URL("../drizzle-entitlements/0000_init.sql",import.meta.url),"utf8"));
  await applyVenueFulfilmentMigration(client);await fn(client);
 }finally{client.close();try{rmSync(dir,{recursive:true,force:true});}catch(e){if(!["EBUSY","EPERM"].includes(e.code))throw e;}}
}
test("usage additive migration applies fresh, proves no-op and rejects later index drift",()=>fixture(async client=>{
 assert.equal((await applyUsageDeliveryMigration(client)).state,"applied");
 assert.equal((await applyUsageDeliveryMigration(client)).state,"already_applied");
 await client.execute("DROP INDEX usage_subject_retention_idx");
 await client.execute("CREATE INDEX usage_subject_retention_idx ON usage_subject_workspaces(subject_id_hash)");
 await assert.rejects(()=>applyUsageDeliveryMigration(client),/retention index proof/);
}));
test("failure after the first usage table rolls back its SQL and receipt, then clean retry applies",()=>fixture(async client=>{
 await client.execute("CREATE TABLE usage_erasure_tombstones (wrong text)");
 await assert.rejects(()=>applyUsageDeliveryMigration(client));
 assert.equal((await client.execute("SELECT name FROM sqlite_master WHERE name='usage_subject_workspaces'")).rows.length,0);
 assert.equal((await client.execute("SELECT id FROM signal_additive_migrations WHERE id='0002_usage_delivery'")).rows.length,0);
 await client.execute("DROP TABLE usage_erasure_tombstones");
 assert.equal((await applyUsageDeliveryMigration(client)).state,"applied");
}));
test("workspace erasure migration requires usage delivery, is idempotent and proves its primary key",()=>fixture(async client=>{
 await assert.rejects(()=>applyUsageWorkspaceErasureMigration(client),/Usage delivery migration required/);
 await applyUsageDeliveryMigration(client);
 assert.equal((await applyUsageWorkspaceErasureMigration(client)).state,"applied");
 assert.equal((await applyUsageWorkspaceErasureMigration(client)).state,"already_applied");
 await client.execute("DROP TABLE usage_workspace_erasure_tombstones");
 await client.execute("CREATE TABLE usage_workspace_erasure_tombstones(epoch TEXT NOT NULL,workspace_id_hash TEXT NOT NULL,erased_at INTEGER NOT NULL)");
 await assert.rejects(()=>applyUsageWorkspaceErasureMigration(client),/schema proof/);
}));
