import { spawnSync } from 'node:child_process';
import { fixtureEnvironment } from './source/scripts/experience/january/environment.mjs';
const args = ['--import','tsx','--test','scripts/experience/january/receipt.test.mjs','scripts/experience/january/fixture.test.ts','src/lib/atlas/render.test.ts'];
const result=spawnSync(process.execPath,args,{cwd:process.cwd(),env:fixtureEnvironment(),encoding:'utf8',windowsHide:true});
process.stdout.write(result.stdout??'');process.stderr.write(result.stderr??'');process.exitCode=result.status??1;
