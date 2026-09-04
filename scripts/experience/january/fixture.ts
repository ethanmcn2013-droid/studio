/** Disposable SQLite fixtures; never connects to environment-supplied URLs. */
import assert from 'node:assert/strict';
import { createClient, type Client } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { getTableConfig } from 'drizzle-orm/sqlite-core';
import * as sharedSchema from '../../../src/lib/entitlements-db/schema';
import * as studioSchema from '../../../src/lib/db/schema';
import { recordVenuePayment } from '../../../src/lib/entitlements-db/venue-payment';
import { matchesCurrentVenuePayment } from '../../../src/lib/entitlements-db/venue-payment-proof';
import { localDatabase } from './environment.mjs';

const scenarios = ['empty', 'legacy', 'populated', 'dense', 'partial-failure', 'error'] as const;
type Scenario = typeof scenarios[number];
const quote = (value: string) => `"${value.replaceAll('"', '""')}"`;

async function reset(client: Client, schema: typeof sharedSchema | typeof studioSchema) {
  // Same real schema columns as the earlier HQ truth fixture. This is a read-
  // surface fixture, not evidence for migrations, constraints or provider writes.
  for (const value of Object.values(schema)) {
    let config;
    try { config = getTableConfig(value as Parameters<typeof getTableConfig>[0]); } catch { continue; }
    await client.execute(`DROP TABLE IF EXISTS ${quote(config.name)}`);
    await client.execute(`CREATE TABLE ${quote(config.name)} (${config.columns.map(c => `${quote(c.name)} ${c.getSQLType()}${c.primary ? ' PRIMARY KEY' : ''}`).join(',')})`);
  }
}

async function insert(client: Client, table: string, values: Record<string, string | number | null>) {
  const columns = new Set((await client.execute(`PRAGMA table_info(${quote(table)})`)).rows.map(row => String(row.name)));
  const present = Object.fromEntries(Object.entries(values).filter(([name]) => columns.has(name)));
  await client.execute({ sql: `INSERT INTO ${quote(table)} (${Object.keys(present).map(quote).join(',')}) VALUES (${Object.keys(present).map(() => '?').join(',')})`, args: Object.values(present) });
}

export async function seedFixture(scenario: Scenario) {
  assert.ok(scenarios.includes(scenario), 'Unknown scenario');
  process.env.SIGNAL_HQ_OPERATORS = 'test-operator:Synthetic Operator';
  const sharedClient = createClient({ url: localDatabase('shared') });
  const studioClient = createClient({ url: localDatabase('studio') });
  try {
    await reset(sharedClient, sharedSchema);
    await reset(studioClient, studioSchema);
    if (scenario !== 'empty') {
      const now = Date.now();
      const count = scenario === 'dense' ? 36 : 3;
      for (let index = 0; index < count; index++) {
        const id = `synthetic-venue-${index}`;
        for (const client of [sharedClient, studioClient]) {
          await insert(client, 'sponsors', {
            id, slug: id, name: scenario === 'dense' ? `Synthetic venue ${index} — a deliberately long establishment name for responsive layout evidence` : `Synthetic venue ${index}`,
            contact_email: `venue-${index}@example.invalid`, venue_plan: index === 0 ? 'founding' : 'paid',
            code_allotment: 20, codes_issued: 0, allotment_mode: 'limited', kind: 'venue', created_at: now, updated_at: now,
            paid_at: index === 2 ? now : null, annual_amount_cents: index === 2 ? 100000 : null, founding_locked: 0,
          });
        }
      }
      // The real writer creates the claim and hash-linked receipt. No provider or
      // mail action is involved; both explicit stores are disposable local files.
      if (scenario !== 'legacy') {
        const stores = { shared: drizzle(sharedClient, { schema: sharedSchema }), studio: drizzle(studioClient, { schema: studioSchema }) };
        for (const [index, plan, amountCents] of [[0, 'founding', 100000], [1, 'paid', 150000]] as const) {
          const result = await recordVenuePayment({ slug: `synthetic-venue-${index}`, plan, amountCents, reference: `synthetic-browser-${index}`, paidAt: now, actorId: 'test-operator', actorName: 'Synthetic Operator' }, stores);
          assert.ok(result.eventId, 'Real writer must return its recorded event');
        }
      }
      const config = getTableConfig(studioSchema.prospectsTable);
      for (let index = 0; index < count; index++) {
        const values = Object.fromEntries(config.columns.map(c => [c.name, c.name.endsWith('_at') ? null : ''])) as Record<string, string | number | null>;
        Object.assign(values, { id: `synthetic-prospect-${index}`, organisation: `Synthetic unsent venue ${index}`, segment: 'venue', stage: index === 0 ? 'replied' : 'to_contact' });
        if (scenario === 'dense') Object.assign(values, { organisation: `Synthetic recorded contact ${index}`, last_contacted_at: '2026-09-01', stage: index === 0 ? 'replied' : 'contacted' });
        await insert(studioClient, config.name, values);
        await insert(sharedClient, 'entitlements', { id: `synthetic-grant-${index}`, user_clerk_id: `synthetic-person-${index}`, tier: 'workspace', source: 'compliments', status: 'active', created_at: now, updated_at: now });
      }
      await insert(sharedClient, 'grant_batches', { id: 'synthetic-batch', label: 'Synthetic cohort with a deliberately long name for the access table', kind: 'review', tier: 'workspace', reason: 'Synthetic review fixture only; no codes issued and no external messages', created_at: now, updated_at: now });
    }
    const shared = drizzle(sharedClient, { schema: sharedSchema });
    const venues = await shared.select().from(sharedSchema.sponsors);
    const events = await shared.select().from(sharedSchema.entitlementEvents);
    const verified = venues.filter(venue => events.some(event => matchesCurrentVenuePayment(venue, event, Date.now())));
    assert.equal(verified.length, ['empty', 'legacy'].includes(scenario) ? 0 : 2, 'Server proof binding must match the fixture claim');
    const expectedCash = verified.reduce((sum, venue) => sum + (venue.annualAmountCents ?? 0), 0) / 100;
    assert.equal(expectedCash, ['empty', 'legacy'].includes(scenario) ? 0 : 2500);
    // Break the real read seam. The production route must render its own unread
    // fallback; the browser runner does not replace HTML or API responses.
    if (scenario === 'partial-failure' || scenario === 'error') await sharedClient.execute('DROP TABLE entitlement_events');
    if (scenario === 'error') {
      await studioClient.execute('DROP TABLE prospects');
      await sharedClient.execute('DROP TABLE entitlements');
    }
    return { scenario, synthetic: true, providerCalls: 0, expectedCash: ['partial-failure', 'error'].includes(scenario) ? null : expectedCash, verifiedReceipts: verified.length };
  } finally { sharedClient.close(); studioClient.close(); }
}

if (process.argv[1]?.endsWith('fixture.ts')) seedFixture((process.argv[2] ?? 'populated') as Scenario).then(result => console.log(JSON.stringify(result)));
