import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";

export const prayerRequests = pgTable("prayer_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull().default("lainnya"),
  content: text("content").notNull(),
  isAnonymous: boolean("is_anonymous").default(false).notNull(),
  prayerCount: integer("prayer_count").default(0).notNull(),
  isAnswered: boolean("is_answered").default(false).notNull(),
  isUrgent: boolean("is_urgent").default(false).notNull(),
  answeredAt: timestamp("answered_at", { withTimezone: true }),
  answeredTestimony: text("answered_testimony"),
  scriptureVerse: text("scripture_verse"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const prayerUpdates = pgTable("prayer_updates", {
  id: uuid("id").defaultRandom().primaryKey(),
  prayerRequestId: uuid("prayer_request_id")
    .references(() => prayerRequests.id, { onDelete: "cascade" })
    .notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type PrayerRequest = InferSelectModel<typeof prayerRequests>;
export type NewPrayerRequest = InferInsertModel<typeof prayerRequests>;
export type PrayerUpdate = InferSelectModel<typeof prayerUpdates>;
export type NewPrayerUpdate = InferInsertModel<typeof prayerUpdates>;
