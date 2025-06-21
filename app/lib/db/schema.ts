import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const stories = sqliteTable("stories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  flowData: text("flow_data").notNull(), // JSON string of FlowData
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const hotcardCategories = sqliteTable("hotcard_categories", {
  id: text("id").primaryKey(),
  label: text("label").notNull(),
  emoji: text("emoji").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const hotTopics = sqliteTable("hot_topics", {
  id: text("id").primaryKey(),
  categoryId: text("category_id").references(() => hotcardCategories.id),
  category: text("category").notNull(), // Keep for backward compatibility
  topicalTag: text("topical_tag"), // "ragebait" | "popularDisinfo" | "latestHysteria" | null
  title: text("title").notNull(),
  answer: text("answer").notNull(),
  link: text("link"),
});

export type SelectStory = typeof stories.$inferSelect;
export type InsertStory = typeof stories.$inferInsert;
export type SelectHotcardCategory = typeof hotcardCategories.$inferSelect;
export type InsertHotcardCategory = typeof hotcardCategories.$inferInsert;
export type SelectHotTopic = typeof hotTopics.$inferSelect;
export type InsertHotTopic = typeof hotTopics.$inferInsert;
