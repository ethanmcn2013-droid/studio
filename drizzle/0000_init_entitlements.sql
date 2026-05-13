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
CREATE INDEX `entitlements_status_expires_at_idx` ON `entitlements` (`status`,`expires_at`);