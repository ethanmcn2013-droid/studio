ALTER TABLE `sponsors` ADD `venue_plan` text DEFAULT 'none' NOT NULL;--> statement-breakpoint
ALTER TABLE `sponsors` ADD `annual_amount_cents` integer;--> statement-breakpoint
ALTER TABLE `sponsors` ADD `founding_locked` integer;--> statement-breakpoint
ALTER TABLE `sponsors` ADD `term_starts_at` integer;--> statement-breakpoint
ALTER TABLE `sponsors` ADD `term_ends_at` integer;--> statement-breakpoint
ALTER TABLE `sponsors` ADD `paid_at` integer;--> statement-breakpoint
ALTER TABLE `sponsors` ADD `code_allotment` integer;--> statement-breakpoint
CREATE INDEX `sponsors_venue_plan_idx` ON `sponsors` (`venue_plan`);