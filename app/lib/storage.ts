import { FlowData, Story, StoriesData } from "../types";
import wineWeedStoryData from "./wine_weed_story.json";
import armyServiceStoryData from "./army_service_story.json";

const STORIES_STORAGE_KEY = "norchi-stories-data";
const LEGACY_STORAGE_KEY = "norchi-flow-data"; // For migration

export function saveStoriesData(data: StoriesData): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORIES_STORAGE_KEY, JSON.stringify(data));
  }
}

export function loadStoriesData(): StoriesData | null {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORIES_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error("Failed to parse stored stories data:", error);
      }
    }
  }
  return null;
}

export function getDefaultStoriesData(): StoriesData {
  const wineWeedStory = wineWeedStoryData.story as Story;
  const armyServiceStory = armyServiceStoryData.story as Story;

  return {
    currentStoryId: wineWeedStory.id,
    stories: {
      [wineWeedStory.id]: wineWeedStory,
      [armyServiceStory.id]: armyServiceStory,
    },
  };
}

// Story management functions
export function createNewStory(name: string, description?: string): Story {
  const id = `story-${Date.now()}`;
  return {
    id,
    name,
    description,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    flowData: {
      startNodeId: "",
      nodes: {},
    },
  };
}

export function updateStory(
  stories: StoriesData,
  storyId: string,
  updates: Partial<Omit<Story, "id" | "createdAt">>
): StoriesData {
  if (!stories.stories[storyId]) {
    throw new Error(`Story with id ${storyId} not found`);
  }

  return {
    ...stories,
    stories: {
      ...stories.stories,
      [storyId]: {
        ...stories.stories[storyId],
        ...updates,
        updatedAt: new Date().toISOString(),
      },
    },
  };
}

export function deleteStory(
  stories: StoriesData,
  storyId: string
): StoriesData {
  if (!stories.stories[storyId]) {
    throw new Error(`Story with id ${storyId} not found`);
  }

  const newStories = { ...stories.stories };
  delete newStories[storyId];

  // If we're deleting the current story, switch to another one or create a default
  let newCurrentStoryId = stories.currentStoryId;
  if (storyId === stories.currentStoryId) {
    const remainingStoryIds = Object.keys(newStories);
    if (remainingStoryIds.length > 0) {
      newCurrentStoryId = remainingStoryIds[0];
    } else {
      // Create a default story if none remain
      const defaultStory = createNewStory("New Story");
      newStories[defaultStory.id] = defaultStory;
      newCurrentStoryId = defaultStory.id;
    }
  }

  return {
    stories: newStories,
    currentStoryId: newCurrentStoryId,
  };
}

export function getCurrentStory(stories: StoriesData): Story | null {
  return stories.stories[stories.currentStoryId] || null;
}

export function switchToStory(
  stories: StoriesData,
  storyId: string
): StoriesData {
  if (!stories.stories[storyId]) {
    throw new Error(`Story with id ${storyId} not found`);
  }

  return {
    ...stories,
    currentStoryId: storyId,
  };
}

// Migration function for legacy single-flow data
export function migrateLegacyData(): StoriesData | null {
  if (typeof window !== "undefined") {
    const legacyData = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacyData) {
      try {
        const flowData: FlowData = JSON.parse(legacyData);
        const migratedStory: Story = {
          id: "migrated-story",
          name: "Migrated Story",
          description: "Automatically migrated from previous version",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          flowData,
        };

        const storiesData: StoriesData = {
          currentStoryId: "migrated-story",
          stories: {
            "migrated-story": migratedStory,
          },
        };

        // Save migrated data and remove legacy
        saveStoriesData(storiesData);
        localStorage.removeItem(LEGACY_STORAGE_KEY);

        return storiesData;
      } catch (error) {
        console.error("Failed to migrate legacy data:", error);
      }
    }
  }
  return null;
}

// Legacy functions for backward compatibility
export function saveFlowData(): void {
  // This function is now deprecated but kept for compatibility
  console.warn(
    "saveFlowData is deprecated. Use story-based functions instead."
  );
}

export function loadFlowData(): FlowData | null {
  // Try to get current story's flow data
  const stories =
    loadStoriesData() || migrateLegacyData() || getDefaultStoriesData();
  const currentStory = getCurrentStory(stories);
  return currentStory?.flowData || null;
}

export function getDefaultFlowData(): FlowData {
  const defaultStories = getDefaultStoriesData();
  const currentStory = defaultStories.stories[defaultStories.currentStoryId];
  return currentStory.flowData;
}
