"use server";

import { revalidatePath } from "next/cache";
import { db } from "./db/client";
import { stories, hotTopics } from "./db/schema";
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

  revalidatePath("/admin/story");
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

  revalidatePath("/admin/story");
  revalidatePath("/");
  revalidatePath(`/story/${id}`);
  return { success: true };
}

export async function deleteStory(id: string) {
  await db.delete(stories).where(eq(stories.id, id));

  revalidatePath("/admin/story");
  revalidatePath("/");
  return { success: true };
}

// Hot Topics actions
export async function createHotTopic(formData: FormData) {
  const category = formData.get("category") as string;
  const title = formData.get("title") as string;
  const answer = formData.get("answer") as string;
  const link = formData.get("link") as string;

  if (!category || !title || !answer) {
    throw new Error("Category, title, and answer are required");
  }

  const id = `ht-${Date.now()}`;

  await db.insert(hotTopics).values({
    id,
    category,
    title,
    answer,
    link: link || null,
  });

  revalidatePath("/admin/hot-questions");
  revalidatePath("/");
  return { success: true, id };
}

export async function updateHotTopic(id: string, formData: FormData) {
  const category = formData.get("category") as string;
  const title = formData.get("title") as string;
  const answer = formData.get("answer") as string;
  const link = formData.get("link") as string;

  if (!category || !title || !answer) {
    throw new Error("Category, title, and answer are required");
  }

  await db
    .update(hotTopics)
    .set({
      category,
      title,
      answer,
      link: link || null,
    })
    .where(eq(hotTopics.id, id));

  revalidatePath("/admin/hot-questions");
  revalidatePath("/");
  return { success: true };
}

export async function deleteHotTopic(id: string) {
  await db.delete(hotTopics).where(eq(hotTopics.id, id));

  revalidatePath("/admin/hot-questions");
  revalidatePath("/");
  return { success: true };
}
