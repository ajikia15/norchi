"use server";
import { db } from "@/app/lib/db/client";
import { savedHotCards, hotTopics, tags } from "@/app/lib/db/schema";
import { requireAuth, getCurrentUser } from "@/app/lib/auth-utils";
import { eq, and } from "drizzle-orm";
import { HotTopic, Tag } from "../types";

/**
 * Save a hot topic for the current user
 */
export async function saveHotCard(hotTopicId: string) {
  try {
    await requireAuth();
    const user = await getCurrentUser();

    if (!user) {
      throw new Error("User not found");
    }

    // Check if already saved
    const existing = await db
      .select()
      .from(savedHotCards)
      .where(
        and(
          eq(savedHotCards.userId, user.id),
          eq(savedHotCards.hotTopicId, hotTopicId)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      throw new Error("კითხვა უკვე შენახულია");
    }

    // Generate ID and save
    const id = `saved_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    await db.insert(savedHotCards).values({
      id,
      userId: user.id,
      hotTopicId,
      createdAt: new Date(),
    });

    return { success: true, message: "კითხვა შენახულია" };
  } catch (error) {
    const e = error as Error;
    throw new Error(e.message || "შეცდომა კითხვის შენახვისას");
  }
}

/**
 * Remove a saved hot topic for the current user
 */
export async function unsaveHotCard(hotTopicId: string) {
  try {
    await requireAuth();
    const user = await getCurrentUser();

    if (!user) {
      throw new Error("User not found");
    }

    await db
      .delete(savedHotCards)
      .where(
        and(
          eq(savedHotCards.userId, user.id),
          eq(savedHotCards.hotTopicId, hotTopicId)
        )
      );

    return { success: true, message: "კითხვა წაიშალა შენახულებიდან" };
  } catch (error) {
    const e = error as Error;
    throw new Error(e.message || "შეცდომა კითხვის წაშლისას");
  }
}

/**
 * Get all saved hot topics for the current user
 */
export async function getSavedHotCards(): Promise<HotTopic[]> {
  try {
    await requireAuth();
    const user = await getCurrentUser();

    if (!user) {
      return [];
    }

    // Load both saved topics and all tags in parallel for better performance
    const [savedTopicsResult, tagsResult] = await Promise.all([
      db
        .select({
          id: hotTopics.id,
          title: hotTopics.title,
          answer: hotTopics.answer,
          tags: hotTopics.tags,
          createdAt: hotTopics.createdAt,
          updatedAt: hotTopics.updatedAt,
        })
        .from(savedHotCards)
        .innerJoin(hotTopics, eq(savedHotCards.hotTopicId, hotTopics.id))
        .where(eq(savedHotCards.userId, user.id))
        .orderBy(savedHotCards.createdAt),
      db.select().from(tags),
    ]);

    // Create a map of tags for easy lookup
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

    // Parse tags JSON string to array and attach tag data
    return savedTopicsResult.map((topic) => {
      const topicTagIds = JSON.parse(topic.tags || "[]") as string[];
      const tagData = topicTagIds
        .map((tagId) => tagsMap[tagId])
        .filter(Boolean); // Remove undefined tags

      return {
        ...topic,
        tags: topicTagIds,
        tagData,
      };
    });
  } catch {
    console.error("Error fetching saved hot cards");
    return [];
  }
}

/**
 * Check if a hot topic is saved by the current user
 */
export async function isHotCardSaved(hotTopicId: string): Promise<boolean> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return false;
    }

    const saved = await db
      .select()
      .from(savedHotCards)
      .where(
        and(
          eq(savedHotCards.userId, user.id),
          eq(savedHotCards.hotTopicId, hotTopicId)
        )
      )
      .limit(1);

    return saved.length > 0;
  } catch {
    return false;
  }
}
