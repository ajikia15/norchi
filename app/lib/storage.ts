import {
  FlowData,
  Story,
  StoriesData,
  HotTopic,
  HotTopicsData,
} from "../types";
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

// Hot Topics storage functions
const HOT_TOPICS_STORAGE_KEY = "norchi-hot-topics-data";

export function saveHotTopicsData(data: HotTopicsData): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(HOT_TOPICS_STORAGE_KEY, JSON.stringify(data));
  }
}

export function loadHotTopicsData(): HotTopicsData | null {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(HOT_TOPICS_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error("Failed to parse stored hot topics data:", error);
      }
    }
  }
  return null;
}

export function getDefaultHotTopicsData(): HotTopicsData {
  return {
    topics: {
      "ht-1": {
        id: "ht-1",
        category: "Drugs",
        title: "Should marijuana be fully legalized?",
        answer:
          "Individual freedom requires the right to make personal choices about your own body, even if others disagree with those choices.",
        link: "/story/wine-weed",
      },
      "ht-2": {
        id: "ht-2",
        category: "Property",
        title: "Should the government control rent prices?",
        answer:
          "Price controls create shortages and reduce quality. Free markets provide better outcomes than government intervention.",
      },
      "ht-3": {
        id: "ht-3",
        category: "Military",
        title: "Should military service be mandatory?",
        answer:
          "Forced labor violates individual liberty. A free society cannot be built on coercion.",
        link: "/story/army-service",
      },
      "ht-4": {
        id: "ht-4",
        category: "Education",
        title: "Should college be free for everyone?",
        answer:
          "Nothing is truly 'free' - someone always pays. Government-funded education creates inefficiency and reduces quality.",
      },
      "ht-5": {
        id: "ht-5",
        category: "Healthcare",
        title: "Should healthcare be a human right?",
        answer:
          "Rights are freedoms from interference, not claims on others' labor. Healthcare is a service, not a right.",
      },
      "ht-6": {
        id: "ht-6",
        category: "Taxation",
        title: "Should we tax the rich more heavily?",
        answer:
          "Progressive taxation punishes success and reduces incentives to create value. Flat taxes are more just and efficient.",
      },
      "ht-7": {
        id: "ht-7",
        category: "Environment",
        title: "Should government ban plastic bags?",
        answer:
          "Market solutions and voluntary action work better than government bans. Innovation, not prohibition, solves problems.",
      },
      "ht-8": {
        id: "ht-8",
        category: "Privacy",
        title: "Should government monitor citizens for security?",
        answer:
          "Security without privacy is tyranny. A free society requires limits on government surveillance power.",
      },
      "ht-9": {
        id: "ht-9",
        category: "Economics",
        title: "Should there be a universal basic income?",
        answer:
          "UBI creates dependency and reduces work incentives. Economic freedom comes from opportunity, not handouts.",
      },
      "ht-10": {
        id: "ht-10",
        category: "Labor",
        title: "Should minimum wage be increased?",
        answer:
          "Minimum wage laws price low-skilled workers out of jobs. Free markets determine fair wages better than bureaucrats.",
      },
      "ht-11": {
        id: "ht-11",
        category: "Trade",
        title: "Should we impose tariffs to protect jobs?",
        answer:
          "Tariffs are taxes on consumers that make everyone poorer. Free trade benefits all parties through specialization.",
      },
      "ht-12": {
        id: "ht-12",
        category: "Immigration",
        title: "Should borders be completely open?",
        answer:
          "Free movement of people, like free trade, increases prosperity. Borders should facilitate, not restrict, peaceful exchange.",
      },
    },
  };
}

export function createNewHotTopic(
  category: string,
  title: string,
  answer: string,
  link?: string
): HotTopic {
  const id = `ht-${Date.now()}`;
  return {
    id,
    category,
    title,
    answer,
    link,
  };
}

export function updateHotTopic(
  topics: HotTopicsData,
  topicId: string,
  updates: Partial<Omit<HotTopic, "id">>
): HotTopicsData {
  if (!topics.topics[topicId]) {
    throw new Error(`Hot topic with id ${topicId} not found`);
  }

  return {
    ...topics,
    topics: {
      ...topics.topics,
      [topicId]: {
        ...topics.topics[topicId],
        ...updates,
      },
    },
  };
}

export function deleteHotTopic(
  topics: HotTopicsData,
  topicId: string
): HotTopicsData {
  if (!topics.topics[topicId]) {
    throw new Error(`Hot topic with id ${topicId} not found`);
  }

  const newTopics = { ...topics.topics };
  delete newTopics[topicId];

  return {
    topics: newTopics,
  };
}
