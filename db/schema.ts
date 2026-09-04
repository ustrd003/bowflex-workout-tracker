import { index, integer, real, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const planStarts = sqliteTable("w_plan_starts", {
  userKey: text("user_key").primaryKey(),
  startDate: text("start_date").notNull(),
  startedAt: text("started_at").notNull(),
});

export const workoutEntries = sqliteTable("w_workout_entries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userKey: text("user_key").notNull(),
  week: integer("week").notNull(),
  day: text("day").notNull(),
  exerciseId: text("exercise_id").notNull(),
  setNumber: integer("set_number").notNull(),
  resistance: real("resistance").notNull(),
  reps: integer("reps").notNull(),
  completedAt: text("completed_at").notNull(),
}, (table) => [index("idx_w_workout_entries_user_key").on(table.userKey)]);

export const cardioEntries = sqliteTable("w_cardio_entries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userKey: text("user_key").notNull(),
  week: integer("week").notNull(),
  day: text("day").notNull(),
  minutes: integer("minutes").notNull(),
  resistance: integer("resistance").notNull(),
  completedAt: text("completed_at").notNull(),
}, (table) => [index("idx_w_cardio_entries_user_key").on(table.userKey)]);

export const weeklyWeights = sqliteTable("w_weekly_weights", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userKey: text("user_key").notNull(),
  week: integer("week").notNull(),
  weight: real("weight").notNull(),
  recordedAt: text("recorded_at").notNull(),
}, (table) => [uniqueIndex("idx_w_weekly_weights_user_week").on(table.userKey, table.week)]);
