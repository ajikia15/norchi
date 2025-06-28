import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// User roles enum
export const USER_ROLES = {
  USER: "user",
  MODERATOR: "moderator",
  ADMIN: "admin",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const stories = sqliteTable("stories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  flowData: text("flow_data").notNull(), // JSON string of FlowData
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const tags = sqliteTable("tags", {
  id: text("id").primaryKey(),
  label: text("label").notNull(),
  emoji: text("emoji").notNull(),
  color: text("color").notNull().default("#3b82f6"), // hex color for tag styling
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const hotTopics = sqliteTable("hot_topics", {
  id: text("id").primaryKey(),
  tags: text("tags").notNull().default("[]"), // JSON array of tag IDs
  title: text("title").notNull(),
  answer: text("answer").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// Legacy table - will be removed after migration
export const hotcardCategories = sqliteTable("hotcard_categories", {
  id: text("id").primaryKey(),
  label: text("label").notNull(),
  emoji: text("emoji").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export type SelectStory = typeof stories.$inferSelect;
export type InsertStory = typeof stories.$inferInsert;
export type SelectTag = typeof tags.$inferSelect;
export type InsertTag = typeof tags.$inferInsert;
export type SelectHotTopic = typeof hotTopics.$inferSelect;
export type InsertHotTopic = typeof hotTopics.$inferInsert;
export type SelectHotcardCategory = typeof hotcardCategories.$inferSelect;
export type InsertHotcardCategory = typeof hotcardCategories.$inferInsert;

// user related

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" })
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  role: text("role").$type<UserRole>().notNull().default(USER_ROLES.USER),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", {
    mode: "timestamp",
  }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", {
    mode: "timestamp",
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
});

export const savedHotCards = sqliteTable("saved_hot_cards", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  hotTopicId: text("hot_topic_id")
    .notNull()
    .references(() => hotTopics.id, { onDelete: "cascade" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const videos = sqliteTable("videos", {
  id: text("id").primaryKey(),
  ytVideoId: text("yt_video_id").notNull(),
  title: text("title").notNull(),
  type: text("type").notNull().default("promise"), // 'promise', 'roast', 'livestream', etc.
  status: text("status").notNull().default("pending"), // 'verified', 'pending'
  upvoteCount: integer("upvote_count").notNull().default(0),
  algorithmPoints: integer("algorithm_points").notNull().default(0),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const videoUpvotes = sqliteTable("video_upvotes", {
  id: text("id").primaryKey(),
  videoId: text("video_id")
    .notNull()
    .references(() => videos.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

// Keep old tables for backward compatibility during migration
export const videoPromises = sqliteTable("video_promises", {
  id: text("id").primaryKey(),
  ytVideoId: text("yt_video_id").notNull(),
  title: text("title").notNull(),
  upvoteCount: integer("upvote_count").notNull().default(0),
  algorithmPoints: integer("algorithm_points").notNull().default(0),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const videoPromiseUpvotes = sqliteTable("video_promise_upvotes", {
  id: text("id").primaryKey(),
  videoPromiseId: text("video_promise_id")
    .notNull()
    .references(() => videoPromises.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const schema = { user, session, account, verification, savedHotCards };

// New video types
export type SelectVideo = typeof videos.$inferSelect;
export type InsertVideo = typeof videos.$inferInsert;
export type SelectVideoUpvote = typeof videoUpvotes.$inferSelect;
export type InsertVideoUpvote = typeof videoUpvotes.$inferInsert;

// Legacy video promise types (for backward compatibility)
export type SelectVideoPromise = typeof videoPromises.$inferSelect;
export type InsertVideoPromise = typeof videoPromises.$inferInsert;
export type SelectVideoPromiseUpvote = typeof videoPromiseUpvotes.$inferSelect;
export type InsertVideoPromiseUpvote = typeof videoPromiseUpvotes.$inferInsert;
