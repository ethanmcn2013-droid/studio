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
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sponsors_slug_unique` ON `sponsors` (`slug`);