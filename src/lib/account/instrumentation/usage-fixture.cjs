/* Test-only loader executes TS service/route code with explicit framework boundaries. */
const fs=require("node:fs"),path=require("node:path"),{tmpdir}=require("node:os");
const {pathToFileURL}=require("node:url"),{createRequire}=require("node:module");
async function studioUsageFixture(root=path.resolve(__dirname,"../../../.."),options={}){
 const dep=createRequire(root+"/package.json"),ts=dep("typescript");
 const {createClient}=dep("@libsql/client"),{drizzle}=dep("drizzle-orm/libsql");
 const directory=fs.mkdtempSync(path.join(tmpdir(),"studio-usage-"));
 const client=createClient({url:pathToFileURL(path.join(directory,"usage.db")).href});
 await client.execute("PRAGMA journal_mode=WAL");
 const files=options.withVenue ? ["0000_init.sql"] : fs.readdirSync(root+"/drizzle-entitlements").filter(f=>/^\d{4}_.*\.sql$/.test(f)).sort();
 for(const file of files)
  await client.executeMultiple(fs.readFileSync(root+"/drizzle-entitlements/"+file,"utf8"));
 // Existing Venue terms migrated outside the frozen baseline; fixture only.
 for(const ddl of ["allotment_mode text NOT NULL DEFAULT 'limited'","annual_wedding_count integer",
  "fair_use_ceiling integer","founding_number integer","founding_number_assigned_at integer"])
  await client.execute("ALTER TABLE sponsors ADD COLUMN "+ddl);
 await client.execute("ALTER TABLE entitlements ADD COLUMN wedding_date integer");
 let localClient,localDatabase,localSchema;
 if(options.withVenue){
  // Composition uses the owning additive runners and their real hash ledgers.
  const venue=await import(pathToFileURL(root+"/scripts/migrate-venue-fulfilment.mjs").href);
  const usage=await import(pathToFileURL(root+"/scripts/migrate-usage-delivery.mjs").href);
  await venue.applyVenueFulfilmentMigration(client);
  await usage.applyUsageDeliveryMigration(client);
  localClient=createClient({url:pathToFileURL(path.join(directory,"studio-local.db")).href});
  await localClient.execute("PRAGMA journal_mode=WAL");
  await localClient.executeMultiple(fs.readFileSync(root+"/drizzle/0000_init.sql","utf8"));
 }
 let database; const mods=new Map(),state={hqToken:"",send:async()=>{throw Error("Real network forbidden");}};
 function load(relative){
  const file=[relative,relative+".ts",relative+".tsx",relative+"/index.ts"].find(f=>fs.existsSync(root+"/"+f)&&fs.statSync(root+"/"+f).isFile())??relative;
  if(["src/lib/entitlements-db/client.ts","src/lib/entitlements-db/client-core.ts"].includes(file))return {entitlementsDb:()=>database};
  if(mods.has(file))return mods.get(file).exports;
  const mod={exports:{}};mods.set(file,mod);
  if(file.endsWith(".json")){mod.exports=JSON.parse(fs.readFileSync(root+"/"+file,"utf8"));return mod.exports;}
  const js=ts.transpileModule(fs.readFileSync(root+"/"+file,"utf8"),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText;
  function req(spec){
   if(spec==="server-only")return {};
   if(spec==="next/headers")return {cookies:async()=>({get:()=>({value:state.hqToken})})};
   if(spec==="next/navigation")return {redirect:url=>{const e=new Error("redirect");e.url=url;throw e;}};
   if(spec==="next/server")return {NextResponse:class extends Response{static json(v,init){return Response.json(v,init);}}};
   if(spec.startsWith("@/"))return load("src/"+spec.slice(2));
   if(spec.startsWith("."))return load(path.posix.normalize(path.posix.join(path.posix.dirname(file),spec)));
   return dep(spec);
  }
  new Function("require","module","exports","fetch",js)(req,mod,mod.exports,(request,options)=>state.send(request,options));
  return mod.exports;
 }
 const schema=load("src/lib/entitlements-db/schema.ts");database=drizzle(client,{schema});
 if(options.withVenue){localSchema=load("src/lib/db/schema.ts");localDatabase=drizzle(localClient,{schema:localSchema});}
 if(options.seedSponsor!==false)await database.insert(schema.sponsors).values({id:"synthetic-sponsor",slug:"synthetic",name:"Synthetic venue",contactEmail:"fixture@example.test",
  venuePlan:"paid",paidAt:Date.now(),codeAllotment:20,codesIssued:0});
 return {database,client,schema,state,load,shared:database,studio:localDatabase,studioClient:localClient,localSchema,close:()=>{
  localClient?.close();
  client.close();try{fs.rmSync(directory,{recursive:true,force:true});}catch(e){if(!["EPERM","EBUSY"].includes(e.code))throw e;}
 }};
}
module.exports={studioUsageFixture};
