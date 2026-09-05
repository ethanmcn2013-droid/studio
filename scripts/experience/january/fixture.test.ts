import assert from 'node:assert/strict';
import { test } from 'node:test';
import { seedFixture } from './fixture';
import { createClient } from '@libsql/client';
import { localDatabase } from './environment.mjs';

test('synthetic states distinguish empty, legacy claims, verified receipts and failed reads', async () => {
  for (const scenario of ['empty', 'legacy', 'populated', 'dense', 'partial-failure', 'error'] as const) {
    const fixture = await seedFixture(scenario);
    assert.equal(fixture.synthetic, true);
    assert.equal(fixture.providerCalls, 0);
    assert.equal(fixture.expectedCash, ['partial-failure', 'error'].includes(scenario) ? null : ['empty', 'legacy'].includes(scenario) ? 0 : 2500);
    assert.equal(fixture.verifiedReceipts, ['empty', 'legacy'].includes(scenario) ? 0 : 2);
    assert.deepEqual(fixture.migrations.map(m => [m.id, m.state]), [['0001_venue_fulfilment', 'applied'], ['0002_usage_delivery', 'applied']]);
    const client = createClient({ url: localDatabase('shared') });
    try {
      assert.equal((await client.execute('SELECT id FROM signal_additive_migrations')).rows.length, 2);
      assert.equal((await client.execute('SELECT * FROM usage_erasure_tombstones')).rows.length, 0);
      assert.equal((await client.execute("SELECT name FROM sqlite_master WHERE type='trigger' AND name='venue_fulfilment_manifest_immutable'")).rows.length, 1);
    } finally { client.close(); }
  }
});
