CREATE TABLE `oauth_account` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`provider` text NOT NULL,
	`provider_account_id` text NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `session` ADD `created_at` integer;--> statement-breakpoint
ALTER TABLE `session` ADD `updated_at` integer;--> statement-breakpoint
ALTER TABLE `user` ADD `email` text NOT NULL;--> statement-breakpoint
ALTER TABLE `user` ADD `avatar_url` text;--> statement-breakpoint
ALTER TABLE `user` ADD `created_at` integer;--> statement-breakpoint
ALTER TABLE `user` ADD `updated_at` integer;--> statement-breakpoint
CREATE INDEX `provider_account_id_idx` ON `oauth_account` (`provider`,`provider_account_id`);