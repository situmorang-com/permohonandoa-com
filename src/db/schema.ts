import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  timestamp,
  primaryKey,
} from "drizzle-orm/pg-core";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";

// ─── Auth.js tables ──────────────────────────────────────────

export const users = pgTable("user", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

export const accounts = pgTable("account", {
  userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("providerAccountId").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
}, (account) => [
  primaryKey({ columns: [account.provider, account.providerAccountId] }),
]);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable("verificationToken", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
}, (vt) => [
  primaryKey({ columns: [vt.identifier, vt.token] }),
]);

// ─── App tables ──────────────────────────────────────────────

export const prayerRequests = pgTable("prayer_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  category: text("category").notNull().default("lainnya"),
  content: text("content").notNull(),
  isAnonymous: boolean("is_anonymous").default(false).notNull(),
  isPublic: boolean("is_public").default(true).notNull(),
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

export const comments = pgTable("comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  prayerRequestId: uuid("prayer_request_id")
    .references(() => prayerRequests.id, { onDelete: "cascade" })
    .notNull(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── Types ───────────────────────────────────────────────────

export type PrayerRequest = InferSelectModel<typeof prayerRequests>;
export type NewPrayerRequest = InferInsertModel<typeof prayerRequests>;
export type PrayerUpdate = InferSelectModel<typeof prayerUpdates>;
export type Comment = InferSelectModel<typeof comments>;
