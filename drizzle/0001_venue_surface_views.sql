CREATE TABLE `venue_surface_views` (
	`surface` text NOT NULL,
	`day` text NOT NULL,
	`views` integer DEFAULT 0 NOT NULL,
	`first_recorded_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	PRIMARY KEY(`surface`, `day`)
);
--> statement-breakpoint
CREATE INDEX `venue_surface_views_day_idx` ON `venue_surface_views` (`day`);