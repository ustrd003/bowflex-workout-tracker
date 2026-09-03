CREATE TABLE `cardio_entries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_key` text NOT NULL,
	`week` integer NOT NULL,
	`day` text NOT NULL,
	`minutes` integer NOT NULL,
	`resistance` integer NOT NULL,
	`completed_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `weekly_weights` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_key` text NOT NULL,
	`week` integer NOT NULL,
	`weight` real NOT NULL,
	`recorded_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `workout_entries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_key` text NOT NULL,
	`week` integer NOT NULL,
	`day` text NOT NULL,
	`exercise_id` text NOT NULL,
	`set_number` integer NOT NULL,
	`resistance` real NOT NULL,
	`reps` integer NOT NULL,
	`completed_at` text NOT NULL
);
