import {
  Story,
  StoriesData,
  HotTopic,
  HotTopicsData,
  HotTopicsPaginationParams,
  PaginatedHotTopicsResult,
  Tag,
  HotcardCategory,
  VideoPromise,
  VideoPromisesData,
  VideoPromisesPaginationParams,
  PaginatedVideoPromisesResult,
} from "../types";
import { db } from "./db/client";
import {
  stories,
  hotTopics,
  tags,
  hotcardCategories,
  savedHotCards,
  videoPromises,
  videoPromiseUpvotes,
} from "./db/schema";
import { cache } from "react";
import { eq, count } from "drizzle-orm";

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

// 🎯 CENTRALIZED HOT TOPICS FETCHING WITH PAGINATION
// This is the single source of truth for hot topics across the entire website
export const loadHotTopics = cache(
  async (
    params: HotTopicsPaginationParams & { userId?: string } = {}
  ): Promise<PaginatedHotTopicsResult> => {
    const { page = 1, limit = 12, userId } = params;
    const offset = (page - 1) * limit;

    try {
      // Load tags, total count, and paginated topics in parallel
      const [tagsResult, totalCountResult, topicsResult] = await Promise.all([
        db.select().from(tags),
        db.select({ count: count() }).from(hotTopics),
        db.select().from(hotTopics).limit(limit).offset(offset),
      ]);

      // If userId provided, load saved status for all topics to prevent N+1 queries
      const savedTopicsMap: Record<string, boolean> = {};
      if (userId) {
        const savedTopicsResult = await db
          .select({ hotTopicId: savedHotCards.hotTopicId })
          .from(savedHotCards)
          .where(eq(savedHotCards.userId, userId));

        savedTopicsResult.forEach((saved) => {
          savedTopicsMap[saved.hotTopicId] = true;
        });
      }

      // Build tags map
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

      // Transform topics and attach tag data + saved status
      const topics: HotTopic[] = topicsResult.map((dbTopic) => {
        const topicTagIds = JSON.parse(dbTopic.tags || "[]") as string[];
        const tagData = topicTagIds
          .map((tagId) => tagsMap[tagId])
          .filter(Boolean);

        return {
          id: dbTopic.id,
          tags: topicTagIds,
          title: dbTopic.title,
          answer: dbTopic.answer,
          createdAt: dbTopic.createdAt,
          updatedAt: dbTopic.updatedAt,
          tagData,
          isSaved: savedTopicsMap[dbTopic.id] || false, // Add saved status
        };
      });

      // Calculate pagination metadata
      const totalItems = totalCountResult[0].count;
      const totalPages = Math.ceil(totalItems / limit);

      return {
        topics,
        tags: tagsMap,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      };
    } catch (error) {
      console.error("Failed to load hot topics from database:", error);
      // Return empty result instead of throwing
      return {
        topics: [],
        tags: {},
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalItems: 0,
          itemsPerPage: limit,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
    }
  }
);

// Optimized function to load a single story by ID (reduces server CPU)
export const loadSingleStory = cache(
  async (storyId: string): Promise<Story | null> => {
    try {
      const result = await db
        .select()
        .from(stories)
        .where(eq(stories.id, storyId))
        .limit(1);

      if (result.length === 0) {
        return null;
      }

      const dbStory = result[0];
      return {
        id: dbStory.id,
        name: dbStory.name,
        description: dbStory.description || undefined,
        flowData: JSON.parse(dbStory.flowData),
        createdAt: dbStory.createdAt,
        updatedAt: dbStory.updatedAt,
      };
    } catch (error) {
      console.error("Failed to load story from database:", error);
      return null;
    }
  }
);

// LEGACY FUNCTIONS - TO BE REMOVED
// Keep for backward compatibility during migration
export const loadHotTopicsData = cache(async (): Promise<HotTopicsData> => {
  console.warn("loadHotTopicsData is deprecated. Use loadHotTopics() instead.");
  const result = await loadHotTopics();

  // Convert to legacy format
  const topicsMap: Record<string, HotTopic> = {};
  result.topics.forEach((topic) => {
    topicsMap[topic.id] = topic;
  });

  return {
    topics: topicsMap,
    tags: result.tags,
  };
});

export const loadAllData = cache(async () => {
  console.warn(
    "loadAllData is deprecated. Use loadStoriesData() and loadHotTopics() separately."
  );
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

// VIDEO PROMISES FUNCTIONS
export const loadVideoPromises = cache(
  async (
    params: VideoPromisesPaginationParams = {}
  ): Promise<PaginatedVideoPromisesResult> => {
    const { page = 1, limit = 10 } = params;
    const offset = (page - 1) * limit;

    try {
      // Load total count and paginated video promises in parallel
      const [totalCountResult, videoPromisesResult] = await Promise.all([
        db.select({ count: count() }).from(videoPromises),
        db
          .select()
          .from(videoPromises)
          .orderBy(videoPromises.createdAt)
          .limit(limit)
          .offset(offset),
      ]);

      // Transform database results to VideoPromise format
      const videoPromisesList: VideoPromise[] = videoPromisesResult.map(
        (dbVideoPromise) => ({
          id: dbVideoPromise.id,
          ytVideoId: dbVideoPromise.ytVideoId,
          title: dbVideoPromise.title,
          upvoteCount: dbVideoPromise.upvoteCount ?? 0,
          algorithmPoints: dbVideoPromise.algorithmPoints ?? 0,
          createdAt: dbVideoPromise.createdAt,
          updatedAt: dbVideoPromise.updatedAt,
        })
      );

      // Calculate pagination metadata
      const totalItems = totalCountResult[0].count;
      const totalPages = Math.ceil(totalItems / limit);

      return {
        videoPromises: videoPromisesList,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      };
    } catch (error) {
      console.error("Failed to load video promises from database:", error);
      // Return empty result instead of throwing
      return {
        videoPromises: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalItems: 0,
          itemsPerPage: limit,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
    }
  }
);

// Legacy function for backward compatibility - loads all video promises
export const loadVideoPromisesData = cache(
  async (): Promise<VideoPromisesData> => {
    try {
      const result = await db.select().from(videoPromises);

      // Transform database results to VideoPromisesData format
      const videoPromisesMap: Record<string, VideoPromise> = {};

      result.forEach((dbVideoPromise) => {
        videoPromisesMap[dbVideoPromise.id] = {
          id: dbVideoPromise.id,
          ytVideoId: dbVideoPromise.ytVideoId,
          title: dbVideoPromise.title,
          upvoteCount: dbVideoPromise.upvoteCount ?? 0,
          algorithmPoints: dbVideoPromise.algorithmPoints ?? 0,
          createdAt: dbVideoPromise.createdAt,
          updatedAt: dbVideoPromise.updatedAt,
        };
      });

      return {
        videoPromises: videoPromisesMap,
      };
    } catch (error) {
      console.error("Failed to load video promises from database:", error);
      throw error;
    }
  }
);

// VIDEO PROMISE UPVOTES FUNCTIONS
export const loadVideoPromisesWithUpvoteStatus = cache(
  async (
    params: VideoPromisesPaginationParams & { userId?: string } = {}
  ): Promise<
    PaginatedVideoPromisesResult & { upvotedPromises: Record<string, boolean> }
  > => {
    const { page = 1, limit = 10, userId } = params;
    const offset = (page - 1) * limit;

    try {
      // Load total count and paginated video promises in parallel
      const [totalCountResult, videoPromisesResult] = await Promise.all([
        db.select({ count: count() }).from(videoPromises),
        db
          .select()
          .from(videoPromises)
          .orderBy(videoPromises.createdAt)
          .limit(limit)
          .offset(offset),
      ]);

      // If userId provided, load upvoted status for all video promises to prevent N+1 queries
      const upvotedPromisesMap: Record<string, boolean> = {};
      if (userId) {
        const upvotedPromisesResult = await db
          .select({ videoPromiseId: videoPromiseUpvotes.videoPromiseId })
          .from(videoPromiseUpvotes)
          .where(eq(videoPromiseUpvotes.userId, userId));

        upvotedPromisesResult.forEach((upvoted) => {
          upvotedPromisesMap[upvoted.videoPromiseId] = true;
        });
      }

      // Transform database results to VideoPromise format
      const videoPromisesList: VideoPromise[] = videoPromisesResult.map(
        (dbVideoPromise) => ({
          id: dbVideoPromise.id,
          ytVideoId: dbVideoPromise.ytVideoId,
          title: dbVideoPromise.title,
          upvoteCount: dbVideoPromise.upvoteCount ?? 0,
          algorithmPoints: dbVideoPromise.algorithmPoints ?? 0,
          createdAt: dbVideoPromise.createdAt,
          updatedAt: dbVideoPromise.updatedAt,
        })
      );

      // Calculate pagination metadata
      const totalItems = totalCountResult[0].count;
      const totalPages = Math.ceil(totalItems / limit);

      return {
        videoPromises: videoPromisesList,
        upvotedPromises: upvotedPromisesMap,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      };
    } catch (error) {
      console.error(
        "Failed to load video promises with upvote status from database:",
        error
      );
      // Return empty result instead of throwing
      return {
        videoPromises: [],
        upvotedPromises: {},
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalItems: 0,
          itemsPerPage: limit,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
    }
  }
);

// Note: All CRUD operations are now handled by server actions in app/lib/actions.ts
// These functions only exist for data loading and type safety
