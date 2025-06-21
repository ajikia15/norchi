import { Story, StoriesData, HotTopic, HotTopicsData } from "../types";
import { db } from "./db/client";
import { stories, hotTopics } from "./db/schema";

// Server-side functions for database operations
export async function loadStoriesData(): Promise<StoriesData> {
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
}

// Server-side hot topics function
export async function loadHotTopicsData(): Promise<HotTopicsData> {
  try {
    const result = await db.select().from(hotTopics);

    if (result.length === 0) {
      // Return empty data structure if no hot topics exist
      return {
        topics: {},
      };
    }

    // Transform database results to HotTopicsData format
    const topicsMap: Record<string, HotTopic> = {};

    result.forEach((dbTopic) => {
      topicsMap[dbTopic.id] = {
        id: dbTopic.id,
        category: dbTopic.category,
        title: dbTopic.title,
        answer: dbTopic.answer,
        link: dbTopic.link || undefined,
      };
    });

    return {
      topics: topicsMap,
    };
  } catch (error) {
    console.error("Failed to load hot topics from database:", error);
    throw error;
  }
}

// Note: All CRUD operations are now handled by server actions in app/lib/actions.ts
// These functions only exist for data loading and type safety
