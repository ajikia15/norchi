"use server";
import { db } from "@/app/lib/db/client";
import { savedHotCards, hotTopics } from "@/app/lib/db/schema";
import { requireAuth, getCurrentUser } from "@/app/lib/auth-utils";
import { eq, and } from "drizzle-orm";
import { HotTopic } from "../types";

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

    const savedTopics = await db
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
      .orderBy(savedHotCards.createdAt);

    // Parse tags JSON string to array
    return savedTopics.map((topic) => ({
      ...topic,
      tags: JSON.parse(topic.tags || "[]"),
    }));
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
