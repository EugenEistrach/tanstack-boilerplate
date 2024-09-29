CREATE TABLE `note` (
	`id` text PRIMARY KEY NOT NULL,
	`content` text NOT NULL,
	`owner_id` text NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`owner_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `permission` (
	`id` text PRIMARY KEY NOT NULL,
	`action` text NOT NULL,
	`resource` text NOT NULL,
	`access` text NOT NULL,
	`description` text,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `role` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `role_to_permission` (
	`role_id` text NOT NULL,
	`permission_id` text NOT NULL,
	PRIMARY KEY(`role_id`, `permission_id`),
	FOREIGN KEY (`role_id`) REFERENCES `role`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`permission_id`) REFERENCES `permission`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
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
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`avatar_url` text,
	`name` text,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `user_to_role` (
	`user_id` text NOT NULL,
	`role_id` text NOT NULL,
	PRIMARY KEY(`user_id`, `role_id`),
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`role_id`) REFERENCES `role`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `action_resource_access_unique` ON `permission` (`action`,`resource`,`access`);--> statement-breakpoint
CREATE UNIQUE INDEX `role_name_unique` ON `role` (`name`);--> statement-breakpoint
CREATE INDEX `provider_account_id_idx` ON `oauth_account` (`provider`,`provider_account_id`);
--> statement-breakpoint
INSERT INTO permission VALUES('bnmn9ujrm6gmdnh3whvof8au','create','notes','own',NULL,1727639087,1727639087);
--> statement-breakpoint
INSERT INTO permission VALUES('z0vgyfy6lxzlyffqoullno33','create','notes','any',NULL,1727639087,1727639087);
--> statement-breakpoint
INSERT INTO permission VALUES('sej6knq4kgwws0lv70143eeq','read','notes','own',NULL,1727639087,1727639087);
--> statement-breakpoint
INSERT INTO permission VALUES('pkcwayb18avzoljf92h32wy6','read','notes','any',NULL,1727639087,1727639087);
--> statement-breakpoint
INSERT INTO permission VALUES('fvtvr66so1gpvvf50ganilhj','update','notes','own',NULL,1727639087,1727639087);
--> statement-breakpoint
INSERT INTO permission VALUES('zahrrbau3omg2phn1zlsd2yp','update','notes','any',NULL,1727639087,1727639087);
--> statement-breakpoint
INSERT INTO permission VALUES('w1jx8shff39hbubqinlcavi7','delete','notes','own',NULL,1727639087,1727639087);
--> statement-breakpoint
INSERT INTO permission VALUES('jvp1vgrhvkorj2dsyiqvtrip','delete','notes','any',NULL,1727639087,1727639087);
--> statement-breakpoint
INSERT INTO role VALUES('f43wd6mi1nu2bp0fsiupvbw7','admin','Admin role',1727639087,1727639087);
--> statement-breakpoint
INSERT INTO role VALUES('hlny4ysz83g08wg8s487e42b','user','User role',1727639087,1727639087);
--> statement-breakpoint
INSERT INTO role_to_permission VALUES('f43wd6mi1nu2bp0fsiupvbw7','z0vgyfy6lxzlyffqoullno33');
--> statement-breakpoint
INSERT INTO role_to_permission VALUES('f43wd6mi1nu2bp0fsiupvbw7','pkcwayb18avzoljf92h32wy6');
--> statement-breakpoint
INSERT INTO role_to_permission VALUES('f43wd6mi1nu2bp0fsiupvbw7','zahrrbau3omg2phn1zlsd2yp');
--> statement-breakpoint
INSERT INTO role_to_permission VALUES('f43wd6mi1nu2bp0fsiupvbw7','jvp1vgrhvkorj2dsyiqvtrip');
--> statement-breakpoint
INSERT INTO role_to_permission VALUES('hlny4ysz83g08wg8s487e42b','bnmn9ujrm6gmdnh3whvof8au');
--> statement-breakpoint
INSERT INTO role_to_permission VALUES('hlny4ysz83g08wg8s487e42b','sej6knq4kgwws0lv70143eeq');
--> statement-breakpoint
INSERT INTO role_to_permission VALUES('hlny4ysz83g08wg8s487e42b','fvtvr66so1gpvvf50ganilhj');
--> statement-breakpoint
INSERT INTO role_to_permission VALUES('hlny4ysz83g08wg8s487e42b','w1jx8shff39hbubqinlcavi7');
