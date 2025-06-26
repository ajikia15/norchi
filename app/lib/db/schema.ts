import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

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

export const schema = { user, session, account, verification };
