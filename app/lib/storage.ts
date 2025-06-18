import { FlowData, Story, StoriesData } from "../types";

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
  return {
    currentStoryId: "wine-weed-story",
    stories: {
      "wine-weed-story": createDefaultWineWeedStory(),
    },
  };
}

export function createDefaultWineWeedStory(): Story {
  return {
    id: "wine-weed-story",
    name: "Wine & Weed: A Georgian Perspective",
    description:
      "A logical challenge exploring consistency in personal freedom beliefs through Georgian wine culture.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    flowData: {
      startNodeId: "q1",
      nodes: {
        q1: {
          id: "q1",
          type: "question",
          text: "Georgians take pride in their wine. Should people be free to drink wine, even if some abuse it?",
          options: [
            { label: "Yes, of course", nextNodeId: "q2" },
            { label: "No, too much harm", nextNodeId: "callout1" },
            { label: "Why ask about wine?", nextNodeId: "callout1" },
          ],
        },
        callout1: {
          id: "callout1",
          type: "callout",
          text: "Wine's our heritage. If you'd ban it, you're contradicting Georgia.",
          returnToNodeId: "q1",
          buttonLabel: "Try Again",
        },
        q2: {
          id: "q2",
          type: "question",
          text: "If the government banned wine tomorrow, would you stop drinking it?",
          options: [
            { label: "No, I'd find a way", nextNodeId: "q3" },
            { label: "Yes, I obey the law", nextNodeId: "infocard1" },
            { label: "Sounds illegal", nextNodeId: "callout2" },
          ],
        },
        infocard1: {
          id: "infocard1",
          type: "infocard",
          text: "Historically, Prohibition in the U.S. led to more crime, not less.",
          nextNodeId: "q3",
          buttonLabel: "Continue",
        },
        callout2: {
          id: "callout2",
          type: "callout",
          text: "Respecting law is fine—unless the law's wrong. Think again.",
          returnToNodeId: "q2",
          buttonLabel: "Try Again",
        },
        q3: {
          id: "q3",
          type: "question",
          text: "So what makes weed different from wine?",
          options: [
            { label: "It's more dangerous", nextNodeId: "callout3" },
            { label: "It's not different", nextNodeId: "end1" },
            { label: "Sounds biased", nextNodeId: "callout3" },
          ],
        },
        callout3: {
          id: "callout3",
          type: "callout",
          text: "8,000 years of wine tradition, zero logic on weed. Reconsider.",
          returnToNodeId: "q3",
          buttonLabel: "Try Again",
        },
        end1: {
          id: "end1",
          type: "end",
          text: "You just argued for personal freedom over tradition. Welcome to choice.",
        },
      },
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
  return createDefaultWineWeedStory().flowData;
}
