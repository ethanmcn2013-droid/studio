/** Synthetic read fixtures only. No environment-supplied database is opened. */
import assert from 'node:assert/strict';
import { createClient, type Client } from '@libsql/client';
import { getTableConfig } from 'drizzle-orm/sqlite-core';
import * as sharedSchema from '../../../src/lib/entitlements-db/schema';
import * as studioSchema from '../../../src/lib/db/schema';
import { localDatabase, fixturePerson } from './environment.mjs';
import { applyVenueFulfilmentMigration } from '../../migrate-venue-fulfilment.mjs';
import { applyUsageDeliveryMigration } from '../../migrate-usage-delivery.mjs';

const scenarios = ['empty', 'populated', 'dense', 'error', 'person-unavailable', 'person-revoked', 'partner-unavailable', 'health-green', 'health-amber', 'health-red-stale', 'health-red-failed', 'health-unread'] as const;
type Scenario = typeof scenarios[number];
const quote = (s: string) => `"${s.replaceAll('"', '""')}"`;

async function reset(client: Client, schema: typeof sharedSchema | typeof studioSchema) {
  // Reuses January's real-column read fixture pattern. This does not test
  // migrations, constraints, payments, code issuance or provider writes.
  for (const value of Object.values(schema)) {
    let config;
    try { config = getTableConfig(value as Parameters<typeof getTableConfig>[0]); } catch { continue; }
    await client.execute(`DROP TABLE IF EXISTS ${quote(config.name)}`);
    if (['venue_sponsor_mirrors','venue_fulfilment_requests'].includes(config.name)) continue;
    await client.execute(`CREATE TABLE ${quote(config.name)} (${config.columns.map(c => `${quote(c.name)} ${c.getSQLType()}${c.primary ? ' PRIMARY KEY' : ''}`).join(',')})`);
  }
}
async function insert(client: Client, table: string, values: Record<string, string | number | null>) {
  await client.execute({ sql: `INSERT INTO ${quote(table)} (${Object.keys(values).map(quote).join(',')}) VALUES (${Object.keys(values).map(() => '?').join(',')})`, args: Object.values(values) });
}
export async function seedExtension(scenario: Scenario) {
  assert.ok(scenarios.includes(scenario), 'Unknown extension scenario');
  const shared = createClient({ url: localDatabase('shared') });
  const studio = createClient({ url: localDatabase('studio') });
  try {
    for (const table of ['usage_subject_workspaces','usage_erasure_tombstones','signal_additive_migrations']) await shared.execute(`DROP TABLE IF EXISTS ${quote(table)}`);
    await reset(shared, sharedSchema); await reset(studio, studioSchema);
    // These additive runtime tables have their actual owning ledger and fences.
    // Baseline tables above remain real-column read fixtures, not migration proof.
    const migrations = [await applyVenueFulfilmentMigration(shared),await applyUsageDeliveryMigration(shared)];
    const count = scenario === 'empty' ? 0 : scenario === 'dense' ? 36 : 3;
    const now = Date.now();
    for (let i = 0; i < count; i++) {
      await insert(studio, 'waitlist_entries', {
        id: `synthetic-waitlist-${i}`, email: `person-${i}@example.invalid`,
        name: scenario === 'dense' ? `Synthetic person ${i} with a deliberately long recorded display name` : `Synthetic person ${i}`,
        use_case: ['students', 'venues', 'other'][i % 3],
        note: scenario === 'dense' ? 'Synthetic private fixture note. '.repeat(30) : 'Synthetic fixture only; never an operator or customer record.',
        source: scenario === 'dense' ? 'synthetic browser review with a deliberately long attribution label' : 'synthetic-review',
        artifact: scenario === 'dense' ? 'Synthetic recorded attribution for wrapping across narrow viewports' : null,
        status: 'waiting', created_at: now - i * 1000, updated_at: now - i * 1000, last_submitted_at: now - i * 1000,
      });
      await insert(shared, 'entitlements', {
        id: `synthetic-grant-${i}`, user_clerk_id: fixturePerson, tier: 'workspace', source: 'review_access',
        source_ref: scenario === 'dense' ? `Synthetic recorded review grant ${i} with a long source description` : `synthetic-${i}`,
        status: scenario === 'person-revoked' || i === 1 ? 'revoked' : 'active', granted_at: now, created_at: now, updated_at: now,
      });
      await insert(shared, 'entitlement_events', {
        id: `synthetic-event-${i}`, user_clerk_id: fixturePerson, action: 'grant', actor_name: 'Synthetic Operator',
        reason: scenario === 'dense' ? 'Synthetic read-only review history with long explanatory text. '.repeat(6) : 'Synthetic fixture history', created_at: now - i * 1000,
      });
      await insert(shared, 'sponsors', { id: `synthetic-sponsor-${i}`, slug: `synthetic-venue-${i}`, name: `Synthetic venue ${i}`,
        contact_email: `venue-${i}@example.invalid`, kind: 'venue', venue_plan: 'pilot', code_allotment: 2, codes_issued: 0, created_at: now, updated_at: now });
      // Historical display rows only; deliberately invalid bearer strings and
      // no App destination or canonical issuance. Never presented as fulfilment.
      await insert(shared,'license_codes',{id:`synthetic-code-${i}`,sponsor_id:`synthetic-sponsor-${i}`,code:`NOT-REDEEMABLE-FIXTURE-${i}`,
        status:'redeemed',source_type:'review_access',tier:'workspace',created_at:now,updated_at:now});
      await insert(shared,'redemptions',{id:`synthetic-redemption-${i}`,code_id:`synthetic-code-${i}`,user_clerk_id:fixturePerson,
        entitlement_id:i===1?null:`synthetic-grant-${i}`,redeemed_at:now-i*1000});
    }
    if (count) await insert(studio, 'cron_runs', {
      id: 'synthetic-health', source: 'analytics_daily', ran_at: now - (scenario === 'health-amber' ? 18 : scenario === 'health-red-stale' ? 30 : 1) * 3600000,
      ok: scenario === 'health-red-failed' ? 0 : 1, sent: 0, failed: scenario === 'health-red-failed' ? 1 : 0,
      notes: scenario === 'dense' ? 'Synthetic health read with no scheduled execution or provider call. '.repeat(15) : 'Synthetic health fixture; no cron executed.',
    });
    assert.equal(Number((await studio.execute('SELECT count(*) n FROM waitlist_entries')).rows[0].n), count);
    assert.equal(Number((await shared.execute('SELECT count(*) n FROM entitlements')).rows[0].n), count);
    // A single real query fails: the page must render its own catch branch.
    if (scenario === 'error') await studio.execute('DROP TABLE waitlist_entries');
    if (scenario === 'person-unavailable') await shared.execute('DROP TABLE entitlements');
    if (scenario === 'partner-unavailable') await shared.execute('DROP TABLE sponsors');
    if (scenario === 'health-unread') await studio.execute('DROP TABLE cron_runs');
    return { synthetic: true, providerCalls: 0, scenario, seededAt: now, migrations,
      expectedWaitlistCount: scenario === 'error' ? null : count, expectedPersonRows: scenario === 'person-unavailable' ? null : count,
      expectedHealth: !count || scenario === 'health-unread' ? 'Never run' : scenario === 'health-amber' ? 'Amber' : scenario.startsWith('health-red') ? 'Red' : 'Green',
      person: fixturePerson };
  } finally { shared.close(); studio.close(); }
}
if (process.argv[1]?.endsWith('fixture.ts')) seedExtension((process.argv[2] ?? 'populated') as Scenario).then(r => console.log(JSON.stringify(r)));
