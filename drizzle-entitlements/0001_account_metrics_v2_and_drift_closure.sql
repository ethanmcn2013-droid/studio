-- 0001 — retire venue-metrics.v1 as a stored name, and close the six-column
-- drift between src/lib/entitlements-db/schema.ts and 0000_init.sql.
--
-- Statement order is hand-corrected from the generator output and the
-- correction is load-bearing. drizzle-kit emitted CREATE INDEX
-- entitlements_wedding_date_idx before ALTER TABLE entitlements ADD
-- wedding_date, and emitted a bare DROP INDEX for an index the baseline
-- never created. Either one aborts the run part-way through, after 13
-- indexes have already been dropped. Both were found by applying the set to
-- a fresh database (scripts/check-entitlements-migrations.mjs), not by
-- reading it. Order here is: drop indexes, change defaults, add columns,
-- rebuild indexes.
DROP INDEX IF EXISTS "allotment_ledger_sponsor_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "entitlement_events_user_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "entitlement_events_entitlement_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "entitlement_events_batch_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "entitlement_events_sponsor_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "entitlement_events_action_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "entitlement_events_actor_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "entitlements_user_clerk_id_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "entitlements_status_expires_at_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "entitlements_stripe_customer_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "entitlements_stripe_subscription_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "entitlements_batch_id_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "entitlements_email_hash_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "entitlements_wedding_date_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "grant_batches_slug_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "license_codes_code_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "license_codes_sponsor_id_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "license_codes_status_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "license_codes_batch_id_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "license_codes_sponsor_delivered_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "license_codes_expires_at_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "processed_webhooks_source_event_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "redemptions_code_id_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "redemptions_user_clerk_id_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "sponsor_activations_sponsor_state_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "sponsor_activations_owner_state_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "sponsor_activations_workspace_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "sponsor_activations_entitlement_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "sponsor_activations_sponsor_reference_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "sponsor_consent_grants_activation_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "sponsor_consent_grants_owner_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "sponsor_consent_grants_revoked_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "sponsor_report_snapshots_sponsor_period_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "sponsor_report_snapshots_frozen_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "sponsor_requests_sponsor_state_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "sponsor_requests_created_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "sponsor_usage_daily_sponsor_date_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "sponsor_usage_daily_epoch_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "sponsor_usage_events_sponsor_date_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "sponsor_usage_events_occurred_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "sponsor_usage_events_state_date_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "sponsor_workspace_lifecycle_last_action_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "sponsor_workspace_lifecycle_first_action_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "sponsors_slug_unique";--> statement-breakpoint
ALTER TABLE `sponsor_report_snapshots` ALTER COLUMN "metric_dictionary_version" TO "metric_dictionary_version" text NOT NULL DEFAULT 'account-metrics.v2';--> statement-breakpoint
ALTER TABLE `sponsor_usage_daily` ALTER COLUMN "metric_dictionary_version" TO "metric_dictionary_version" text NOT NULL DEFAULT 'account-metrics.v2';--> statement-breakpoint
ALTER TABLE `entitlements` ADD `wedding_date` integer;--> statement-breakpoint
ALTER TABLE `sponsors` ADD `founding_number` integer;--> statement-breakpoint
ALTER TABLE `sponsors` ADD `founding_number_assigned_at` integer;--> statement-breakpoint
ALTER TABLE `sponsors` ADD `allotment_mode` text DEFAULT 'limited' NOT NULL;--> statement-breakpoint
ALTER TABLE `sponsors` ADD `annual_wedding_count` integer;--> statement-breakpoint
ALTER TABLE `sponsors` ADD `fair_use_ceiling` integer;--> statement-breakpoint
CREATE INDEX `allotment_ledger_sponsor_idx` ON `allotment_ledger` (`sponsor_id`);--> statement-breakpoint
CREATE INDEX `entitlement_events_user_idx` ON `entitlement_events` (`user_clerk_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `entitlement_events_entitlement_idx` ON `entitlement_events` (`entitlement_id`);--> statement-breakpoint
CREATE INDEX `entitlement_events_batch_idx` ON `entitlement_events` (`batch_id`);--> statement-breakpoint
CREATE INDEX `entitlement_events_sponsor_idx` ON `entitlement_events` (`sponsor_id`);--> statement-breakpoint
CREATE INDEX `entitlement_events_action_idx` ON `entitlement_events` (`action`);--> statement-breakpoint
CREATE INDEX `entitlement_events_actor_idx` ON `entitlement_events` (`actor_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `entitlements_user_clerk_id_idx` ON `entitlements` (`user_clerk_id`);--> statement-breakpoint
CREATE INDEX `entitlements_status_expires_at_idx` ON `entitlements` (`status`,`expires_at`);--> statement-breakpoint
CREATE INDEX `entitlements_stripe_customer_idx` ON `entitlements` (`stripe_customer_id`);--> statement-breakpoint
CREATE INDEX `entitlements_stripe_subscription_idx` ON `entitlements` (`stripe_subscription_id`);--> statement-breakpoint
CREATE INDEX `entitlements_batch_id_idx` ON `entitlements` (`batch_id`);--> statement-breakpoint
CREATE INDEX `entitlements_email_hash_idx` ON `entitlements` (`email_hash`);--> statement-breakpoint
CREATE INDEX `entitlements_wedding_date_idx` ON `entitlements` (`wedding_date`);--> statement-breakpoint
CREATE UNIQUE INDEX `grant_batches_slug_unique` ON `grant_batches` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `license_codes_code_unique` ON `license_codes` (`code`);--> statement-breakpoint
CREATE INDEX `license_codes_sponsor_id_idx` ON `license_codes` (`sponsor_id`);--> statement-breakpoint
CREATE INDEX `license_codes_status_idx` ON `license_codes` (`status`);--> statement-breakpoint
CREATE INDEX `license_codes_batch_id_idx` ON `license_codes` (`batch_id`);--> statement-breakpoint
CREATE INDEX `license_codes_sponsor_delivered_idx` ON `license_codes` (`sponsor_id`,`delivered_at`);--> statement-breakpoint
CREATE INDEX `license_codes_expires_at_idx` ON `license_codes` (`expires_at`);--> statement-breakpoint
CREATE INDEX `processed_webhooks_source_event_idx` ON `processed_webhooks` (`source`,`event_id`);--> statement-breakpoint
CREATE INDEX `redemptions_code_id_idx` ON `redemptions` (`code_id`);--> statement-breakpoint
CREATE INDEX `redemptions_user_clerk_id_idx` ON `redemptions` (`user_clerk_id`);--> statement-breakpoint
CREATE INDEX `sponsor_activations_sponsor_state_idx` ON `sponsor_activations` (`sponsor_id`,`state`);--> statement-breakpoint
CREATE INDEX `sponsor_activations_owner_state_idx` ON `sponsor_activations` (`owner_subject_id`,`state`);--> statement-breakpoint
CREATE INDEX `sponsor_activations_workspace_idx` ON `sponsor_activations` (`canonical_workspace_id`);--> statement-breakpoint
CREATE INDEX `sponsor_activations_entitlement_idx` ON `sponsor_activations` (`entitlement_id`);--> statement-breakpoint
CREATE INDEX `sponsor_activations_sponsor_reference_idx` ON `sponsor_activations` (`sponsor_id`,`sponsor_season_reference`,`sponsor_local_reference`);--> statement-breakpoint
CREATE INDEX `sponsor_consent_grants_activation_idx` ON `sponsor_consent_grants` (`activation_id`);--> statement-breakpoint
CREATE INDEX `sponsor_consent_grants_owner_idx` ON `sponsor_consent_grants` (`granted_by_owner_subject_id`);--> statement-breakpoint
CREATE INDEX `sponsor_consent_grants_revoked_idx` ON `sponsor_consent_grants` (`revoked_at`);--> statement-breakpoint
CREATE INDEX `sponsor_report_snapshots_sponsor_period_idx` ON `sponsor_report_snapshots` (`sponsor_id`,`period_start`,`period_end`);--> statement-breakpoint
CREATE INDEX `sponsor_report_snapshots_frozen_idx` ON `sponsor_report_snapshots` (`frozen_at`);--> statement-breakpoint
CREATE INDEX `sponsor_requests_sponsor_state_idx` ON `sponsor_requests` (`sponsor_id`,`state`);--> statement-breakpoint
CREATE INDEX `sponsor_requests_created_idx` ON `sponsor_requests` (`created_at`);--> statement-breakpoint
CREATE INDEX `sponsor_usage_daily_sponsor_date_idx` ON `sponsor_usage_daily` (`sponsor_id`,`local_date`);--> statement-breakpoint
CREATE INDEX `sponsor_usage_daily_epoch_idx` ON `sponsor_usage_daily` (`sponsor_id`,`hash_salt_epoch`);--> statement-breakpoint
CREATE INDEX `sponsor_usage_events_sponsor_date_idx` ON `sponsor_usage_events` (`sponsor_id`,`local_date`,`workspace_id_hash`);--> statement-breakpoint
CREATE INDEX `sponsor_usage_events_occurred_idx` ON `sponsor_usage_events` (`occurred_at`);--> statement-breakpoint
CREATE INDEX `sponsor_usage_events_state_date_idx` ON `sponsor_usage_events` (`attribution_state`,`local_date`);--> statement-breakpoint
CREATE INDEX `sponsor_workspace_lifecycle_last_action_idx` ON `sponsor_workspace_lifecycle` (`sponsor_id`,`hash_salt_epoch`,`last_action_local_date`);--> statement-breakpoint
CREATE INDEX `sponsor_workspace_lifecycle_first_action_idx` ON `sponsor_workspace_lifecycle` (`sponsor_id`,`hash_salt_epoch`,`first_action_local_date`);--> statement-breakpoint
CREATE UNIQUE INDEX `sponsors_slug_unique` ON `sponsors` (`slug`);
