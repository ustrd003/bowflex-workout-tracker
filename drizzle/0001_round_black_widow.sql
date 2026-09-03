CREATE INDEX `idx_cardio_entries_user_key` ON `cardio_entries` (`user_key`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_weekly_weights_user_week` ON `weekly_weights` (`user_key`,`week`);--> statement-breakpoint
CREATE INDEX `idx_workout_entries_user_key` ON `workout_entries` (`user_key`);