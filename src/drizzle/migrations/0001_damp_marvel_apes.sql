CREATE TABLE `user_onboarding_info` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text,
	`favoriteColor` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
