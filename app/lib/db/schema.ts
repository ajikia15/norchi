import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const stories = sqliteTable("stories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  flowData: text("flow_data").notNull(), // JSON string of FlowData
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const hotTopics = sqliteTable("hot_topics", {
  id: text("id").primaryKey(),
  category: text("category").notNull(),
  title: text("title").notNull(),
  answer: text("answer").notNull(),
  link: text("link"),
});

export type SelectStory = typeof stories.$inferSelect;
export type InsertStory = typeof stories.$inferInsert;
export type SelectHotTopic = typeof hotTopics.$inferSelect;
export type InsertHotTopic = typeof hotTopics.$inferInsert;
