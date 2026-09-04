import assert from 'node:assert/strict';
import { test } from 'node:test';
import { seedFixture } from './fixture';

test('synthetic states distinguish empty, legacy claims, verified receipts and failed reads', async () => {
  for (const scenario of ['empty', 'legacy', 'populated', 'dense', 'partial-failure', 'error'] as const) {
    const fixture = await seedFixture(scenario);
    assert.equal(fixture.synthetic, true);
    assert.equal(fixture.providerCalls, 0);
    assert.equal(fixture.expectedCash, ['partial-failure', 'error'].includes(scenario) ? null : ['empty', 'legacy'].includes(scenario) ? 0 : 2500);
    assert.equal(fixture.verifiedReceipts, ['empty', 'legacy'].includes(scenario) ? 0 : 2);
  }
});
