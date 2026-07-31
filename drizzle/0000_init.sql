CREATE TABLE `cron_runs` (
	`id` text PRIMARY KEY NOT NULL,
	`source` text NOT NULL,
	`ran_at` integer NOT NULL,
	`ok` integer NOT NULL,
	`considered` integer,
	`sent` integer,
	`skipped` integer,
	`failed` integer,
	`is_monday_utc` integer,
	`notes` text,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `cron_runs_source_ran_at_idx` ON `cron_runs` (`source`,`ran_at`);--> statement-breakpoint
CREATE TABLE `entitlements` (
	`id` text PRIMARY KEY NOT NULL,
	`user_clerk_id` text NOT NULL,
	`tier` text NOT NULL,
	`source` text NOT NULL,
	`source_ref` text,
	`granted_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`expires_at` integer,
	`status` text DEFAULT 'active' NOT NULL,
	`metadata` text,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `entitlements_user_clerk_id_idx` ON `entitlements` (`user_clerk_id`);--> statement-breakpoint
CREATE INDEX `entitlements_status_expires_at_idx` ON `entitlements` (`status`,`expires_at`);--> statement-breakpoint
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
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`sponsor_id`) REFERENCES `sponsors`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `license_codes_code_unique` ON `license_codes` (`code`);--> statement-breakpoint
CREATE INDEX `license_codes_sponsor_id_idx` ON `license_codes` (`sponsor_id`);--> statement-breakpoint
CREATE INDEX `license_codes_status_idx` ON `license_codes` (`status`);--> statement-breakpoint
CREATE TABLE `prospects` (
	`id` text PRIMARY KEY NOT NULL,
	`organisation` text NOT NULL,
	`segment` text DEFAULT 'venue' NOT NULL,
	`country` text DEFAULT 'IE' NOT NULL,
	`category` text DEFAULT '' NOT NULL,
	`flags` text DEFAULT '' NOT NULL,
	`contact_name` text DEFAULT '' NOT NULL,
	`role` text DEFAULT '' NOT NULL,
	`email` text DEFAULT '' NOT NULL,
	`phone` text DEFAULT '' NOT NULL,
	`website` text DEFAULT '' NOT NULL,
	`location` text DEFAULT '' NOT NULL,
	`address` text DEFAULT '' NOT NULL,
	`county` text DEFAULT '' NOT NULL,
	`org_group` text DEFAULT '' NOT NULL,
	`inbox_type` text DEFAULT '' NOT NULL,
	`tier` text DEFAULT '' NOT NULL,
	`source` text DEFAULT '' NOT NULL,
	`stage` text DEFAULT 'to_contact' NOT NULL,
	`last_contacted_at` text,
	`next_follow_up_at` text,
	`personalisation_note` text DEFAULT '' NOT NULL,
	`offer_sent` text DEFAULT '' NOT NULL,
	`outcome` text DEFAULT '' NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `prospects_stage_idx` ON `prospects` (`stage`);--> statement-breakpoint
CREATE INDEX `prospects_segment_idx` ON `prospects` (`segment`);--> statement-breakpoint
CREATE INDEX `prospects_country_idx` ON `prospects` (`segment`,`country`);--> statement-breakpoint
CREATE INDEX `prospects_next_follow_up_idx` ON `prospects` (`next_follow_up_at`);--> statement-breakpoint
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
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sponsors_slug_unique` ON `sponsors` (`slug`);--> statement-breakpoint
CREATE INDEX `sponsors_venue_plan_idx` ON `sponsors` (`venue_plan`);--> statement-breakpoint
CREATE TABLE `waitlist_entries` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text,
	`use_case` text,
	`note` text,
	`source` text,
	`campaign` text,
	`audience` text,
	`artifact` text,
	`touch` text,
	`referrer` text,
	`path` text,
	`user_agent` text,
	`status` text DEFAULT 'waiting' NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`last_submitted_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `waitlist_entries_email_unique` ON `waitlist_entries` (`email`);--> statement-breakpoint
CREATE INDEX `waitlist_entries_status_created_at_idx` ON `waitlist_entries` (`status`,`created_at`);--> statement-breakpoint
CREATE INDEX `waitlist_entries_use_case_idx` ON `waitlist_entries` (`use_case`);--> statement-breakpoint
CREATE INDEX `waitlist_entries_source_idx` ON `waitlist_entries` (`source`);