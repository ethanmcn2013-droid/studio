CREATE TABLE IF NOT EXISTS venue_sponsor_mirrors (
  sponsor_id text PRIMARY KEY NOT NULL REFERENCES sponsors(id),
  studio_sponsor_id text NOT NULL UNIQUE,
  sponsor_slug text NOT NULL UNIQUE,
  created_at integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS venue_fulfilment_requests (
  id text PRIMARY KEY NOT NULL,
  sponsor_id text NOT NULL REFERENCES sponsors(id),
  studio_sponsor_id text NOT NULL,
  request_json text NOT NULL,
  manifest_json text NOT NULL,
  manifest_hash text NOT NULL,
  operator_id text NOT NULL,
  operator_name text NOT NULL,
  withdrawals_json text NOT NULL DEFAULT '[]',
  delivery_state text NOT NULL DEFAULT 'pending' CHECK (delivery_state IN ('pending','fulfilled')),
  revision integer NOT NULL DEFAULT 0,
  fulfilled_at integer,
  readback_json text,
  last_error text,
  created_at integer NOT NULL,
  updated_at integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS venue_fulfilment_sponsor_idx ON venue_fulfilment_requests(sponsor_id);
--> statement-breakpoint
CREATE TRIGGER IF NOT EXISTS venue_sponsor_mirrors_immutable BEFORE UPDATE ON venue_sponsor_mirrors
BEGIN SELECT RAISE(ABORT, 'venue sponsor mapping is immutable'); END;
--> statement-breakpoint
CREATE TRIGGER IF NOT EXISTS venue_fulfilment_manifest_immutable BEFORE UPDATE ON venue_fulfilment_requests
WHEN NEW.id IS NOT OLD.id OR NEW.sponsor_id IS NOT OLD.sponsor_id OR NEW.studio_sponsor_id IS NOT OLD.studio_sponsor_id
  OR NEW.request_json IS NOT OLD.request_json OR NEW.manifest_json IS NOT OLD.manifest_json
  OR NEW.manifest_hash IS NOT OLD.manifest_hash OR NEW.operator_id IS NOT OLD.operator_id
  OR NEW.operator_name IS NOT OLD.operator_name OR NEW.created_at IS NOT OLD.created_at
BEGIN SELECT RAISE(ABORT, 'venue issuance manifest is immutable'); END;
