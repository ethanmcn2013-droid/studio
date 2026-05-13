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
CREATE INDEX `cron_runs_source_ran_at_idx` ON `cron_runs` (`source`,`ran_at`);