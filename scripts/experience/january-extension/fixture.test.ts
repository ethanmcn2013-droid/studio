import test from 'node:test';
import assert from 'node:assert/strict';
import { createClient } from '@libsql/client';
import { seedExtension } from './fixture';
import { fixtureEnvironment, localDatabase } from './environment.mjs';

test('extension fixtures isolate real read states and exclude inherited provider configuration', async () => {
  const env = fixtureEnvironment({ NODE_ENV:'test', PATH: process.env.PATH, STUDIO_DATABASE_URL: 'libsql://never-open.invalid', PARTNER_STATS_SECRET: 'never-use', HOME: 'never-read', RESEND_API_KEY: 'never-use' });
  assert.match(env.STUDIO_DATABASE_URL, /^file:.*january-studio14/);
  assert.equal(Object.hasOwn(env, 'PARTNER_STATS_SECRET'), false);
  assert.equal(Object.hasOwn(env, 'HOME'), false);
  assert.equal(Object.hasOwn(env, 'RESEND_API_KEY'), false);
  for (const scenario of ['empty', 'populated', 'dense', 'error'] as const) {
    const proof = await seedExtension(scenario);
    const client = createClient({ url: localDatabase('studio') });
    try {
      if (scenario === 'error') await assert.rejects(client.execute('SELECT * FROM waitlist_entries'), /no such table/);
      else assert.equal(Number((await client.execute('SELECT count(*) n FROM waitlist_entries')).rows[0].n), proof.expectedWaitlistCount);
    } finally { client.close(); }
    assert.equal(proof.providerCalls, 0);
    assert.deepEqual(proof.migrations.map(m => [m.id,m.state]),[['0001_venue_fulfilment','applied'],['0002_usage_delivery','applied']]);
    const shared = createClient({url:localDatabase('shared')});
    try {
      assert.equal((await shared.execute('SELECT id FROM signal_additive_migrations')).rows.length,2);
      assert.equal((await shared.execute('SELECT * FROM usage_erasure_tombstones')).rows.length,0);
      assert.equal((await shared.execute("SELECT name FROM sqlite_master WHERE type='trigger' AND name='venue_fulfilment_manifest_immutable'")).rows.length,1);
    } finally {shared.close();}
  }
});
