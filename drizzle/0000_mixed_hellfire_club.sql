CREATE TABLE `hot_topics` (
	`id` text PRIMARY KEY NOT NULL,
	`category` text NOT NULL,
	`title` text NOT NULL,
	`answer` text NOT NULL,
	`link` text
);
--> statement-breakpoint
CREATE TABLE `stories` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`flow_data` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
