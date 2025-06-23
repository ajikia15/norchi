import {
  Story,
  StoriesData,
  HotTopic,
  HotTopicsData,
  Tag,
  HotcardCategory,
} from "../types";
import { db } from "./db/client";
import { stories, hotTopics, tags, hotcardCategories } from "./db/schema";
import { cache } from "react";

// Cached server-side functions for database operations with React cache
export const loadStoriesData = cache(async (): Promise<StoriesData> => {
  try {
    const result = await db.select().from(stories);

    if (result.length === 0) {
      // Return empty data structure if no stories exist
      return {
        stories: {},
        currentStoryId: "",
      };
    }

    // Transform database results to StoriesData format
    const storiesMap: Record<string, Story> = {};

    result.forEach((dbStory) => {
      storiesMap[dbStory.id] = {
        id: dbStory.id,
        name: dbStory.name,
        description: dbStory.description || undefined,
        flowData: JSON.parse(dbStory.flowData),
        createdAt: dbStory.createdAt,
        updatedAt: dbStory.updatedAt,
      };
    });

    return {
      stories: storiesMap,
      currentStoryId: "", // Legacy field - no longer used
    };
  } catch (error) {
    console.error("Failed to load stories from database:", error);
    throw error;
  }
});

// Optimized server-side hot topics function with parallel loading and caching
export const loadHotTopicsData = cache(async (): Promise<HotTopicsData> => {
  try {
    // Load both tags and topics in parallel for better performance
    const [tagsResult, topicsResult] = await Promise.all([
      db.select().from(tags),
      db.select().from(hotTopics),
    ]);

    const tagsMap: Record<string, Tag> = {};

    tagsResult.forEach((dbTag) => {
      tagsMap[dbTag.id] = {
        id: dbTag.id,
        label: dbTag.label,
        emoji: dbTag.emoji,
        color: dbTag.color,
        createdAt: dbTag.createdAt,
        updatedAt: dbTag.updatedAt,
      };
    });

    const topicsMap: Record<string, HotTopic> = {};

    topicsResult.forEach((dbTopic) => {
      const topicTagIds = JSON.parse(dbTopic.tags || "[]") as string[];
      const tagData = topicTagIds
        .map((tagId) => tagsMap[tagId])
        .filter(Boolean); // Remove undefined tags

      topicsMap[dbTopic.id] = {
        id: dbTopic.id,
        tags: topicTagIds,
        title: dbTopic.title,
        answer: dbTopic.answer,
        createdAt: dbTopic.createdAt,
        updatedAt: dbTopic.updatedAt,
        tagData,
      };
    });

    return {
      topics: topicsMap,
      tags: tagsMap,
    };
  } catch (error) {
    console.error("Failed to load hot topics from database:", error);
    throw error;
  }
});

// Combined data loader for parallel loading on pages that need both
export const loadAllData = cache(async () => {
  const [storiesData, hotTopicsData] = await Promise.all([
    loadStoriesData(),
    loadHotTopicsData(),
  ]);

  return {
    storiesData,
    hotTopicsData,
  };
});

// Legacy function for backward compatibility with caching
export const loadLegacyHotTopicsData = cache(
  async (): Promise<{
    topics: Record<string, Record<string, unknown>>;
    categories: Record<string, HotcardCategory>;
  }> => {
    try {
      // Load legacy categories
      const categoriesResult = await db.select().from(hotcardCategories);
      const categoriesMap: Record<string, HotcardCategory> = {};

      categoriesResult.forEach((dbCategory) => {
        categoriesMap[dbCategory.id] = {
          id: dbCategory.id,
          label: dbCategory.label,
          emoji: dbCategory.emoji,
          createdAt: dbCategory.createdAt,
          updatedAt: dbCategory.updatedAt,
        };
      });

      return {
        topics: {},
        categories: categoriesMap,
      };
    } catch (error) {
      console.error("Failed to load legacy hot topics from database:", error);
      throw error;
    }
  }
);

// Note: All CRUD operations are now handled by server actions in app/lib/actions.ts
// These functions only exist for data loading and type safety
