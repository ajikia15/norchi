import { sqliteTable, text } from "drizzle-orm/sqlite-core";

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
