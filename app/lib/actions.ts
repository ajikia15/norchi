"use server";

import { revalidatePath } from "next/cache";
import { db } from "./db/client";
import {
  stories,
  hotTopics,
  tags,
  hotcardCategories,
  videoPromises,
  videoPromiseUpvotes,
  videos,
  videoUpvotes,
} from "./db/schema";
import { eq, sql } from "drizzle-orm";

// Story actions
export async function createStory(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  if (!name) {
    throw new Error("Story name is required");
  }

  const id = `story-${Date.now()}`;
  const now = new Date().toISOString();

  await db.insert(stories).values({
    id,
    name,
    description: description || null,
    flowData: JSON.stringify({
      startNodeId: "",
      nodes: {},
    }),
    createdAt: now,
    updatedAt: now,
  });

  revalidatePath("/admin");
  revalidatePath("/");
  return { success: true, id };
}

export async function updateStory(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const flowData = formData.get("flowData") as string;

  if (!name) {
    throw new Error("Story name is required");
  }

  await db
    .update(stories)
    .set({
      name,
      description: description || null,
      flowData: flowData || JSON.stringify({ startNodeId: "", nodes: {} }),
      updatedAt: new Date().toISOString(),
    })
    .where(eq(stories.id, id));

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath(`/story/${id}`);
  return { success: true };
}

export async function deleteStory(id: string) {
  await db.delete(stories).where(eq(stories.id, id));

  revalidatePath("/admin");
  revalidatePath("/");
  return { success: true };
}

// Tag actions
export async function createTag(formData: FormData) {
  const id = formData.get("id") as string;
  const label = formData.get("label") as string;
  const emoji = formData.get("emoji") as string;
  const color = formData.get("color") as string;

  if (!id || !label || !emoji || !color) {
    throw new Error("All tag fields are required");
  }

  const now = new Date().toISOString();

  await db.insert(tags).values({
    id,
    label,
    emoji,
    color,
    createdAt: now,
    updatedAt: now,
  });

  revalidatePath("/admin");
  revalidatePath("/");
  return { success: true, id };
}

