CREATE TABLE `allotment_ledger` (
	`id` text PRIMARY KEY NOT NULL,
	`sponsor_id` text NOT NULL,
	`delta` integer NOT NULL,
	`reason` text NOT NULL,
	`actor_id` text,
	`term_starts_at` integer,
	`term_ends_at` integer,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`sponsor_id`) REFERENCES `sponsors`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `allotment_ledger_sponsor_idx` ON `allotment_ledger` (`sponsor_id`);--> statement-breakpoint
CREATE TABLE `entitlement_events` (
	`id` text PRIMARY KEY NOT NULL,
	`entitlement_id` text,
	`user_clerk_id` text,
	`sponsor_id` text,
	`batch_id` text,
	`actor_id` text,
	`actor_name` text,
	`action` text NOT NULL,
	`reason` text,
	`before_json` text,
	`after_json` text,
	`origin` text,
	`prev_hash` text,
	`row_hash` text,
	`stripe_event_id` text,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `entitlement_events_user_idx` ON `entitlement_events` (`user_clerk_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `entitlement_events_entitlement_idx` ON `entitlement_events` (`entitlement_id`);--> statement-breakpoint
CREATE INDEX `entitlement_events_batch_idx` ON `entitlement_events` (`batch_id`);--> statement-breakpoint
CREATE INDEX `entitlement_events_sponsor_idx` ON `entitlement_events` (`sponsor_id`);--> statement-breakpoint
CREATE INDEX `entitlement_events_action_idx` ON `entitlement_events` (`action`);--> statement-breakpoint
CREATE INDEX `entitlement_events_actor_idx` ON `entitlement_events` (`actor_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `entitlements` (
	`id` text PRIMARY KEY NOT NULL,
	`user_clerk_id` text NOT NULL,
	`tier` text NOT NULL,
	`source` text NOT NULL,
	`source_ref` text,
	`granted_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`expires_at` integer,
	`status` text DEFAULT 'active' NOT NULL,
	`stripe_customer_id` text,
	`stripe_subscription_id` text,
	`metadata` text,
	`batch_id` text,
	`granted_by` text,
	`grant_reason` text,
	`billing_state` text,
	`grace_until` integer,
	`current_period_end` integer,
	`cancel_at_period_end` integer,
	`stripe_price_id` text,
	`email_hash` text,
	`clerk_id_dead` integer,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `entitlements_user_clerk_id_idx` ON `entitlements` (`user_clerk_id`);--> statement-breakpoint
CREATE INDEX `entitlements_status_expires_at_idx` ON `entitlements` (`status`,`expires_at`);--> statement-breakpoint
CREATE INDEX `entitlements_stripe_customer_idx` ON `entitlements` (`stripe_customer_id`);--> statement-breakpoint
CREATE INDEX `entitlements_stripe_subscription_idx` ON `entitlements` (`stripe_subscription_id`);--> statement-breakpoint
CREATE INDEX `entitlements_batch_id_idx` ON `entitlements` (`batch_id`);--> statement-breakpoint
CREATE INDEX `entitlements_email_hash_idx` ON `entitlements` (`email_hash`);--> statement-breakpoint
CREATE TABLE `grant_batches` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`label` text NOT NULL,
	`kind` text DEFAULT 'cohort' NOT NULL,
	`tier` text DEFAULT 'workspace' NOT NULL,
	`allotment` integer,
	`reason` text NOT NULL,
	`granted_by` text,
	`default_expires_at` integer,
	`perpetual` integer DEFAULT 0 NOT NULL,
	`closed_at` integer,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `grant_batches_slug_unique` ON `grant_batches` (`slug`);--> statement-breakpoint
CREATE TABLE `license_codes` (
	`id` text PRIMARY KEY NOT NULL,
	`sponsor_id` text NOT NULL,
	`code` text NOT NULL,
	`status` text DEFAULT 'minted' NOT NULL,
	`source_type` text NOT NULL,
	`tier` text NOT NULL,
	`duration_days` integer,
	`redeemed_by_user_id` text,
	`redeemed_at` integer,
	`batch_id` text,
	`recipient_email_hash` text,
	`delivered_at` integer,
	`expires_at` integer,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`sponsor_id`) REFERENCES `sponsors`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `license_codes_code_unique` ON `license_codes` (`code`);--> statement-breakpoint
CREATE INDEX `license_codes_sponsor_id_idx` ON `license_codes` (`sponsor_id`);--> statement-breakpoint
CREATE INDEX `license_codes_status_idx` ON `license_codes` (`status`);--> statement-breakpoint
CREATE INDEX `license_codes_batch_id_idx` ON `license_codes` (`batch_id`);--> statement-breakpoint
CREATE INDEX `license_codes_sponsor_delivered_idx` ON `license_codes` (`sponsor_id`,`delivered_at`);--> statement-breakpoint
CREATE INDEX `license_codes_expires_at_idx` ON `license_codes` (`expires_at`);--> statement-breakpoint
CREATE TABLE `processed_webhooks` (
	`id` text PRIMARY KEY NOT NULL,
	`source` text NOT NULL,
	`event_id` text NOT NULL,
	`processed_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `processed_webhooks_source_event_idx` ON `processed_webhooks` (`source`,`event_id`);--> statement-breakpoint
CREATE TABLE `redemptions` (
	`id` text PRIMARY KEY NOT NULL,
	`code_id` text NOT NULL,
	`user_clerk_id` text NOT NULL,
	`entitlement_id` text,
	`ip_hash` text,
	`user_agent` text,
	`redeemed_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`code_id`) REFERENCES `license_codes`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`entitlement_id`) REFERENCES `entitlements`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `redemptions_code_id_idx` ON `redemptions` (`code_id`);--> statement-breakpoint
CREATE INDEX `redemptions_user_clerk_id_idx` ON `redemptions` (`user_clerk_id`);--> statement-breakpoint
CREATE TABLE `sponsor_activations` (
	`id` text PRIMARY KEY NOT NULL,
	`sponsor_id` text NOT NULL,
	`entitlement_id` text,
	`entitlement_source` text NOT NULL,
	`entitlement_source_ref_hash` text,
	`owner_subject_id` text NOT NULL,
	`canonical_workspace_id` text,
	`sponsor_season_reference` text,
	`sponsor_local_reference` text,
	`state` text DEFAULT 'pending' NOT NULL,
	`invitation_state` text DEFAULT 'not_sent' NOT NULL,
	`invitation_sent_at` integer,
	`invitation_accepted_at` integer,
	`invitation_declined_at` integer,
	`activated_at` integer,
	`ended_at` integer,
	`revoked_at` integer,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`sponsor_id`) REFERENCES `sponsors`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`entitlement_id`) REFERENCES `entitlements`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `sponsor_activations_sponsor_state_idx` ON `sponsor_activations` (`sponsor_id`,`state`);--> statement-breakpoint
CREATE INDEX `sponsor_activations_owner_state_idx` ON `sponsor_activations` (`owner_subject_id`,`state`);--> statement-breakpoint
CREATE INDEX `sponsor_activations_workspace_idx` ON `sponsor_activations` (`canonical_workspace_id`);--> statement-breakpoint
CREATE INDEX `sponsor_activations_entitlement_idx` ON `sponsor_activations` (`entitlement_id`);--> statement-breakpoint
CREATE INDEX `sponsor_activations_sponsor_reference_idx` ON `sponsor_activations` (`sponsor_id`,`sponsor_season_reference`,`sponsor_local_reference`);--> statement-breakpoint
CREATE TABLE `sponsor_consent_grants` (
	`id` text PRIMARY KEY NOT NULL,
	`activation_id` text NOT NULL,
	`field_key` text NOT NULL,
	`policy_version` text DEFAULT 'sponsor-metadata.v1' NOT NULL,
	`receipt_version` text NOT NULL,
	`receipt_hash` text NOT NULL,
	`receipt_at` integer NOT NULL,
	`granted_by_owner_subject_id` text NOT NULL,
	`granted_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`revoked_by_owner_subject_id` text,
	`revoked_at` integer,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`activation_id`) REFERENCES `sponsor_activations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `sponsor_consent_grants_activation_idx` ON `sponsor_consent_grants` (`activation_id`);--> statement-breakpoint
CREATE INDEX `sponsor_consent_grants_owner_idx` ON `sponsor_consent_grants` (`granted_by_owner_subject_id`);--> statement-breakpoint
CREATE INDEX `sponsor_consent_grants_revoked_idx` ON `sponsor_consent_grants` (`revoked_at`);--> statement-breakpoint
CREATE TABLE `sponsor_report_snapshots` (
	`id` text PRIMARY KEY NOT NULL,
	`sponsor_id` text NOT NULL,
	`period_start` text NOT NULL,
	`period_end` text NOT NULL,
	`period_label` text NOT NULL,
	`metric_dictionary_version` text DEFAULT 'venue-metrics.v1' NOT NULL,
	`timezone` text DEFAULT 'Europe/Dublin' NOT NULL,
	`hash_salt_epoch` text NOT NULL,
	`payload_json` text NOT NULL,
	`coverage_state` text NOT NULL,
	`suppression_applied` integer DEFAULT 0 NOT NULL,
	`eligible_workspaces` integer NOT NULL,
	`content_hash` text NOT NULL,
	`data_through` integer NOT NULL,
	`frozen_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`sponsor_id`) REFERENCES `sponsors`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `sponsor_report_snapshots_sponsor_period_idx` ON `sponsor_report_snapshots` (`sponsor_id`,`period_start`,`period_end`);--> statement-breakpoint
CREATE INDEX `sponsor_report_snapshots_frozen_idx` ON `sponsor_report_snapshots` (`frozen_at`);--> statement-breakpoint
CREATE TABLE `sponsor_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`sponsor_id` text NOT NULL,
	`requesting_member_id` text NOT NULL,
	`kind` text NOT NULL,
	`requested_quantity` integer,
	`note` text DEFAULT '' NOT NULL,
	`state` text DEFAULT 'open' NOT NULL,
	`operator_actor_id` text,
	`decision_reason` text,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`decided_at` integer,
	`fulfilled_at` integer,
	FOREIGN KEY (`sponsor_id`) REFERENCES `sponsors`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `sponsor_requests_sponsor_state_idx` ON `sponsor_requests` (`sponsor_id`,`state`);--> statement-breakpoint
CREATE INDEX `sponsor_requests_created_idx` ON `sponsor_requests` (`created_at`);--> statement-breakpoint
CREATE TABLE `sponsor_usage_daily` (
	`sponsor_id` text NOT NULL,
	`local_date` text NOT NULL,
	`metric_dictionary_version` text DEFAULT 'venue-metrics.v1' NOT NULL,
	`instrumentation_version` text DEFAULT 'instrumentation.v1' NOT NULL,
	`timezone` text DEFAULT 'Europe/Dublin' NOT NULL,
	`hash_salt_epoch` text NOT NULL,
	`active_workspaces` integer NOT NULL,
	`active_subjects` integer NOT NULL,
	`first_action_workspaces` integer NOT NULL,
	`eligible_workspaces` integer NOT NULL,
	`meaningful_actions` integer NOT NULL,
	`notes_actions` integer,
	`notes_workspaces` integer,
	`tasks_actions` integer,
	`tasks_workspaces` integer,
	`timeline_actions` integer,
	`timeline_workspaces` integer,
	`signal_actions` integer,
	`signal_workspaces` integer,
	`coverage_mask` integer NOT NULL,
	`expected_mask` integer NOT NULL,
	`data_through` integer NOT NULL,
	`revision` integer DEFAULT 1 NOT NULL,
	`computed_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`last_repaired_at` integer,
	PRIMARY KEY(`sponsor_id`, `local_date`, `metric_dictionary_version`),
	FOREIGN KEY (`sponsor_id`) REFERENCES `sponsors`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `sponsor_usage_daily_sponsor_date_idx` ON `sponsor_usage_daily` (`sponsor_id`,`local_date`);--> statement-breakpoint
CREATE INDEX `sponsor_usage_daily_epoch_idx` ON `sponsor_usage_daily` (`sponsor_id`,`hash_salt_epoch`);--> statement-breakpoint
CREATE TABLE `sponsor_usage_events` (
	`event_id` text PRIMARY KEY NOT NULL,
	`instrumentation_version` text DEFAULT 'instrumentation.v1' NOT NULL,
	`product` text NOT NULL,
	`kind` text NOT NULL,
	`occurred_at` integer NOT NULL,
	`subject_id_hash` text NOT NULL,
	`workspace_id_hash` text NOT NULL,
	`sponsor_id` text,
	`attribution_state` text NOT NULL,
	`attribution_reason` text,
	`hash_salt_epoch` text NOT NULL,
	`local_date` text NOT NULL,
	`ingested_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`sponsor_id`) REFERENCES `sponsors`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `sponsor_usage_events_sponsor_date_idx` ON `sponsor_usage_events` (`sponsor_id`,`local_date`,`workspace_id_hash`);--> statement-breakpoint
CREATE INDEX `sponsor_usage_events_occurred_idx` ON `sponsor_usage_events` (`occurred_at`);--> statement-breakpoint
CREATE INDEX `sponsor_usage_events_state_date_idx` ON `sponsor_usage_events` (`attribution_state`,`local_date`);--> statement-breakpoint
CREATE TABLE `sponsor_workspace_lifecycle` (
	`sponsor_id` text NOT NULL,
	`workspace_id_hash` text NOT NULL,
	`hash_salt_epoch` text NOT NULL,
	`first_action_local_date` text NOT NULL,
	`last_action_local_date` text NOT NULL,
	`notes_last_action_local_date` text,
	`tasks_last_action_local_date` text,
	`timeline_last_action_local_date` text,
	`signal_last_action_local_date` text,
	`day30_state` text,
	`day30_sealed_at` integer,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	PRIMARY KEY(`sponsor_id`, `workspace_id_hash`, `hash_salt_epoch`),
	FOREIGN KEY (`sponsor_id`) REFERENCES `sponsors`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `sponsor_workspace_lifecycle_last_action_idx` ON `sponsor_workspace_lifecycle` (`sponsor_id`,`hash_salt_epoch`,`last_action_local_date`);--> statement-breakpoint
CREATE INDEX `sponsor_workspace_lifecycle_first_action_idx` ON `sponsor_workspace_lifecycle` (`sponsor_id`,`hash_salt_epoch`,`first_action_local_date`);--> statement-breakpoint
CREATE TABLE `sponsors` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`contact_email` text NOT NULL,
	`brand_meta` text,
	`venue_plan` text DEFAULT 'none' NOT NULL,
	`annual_amount_cents` integer,
	`founding_locked` integer,
	`term_starts_at` integer,
	`term_ends_at` integer,
	`paid_at` integer,
	`code_allotment` integer,
	`codes_issued` integer DEFAULT 0 NOT NULL,
	`kind` text DEFAULT 'venue' NOT NULL,
	`reporting_timezone` text,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sponsors_slug_unique` ON `sponsors` (`slug`);