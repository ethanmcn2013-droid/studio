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
CREATE UNIQUE INDEX `waitlist_entries_email_unique` ON `waitlist_entries` (`email`);
--> statement-breakpoint
CREATE INDEX `waitlist_entries_status_created_at_idx` ON `waitlist_entries` (`status`,`created_at`);
--> statement-breakpoint
CREATE INDEX `waitlist_entries_use_case_idx` ON `waitlist_entries` (`use_case`);
--> statement-breakpoint
CREATE INDEX `waitlist_entries_source_idx` ON `waitlist_entries` (`source`);