export async function updateTag(id: string, formData: FormData) {
  const label = formData.get("label") as string;
  const emoji = formData.get("emoji") as string;
  const color = formData.get("color") as string;

  if (!label || !emoji || !color) {
    throw new Error("All tag fields are required");
  }

  await db
    .update(tags)
    .set({
      label,
      emoji,
      color,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(tags.id, id));

  revalidatePath("/admin");
  revalidatePath("/");
  return { success: true };
}

export async function deleteTag(id: string) {
  // Optimized: Only fetch topics that actually contain this tag (reduces server CPU)
  const hotTopicsWithTag = await db
    .select()
    .from(hotTopics)
    .where(sql`json_extract(tags, '$') LIKE '%"${id}"%'`);

  // Batch update all affected topics
  for (const topic of hotTopicsWithTag) {
    const topicTags = JSON.parse(topic.tags || "[]") as string[];
    const updatedTags = topicTags.filter((tagId) => tagId !== id);

    await db
      .update(hotTopics)
      .set({
        tags: JSON.stringify(updatedTags),
        updatedAt: new Date().toISOString(),
      })
      .where(eq(hotTopics.id, topic.id));
  }

  // Delete the tag
  await db.delete(tags).where(eq(tags.id, id));

  revalidatePath("/admin");
  revalidatePath("/");
  return { success: true };
}

// Hot Topics actions
export async function createHotTopic(formData: FormData) {
  const selectedTags = formData.get("tags") as string;
  const title = formData.get("title") as string;
  const answer = formData.get("answer") as string;

  if (!title || !answer) {
    throw new Error("Title and answer are required");
  }

  const id = `ht-${Date.now()}`;
  const now = new Date().toISOString();

  await db.insert(hotTopics).values({
    id,
    tags: selectedTags || "[]",
    title,
    answer,
    createdAt: now,
    updatedAt: now,
  });

  revalidatePath("/admin");
  revalidatePath("/");
  return { success: true, id };
}

export async function updateHotTopic(id: string, formData: FormData) {
  const selectedTags = formData.get("tags") as string;
  const title = formData.get("title") as string;
  const answer = formData.get("answer") as string;

  if (!title || !answer) {
    throw new Error("Title and answer are required");
  }

  await db
    .update(hotTopics)
    .set({
      tags: selectedTags || "[]",
      title,
      answer,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(hotTopics.id, id));

  revalidatePath("/admin");
  revalidatePath("/");
  return { success: true };
}

export async function deleteHotTopic(id: string) {
  await db.delete(hotTopics).where(eq(hotTopics.id, id));

  revalidatePath("/admin");
  revalidatePath("/");
  return { success: true };
}

// Export hot topics to JSON
export async function exportHotTopics() {
  try {
    // Get all hot topics and tags
    const [hotTopicsData, tagsData] = await Promise.all([
      db.select().from(hotTopics),
      db.select().from(tags),
    ]);

    // Create a map of tags for easy lookup
    const tagsMap = Object.fromEntries(tagsData.map((tag) => [tag.id, tag]));

    // Transform hot topics to include tag data
    const exportData = {
      exportedAt: new Date().toISOString(),
      version: "1.0",
      topics: hotTopicsData.map((topic) => {
        const topicTags = JSON.parse(topic.tags || "[]") as string[];
        return {
          id: topic.id,
          title: topic.title,
          answer: topic.answer,
          tags: topicTags,
          tagData: topicTags.map((tagId) => tagsMap[tagId]).filter(Boolean),
          createdAt: topic.createdAt,
          updatedAt: topic.updatedAt,
        };
      }),
      tags: tagsData,
    };

    return {
      success: true,
      data: exportData,
      filename: `hot-topics-export-${
        new Date().toISOString().split("T")[0]
      }.json`,
    };
  } catch (error) {
    console.error("Error exporting hot topics:", error);
    return { success: false, error: "Export failed" };
  }
}

// Import a single hot topic from JSON
export async function importHotTopic(formData: FormData) {
  try {
    const jsonData = formData.get("jsonData") as string;

    if (!jsonData) {
      return { success: false, error: "No JSON data provided" };
    }

    let parsedData;
    try {
      parsedData = JSON.parse(jsonData);
    } catch {
      return { success: false, error: "Invalid JSON format" };
    }

    // Validate required fields
    if (!parsedData.title || !parsedData.answer) {
      return { success: false, error: "Title and answer are required" };
    }

    // Get existing tags to validate tag references
    const existingTags = await db.select().from(tags);
    const existingTagIds = new Set(existingTags.map((tag) => tag.id));

    // Validate and filter tags
    const topicTags = Array.isArray(parsedData.tags) ? parsedData.tags : [];
    const validTags = topicTags.filter((tagId: string) =>
      existingTagIds.has(tagId)
    );

    // Generate new ID to avoid conflicts
    const id = `ht-${Date.now()}`;
    const now = new Date().toISOString();

    // Insert the hot topic
    await db.insert(hotTopics).values({
      id,
      tags: JSON.stringify(validTags),
      title: parsedData.title,
      answer: parsedData.answer,
      createdAt: now,
      updatedAt: now,
    });

    revalidatePath("/admin");
    revalidatePath("/");

    return {
      success: true,
      id,
      message: `Hot topic imported successfully. ${validTags.length}/${topicTags.length} tags were valid.`,
    };
  } catch (error) {
    console.error("Error importing hot topic:", error);
    return { success: false, error: "Import failed" };
  }
}

// Legacy category actions - will be removed after migration
export async function createHotcardCategory(formData: FormData) {
  const id = formData.get("id") as string;
  const label = formData.get("label") as string;
  const emoji = formData.get("emoji") as string;

  if (!id || !label || !emoji) {
    throw new Error("All category fields are required");
  }

  const now = new Date().toISOString();

  await db.insert(hotcardCategories).values({
    id,
    label,
    emoji,
    createdAt: now,
    updatedAt: now,
  });

  revalidatePath("/admin");
  revalidatePath("/");
  return { success: true, id };
}

export async function updateHotcardCategory(id: string, formData: FormData) {
  const label = formData.get("label") as string;
  const emoji = formData.get("emoji") as string;

  if (!label || !emoji) {
    throw new Error("All category fields are required");
  }

  await db
    .update(hotcardCategories)
    .set({
      label,
      emoji,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(hotcardCategories.id, id));

  revalidatePath("/admin");
  revalidatePath("/");
  return { success: true };
}

export async function deleteHotcardCategory(id: string) {
  await db.delete(hotcardCategories).where(eq(hotcardCategories.id, id));

  revalidatePath("/admin");
  revalidatePath("/");
  return { success: true };
}

// Video Promises actions
export async function createVideoPromise(formData: FormData) {
  const ytVideoId = formData.get("ytVideoId") as string;
  const title = formData.get("title") as string;

  if (!ytVideoId || !title) {
    throw new Error("YouTube Video ID and title are required");
  }

  const id = `vp-${Date.now()}`;
  const now = new Date().toISOString();

  await db.insert(videoPromises).values({
    id,
    ytVideoId,
    title,
    createdAt: now,
    updatedAt: now,
  });

  revalidatePath("/admin");
  revalidatePath("/promises");
  return { success: true, id };
}

export async function updateVideoPromise(id: string, formData: FormData) {
  const ytVideoId = formData.get("ytVideoId") as string;
  const title = formData.get("title") as string;

  if (!ytVideoId || !title) {
    throw new Error("YouTube Video ID and title are required");
  }

  await db
    .update(videoPromises)
    .set({
      ytVideoId,
      title,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(videoPromises.id, id));

  revalidatePath("/admin");
  revalidatePath("/promises");
  return { success: true };
}

export async function deleteVideoPromise(id: string) {
  await db.delete(videoPromises).where(eq(videoPromises.id, id));

  revalidatePath("/admin");
  revalidatePath("/promises");
  return { success: true };
}

// Video Promise Upvote actions
export async function toggleVideoPromiseUpvote(
  videoPromiseId: string,
  userId: string
) {
  try {
    // Check if user has already upvoted this video promise
    const existingUpvote = await db
      .select()
      .from(videoPromiseUpvotes)
      .where(
        sql`${videoPromiseUpvotes.videoPromiseId} = ${videoPromiseId} AND ${videoPromiseUpvotes.userId} = ${userId}`
      )
      .limit(1);

    if (existingUpvote.length > 0) {
      // Remove upvote
      await db
        .delete(videoPromiseUpvotes)
        .where(
          sql`${videoPromiseUpvotes.videoPromiseId} = ${videoPromiseId} AND ${videoPromiseUpvotes.userId} = ${userId}`
        );

      // Decrement upvote count
      await db
        .update(videoPromises)
        .set({
          upvoteCount: sql`${videoPromises.upvoteCount} - 1`,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(videoPromises.id, videoPromiseId));

      revalidatePath("/promises");
      return { success: true, action: "removed" };
    } else {
      // Add upvote
      const upvoteId = `vpu-${Date.now()}`;
      await db.insert(videoPromiseUpvotes).values({
        id: upvoteId,
        videoPromiseId,
        userId,
      });

      // Increment upvote count
      await db
        .update(videoPromises)
        .set({
          upvoteCount: sql`${videoPromises.upvoteCount} + 1`,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(videoPromises.id, videoPromiseId));

      revalidatePath("/promises");
      return { success: true, action: "added" };
    }
  } catch (error) {
    console.error("Error toggling video promise upvote:", error);
    return { success: false, error: "Failed to toggle upvote" };
  }
}

// Admin action to update algorithm points
export async function updateVideoPromiseAlgorithmPoints(
  id: string,
  algorithmPoints: number
) {
  try {
    await db
      .update(videoPromises)
      .set({
        algorithmPoints,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(videoPromises.id, id));

    revalidatePath("/admin");
    revalidatePath("/promises");
    return { success: true };
  } catch (error) {
    console.error("Error updating algorithm points:", error);
    return { success: false, error: "Failed to update algorithm points" };
  }
}

// NEW VIDEO ACTIONS (for updated videos table)
export async function createVideo(formData: FormData) {
  const ytVideoId = formData.get("ytVideoId") as string;
  const title = formData.get("title") as string;
  const type = formData.get("type") as string;
  const status = formData.get("status") as string;
  const startTimeStr = formData.get("startTime") as string;
  const endTimeStr = formData.get("endTime") as string;

  if (!ytVideoId || !title || !type) {
    throw new Error("YouTube Video ID, title, and type are required");
  }

  const id = `v-${Date.now()}`;
  const now = new Date().toISOString();

  // Parse time values
  const startTime =
    startTimeStr && !isNaN(parseInt(startTimeStr))
      ? parseInt(startTimeStr)
      : null;
  const endTime =
    endTimeStr && !isNaN(parseInt(endTimeStr)) ? parseInt(endTimeStr) : null;

  await db.insert(videos).values({
    id,
    ytVideoId,
    title,
    type,
    status: status || "pending",
    startTime,
    endTime,
    createdAt: now,
    updatedAt: now,
  });

  revalidatePath("/admin");
  revalidatePath("/treasury");
  return { success: true, id };
}

export async function updateVideo(id: string, formData: FormData) {
  const ytVideoId = formData.get("ytVideoId") as string;
  const title = formData.get("title") as string;
  const type = formData.get("type") as string;
  const status = formData.get("status") as string;
  const startTimeStr = formData.get("startTime") as string;
  const endTimeStr = formData.get("endTime") as string;

  if (!ytVideoId || !title || !type) {
    throw new Error("YouTube Video ID, title, and type are required");
  }

  // Parse time values
  const startTime =
    startTimeStr && !isNaN(parseInt(startTimeStr))
      ? parseInt(startTimeStr)
      : null;
  const endTime =
    endTimeStr && !isNaN(parseInt(endTimeStr)) ? parseInt(endTimeStr) : null;

  await db
    .update(videos)
    .set({
      ytVideoId,
      title,
      type,
      status: status || "pending",
      startTime,
      endTime,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(videos.id, id));

  revalidatePath("/admin");
  revalidatePath("/treasury");
  return { success: true };
}

export async function deleteVideo(id: string) {
  await db.delete(videos).where(eq(videos.id, id));

  revalidatePath("/admin");
  revalidatePath("/treasury");
  return { success: true };
}

export async function updateVideoAlgorithmPoints(
  id: string,
  algorithmPoints: number
) {
  try {
    await db
      .update(videos)
      .set({
        algorithmPoints,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(videos.id, id));

    revalidatePath("/admin");
    revalidatePath("/treasury");
    return { success: true };
  } catch (error) {
    console.error("Error updating video algorithm points:", error);
    return { success: false, error: "Failed to update algorithm points" };
  }
}

// Video Upvote actions (for new videos table)
export async function toggleVideoUpvote(videoId: string, userId: string) {
  try {
    // Check if user has already upvoted this video
    const existingUpvote = await db
      .select()
      .from(videoUpvotes)
      .where(
        sql`${videoUpvotes.videoId} = ${videoId} AND ${videoUpvotes.userId} = ${userId}`
      )
      .limit(1);

    if (existingUpvote.length > 0) {
      // Remove upvote
      await db
        .delete(videoUpvotes)
        .where(
          sql`${videoUpvotes.videoId} = ${videoId} AND ${videoUpvotes.userId} = ${userId}`
        );

      // Decrement upvote count
      await db
        .update(videos)
        .set({
          upvoteCount: sql`${videos.upvoteCount} - 1`,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(videos.id, videoId));

      revalidatePath("/treasury");
      return { success: true, action: "removed" };
    } else {
      // Add upvote
      const upvoteId = `vu-${Date.now()}`;
      await db.insert(videoUpvotes).values({
        id: upvoteId,
        videoId,
        userId,
      });

      // Increment upvote count
      await db
        .update(videos)
        .set({
          upvoteCount: sql`${videos.upvoteCount} + 1`,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(videos.id, videoId));

      revalidatePath("/treasury");
      return { success: true, action: "added" };
    }
  } catch (error) {
    console.error("Error toggling video upvote:", error);
    return { success: false, error: "Failed to toggle upvote" };
  }
}
