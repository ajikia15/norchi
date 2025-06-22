"use server";

import { revalidatePath } from "next/cache";
import { db } from "./db/client";
import { stories, hotTopics, tags, hotcardCategories } from "./db/schema";
import { eq } from "drizzle-orm";

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
  // Remove this tag from all hot topics that use it
  const hotTopicsWithTag = await db.select().from(hotTopics);

  for (const topic of hotTopicsWithTag) {
    const topicTags = JSON.parse(topic.tags || "[]") as string[];
    const updatedTags = topicTags.filter((tagId) => tagId !== id);

    if (topicTags.length !== updatedTags.length) {
      await db
        .update(hotTopics)
        .set({
          tags: JSON.stringify(updatedTags),
          updatedAt: new Date().toISOString(),
        })
        .where(eq(hotTopics.id, topic.id));
    }
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
  const link = formData.get("link") as string;

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
    link: link || null,
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
  const link = formData.get("link") as string;

  if (!title || !answer) {
    throw new Error("Title and answer are required");
  }

  await db
    .update(hotTopics)
    .set({
      tags: selectedTags || "[]",
      title,
      answer,
      link: link || null,
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
