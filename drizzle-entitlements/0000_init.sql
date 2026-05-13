CREATE TABLE entitlements (
  id TEXT PRIMARY KEY,
  user_clerk_id TEXT NOT NULL,
  tier TEXT NOT NULL,
  source TEXT NOT NULL,
  source_ref TEXT,
  granted_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  expires_at INTEGER,
  status TEXT NOT NULL DEFAULT 'active',
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  metadata TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000)
);

CREATE INDEX entitlements_user_clerk_id_idx ON entitlements (user_clerk_id);
CREATE INDEX entitlements_status_expires_at_idx ON entitlements (status, expires_at);
CREATE INDEX entitlements_stripe_customer_idx ON entitlements (stripe_customer_id);
CREATE INDEX entitlements_stripe_subscription_idx ON entitlements (stripe_subscription_id);

CREATE TABLE sponsors (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  brand_meta TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000)
);

CREATE TABLE license_codes (
  id TEXT PRIMARY KEY,
  sponsor_id TEXT NOT NULL REFERENCES sponsors(id),
  code TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'minted',
  source_type TEXT NOT NULL,
  tier TEXT NOT NULL,
  duration_days INTEGER,
  redeemed_by_user_id TEXT,
  redeemed_at INTEGER,
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000)
);

CREATE INDEX license_codes_sponsor_id_idx ON license_codes (sponsor_id);
CREATE INDEX license_codes_status_idx ON license_codes (status);

CREATE TABLE redemptions (
  id TEXT PRIMARY KEY,
  code_id TEXT NOT NULL REFERENCES license_codes(id),
  user_clerk_id TEXT NOT NULL,
  entitlement_id TEXT REFERENCES entitlements(id),
  ip_hash TEXT,
  user_agent TEXT,
  redeemed_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000)
);

CREATE INDEX redemptions_code_id_idx ON redemptions (code_id);
CREATE INDEX redemptions_user_clerk_id_idx ON redemptions (user_clerk_id);

CREATE TABLE processed_webhooks (
  id TEXT PRIMARY KEY,
  source TEXT NOT NULL,
  event_id TEXT NOT NULL,
  processed_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000)
);

CREATE INDEX processed_webhooks_source_event_idx ON processed_webhooks (source, event_id);
