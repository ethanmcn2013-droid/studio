CREATE TABLE IF NOT EXISTS sponsor_programmes (
 id TEXT PRIMARY KEY, sponsor_id TEXT NOT NULL UNIQUE REFERENCES sponsors(id),
 kind TEXT NOT NULL CHECK(kind IN ('venue','student','teacher','individual')),
 timezone TEXT NOT NULL, agreement_version TEXT NOT NULL,
 measurement_starts_on TEXT NOT NULL, status TEXT NOT NULL CHECK(status IN ('internal','disabled','restricted')),
 policy_version TEXT NOT NULL DEFAULT 'sponsor-cohort.v1',
 feedback_collection TEXT NOT NULL DEFAULT 'disabled' CHECK(feedback_collection IN ('disabled','enabled'))
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS sponsor_programme_members (
 programme_id TEXT NOT NULL REFERENCES sponsor_programmes(id), subject_id TEXT NOT NULL,
 capability TEXT NOT NULL CHECK(capability IN ('report_read','report_export','invitation_admin')),
 expires_at INTEGER NOT NULL, revoked_at INTEGER,
 PRIMARY KEY(programme_id,subject_id,capability)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS sponsor_programme_contributions (
 programme_id TEXT NOT NULL REFERENCES sponsor_programmes(id), unit_key TEXT NOT NULL,
 epoch TEXT NOT NULL, workspace_hash TEXT NOT NULL, subject_hash TEXT NOT NULL,
 local_date TEXT NOT NULL, expires_at INTEGER NOT NULL,
 PRIMARY KEY(programme_id,unit_key,epoch,subject_hash,local_date)
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS sponsor_programme_contribution_expiry ON sponsor_programme_contributions(expires_at);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS sponsor_programme_coverage (
 programme_id TEXT NOT NULL REFERENCES sponsor_programmes(id), local_date TEXT NOT NULL,
 epoch TEXT NOT NULL, evidence_ref TEXT NOT NULL,
 PRIMARY KEY(programme_id,local_date)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS sponsor_programme_reports (
 id TEXT PRIMARY KEY, programme_id TEXT NOT NULL REFERENCES sponsor_programmes(id),
 sponsor_id TEXT NOT NULL, claim_month TEXT NOT NULL, policy_version TEXT NOT NULL,
 epoch TEXT, state TEXT NOT NULL CHECK(state IN ('released','restricted')),
 payload_json TEXT, content_hash TEXT NOT NULL, released_at INTEGER NOT NULL,
 expires_at INTEGER NOT NULL, UNIQUE(programme_id,claim_month)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS sponsor_programme_release_units (
 sponsor_id TEXT NOT NULL, unit_key TEXT NOT NULL, report_id TEXT NOT NULL REFERENCES sponsor_programme_reports(id),
 PRIMARY KEY(sponsor_id,unit_key)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS sponsor_programme_invitations (
 programme_id TEXT NOT NULL REFERENCES sponsor_programmes(id), license_code_id TEXT NOT NULL REFERENCES license_codes(id),
 issued_at INTEGER NOT NULL, issuance_evidence TEXT NOT NULL,
 delivered_at INTEGER, delivery_evidence TEXT,
 PRIMARY KEY(programme_id,license_code_id)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS sponsor_programme_feedback (
 programme_id TEXT NOT NULL REFERENCES sponsor_programmes(id), unit_key TEXT NOT NULL,
 claim_month TEXT NOT NULL, useful INTEGER NOT NULL CHECK(useful IN (0,1)),
 submitted_at INTEGER NOT NULL, expires_at INTEGER NOT NULL,
 PRIMARY KEY(programme_id,unit_key)
);
