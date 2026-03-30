import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  timestamp,
  primaryKey,
  doublePrecision,
  jsonb,
} from "drizzle-orm/pg-core";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";

// ─── Auth.js tables ──────────────────────────────────────────

export const users = pgTable("user", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  // Extended user fields
  onboardingCompleted: boolean("onboarding_completed").default(false).notNull(),
  location: text("location"),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  currentStreak: integer("current_streak").default(0).notNull(),
  longestStreak: integer("longest_streak").default(0).notNull(),
  lastPrayedAt: timestamp("last_prayed_at", { withTimezone: true }),
  totalPrayed: integer("total_prayed").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
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

// ─── Prayer Requests ─────────────────────────────────────────

export const prayerRequests = pgTable("prayer_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
  groupId: uuid("group_id").references(() => prayerGroups.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  category: text("category").notNull().default("lainnya"),
  content: text("content").notNull(),
  audioUrl: text("audio_url"),
  isAnonymous: boolean("is_anonymous").default(false).notNull(),
  isPublic: boolean("is_public").default(true).notNull(),
  prayerCount: integer("prayer_count").default(0).notNull(),
  isAnswered: boolean("is_answered").default(false).notNull(),
  isUrgent: boolean("is_urgent").default(false).notNull(),
  answeredAt: timestamp("answered_at", { withTimezone: true }),
  answeredTestimony: text("answered_testimony"),
  scriptureVerse: text("scripture_verse"),
  location: text("location"),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
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

// ─── Comments / Encouragement ────────────────────────────────

export const comments = pgTable("comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  prayerRequestId: uuid("prayer_request_id")
    .references(() => prayerRequests.id, { onDelete: "cascade" })
    .notNull(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── Reports / Moderation ────────────────────────────────────

export const reports = pgTable("reports", {
  id: uuid("id").defaultRandom().primaryKey(),
  reporterId: text("reporter_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  prayerRequestId: uuid("prayer_request_id").references(() => prayerRequests.id, { onDelete: "cascade" }),
  commentId: uuid("comment_id").references(() => comments.id, { onDelete: "cascade" }),
  reason: text("reason").notNull(),
  status: text("status").notNull().default("pending"), // pending, reviewed, dismissed
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── Prayer Groups ───────────────────────────────────────────

export const prayerGroups = pgTable("prayer_groups", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  image: text("image"),
  creatorId: text("creator_id").references(() => users.id, { onDelete: "set null" }),
  isPublic: boolean("is_public").default(true).notNull(),
  inviteCode: text("invite_code").unique(),
  memberCount: integer("member_count").default(1).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const groupMembers = pgTable("group_members", {
  groupId: uuid("group_id").references(() => prayerGroups.id, { onDelete: "cascade" }).notNull(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  role: text("role").notNull().default("member"), // admin, member
  joinedAt: timestamp("joined_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => [
  primaryKey({ columns: [t.groupId, t.userId] }),
]);

// ─── Prayer Partners ─────────────────────────────────────────

export const prayerPartners = pgTable("prayer_partners", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  partnerId: text("partner_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  status: text("status").notNull().default("pending"), // pending, active, ended
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── Push Subscriptions ──────────────────────────────────────

export const pushSubscriptions = pgTable("push_subscriptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  subscription: jsonb("subscription").notNull(), // Web Push subscription object
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── Prayer Reminders ────────────────────────────────────────

export const prayerReminders = pgTable("prayer_reminders", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  prayerRequestId: uuid("prayer_request_id").references(() => prayerRequests.id, { onDelete: "cascade" }),
  time: text("time").notNull(), // HH:mm format
  days: jsonb("days").notNull().$type<number[]>(), // 0=Sun, 1=Mon, ...
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── Churches / Organizations ────────────────────────────────

export const churches = pgTable("churches", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  image: text("image"),
  address: text("address"),
  city: text("city"),
  adminId: text("admin_id").references(() => users.id, { onDelete: "set null" }),
  memberCount: integer("member_count").default(0).notNull(),
  inviteCode: text("invite_code").unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const churchMembers = pgTable("church_members", {
  churchId: uuid("church_id").references(() => churches.id, { onDelete: "cascade" }).notNull(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  role: text("role").notNull().default("member"), // admin, moderator, member
  joinedAt: timestamp("joined_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => [
  primaryKey({ columns: [t.churchId, t.userId] }),
]);

// ─── Seasonal Challenges ─────────────────────────────────────

export const prayerChallenges = pgTable("prayer_challenges", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  image: text("image"),
  startDate: timestamp("start_date", { withTimezone: true }).notNull(),
  endDate: timestamp("end_date", { withTimezone: true }).notNull(),
  goalType: text("goal_type").notNull().default("days"), // days, prayers, count
  goalTarget: integer("goal_target").notNull().default(7),
  participantCount: integer("participant_count").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const challengeParticipants = pgTable("challenge_participants", {
  challengeId: uuid("challenge_id").references(() => prayerChallenges.id, { onDelete: "cascade" }).notNull(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  progress: integer("progress").default(0).notNull(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  joinedAt: timestamp("joined_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => [
  primaryKey({ columns: [t.challengeId, t.userId] }),
]);

// ─── Types ───────────────────────────────────────────────────

export type User = InferSelectModel<typeof users>;
export type PrayerRequest = InferSelectModel<typeof prayerRequests>;
export type NewPrayerRequest = InferInsertModel<typeof prayerRequests>;
export type PrayerUpdate = InferSelectModel<typeof prayerUpdates>;
export type Comment = InferSelectModel<typeof comments>;
export type Report = InferSelectModel<typeof reports>;
export type PrayerGroup = InferSelectModel<typeof prayerGroups>;
export type PrayerPartner = InferSelectModel<typeof prayerPartners>;
export type PrayerReminder = InferSelectModel<typeof prayerReminders>;
export type Church = InferSelectModel<typeof churches>;
export type PrayerChallenge = InferSelectModel<typeof prayerChallenges>;
