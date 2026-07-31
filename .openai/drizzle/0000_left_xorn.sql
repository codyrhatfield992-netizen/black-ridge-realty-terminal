CREATE TABLE `buyers` (
	`id` text PRIMARY KEY NOT NULL,
	`full_name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text DEFAULT '' NOT NULL,
	`market` text NOT NULL,
	`budget_min` integer NOT NULL,
	`budget_max` integer NOT NULL,
	`down_payment` integer DEFAULT 0 NOT NULL,
	`credit_band` text DEFAULT 'Unknown' NOT NULL,
	`loan_status` text DEFAULT 'Not started' NOT NULL,
	`timeline` text DEFAULT 'Exploring' NOT NULL,
	`stage` text DEFAULT 'New inquiry' NOT NULL,
	`missing_items` text DEFAULT '' NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
