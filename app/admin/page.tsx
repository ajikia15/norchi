"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { StoriesData, Story, HotTopicsData, HotTopic } from "../types";
import {
  loadStoriesData,
  saveStoriesData,
  getDefaultStoriesData,
  migrateLegacyData,
  deleteStory,
  loadHotTopicsData,
  saveHotTopicsData,
  getDefaultHotTopicsData,
  updateHotTopic,
  deleteHotTopic,
} from "../lib/storage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StoryManager from "../components/StoryManager";
import HotQuestionsManager from "../components/HotQuestionsManager";

export default function AdminPage() {
  const [storiesData, setStoriesData] = useState<StoriesData | null>(null);
  const [hotTopicsData, setHotTopicsData] = useState<HotTopicsData | null>(
    null
  );
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "stories";

  useEffect(() => {
    // Load stories data with migration support
    const loadedStories =
      loadStoriesData() || migrateLegacyData() || getDefaultStoriesData();
    console.log("AdminPage: Loaded stories data:", loadedStories);
    setStoriesData(loadedStories);

    // Load hot topics data
    const loadedTopics = loadHotTopicsData() || getDefaultHotTopicsData();
    console.log("AdminPage: Loaded hot topics data:", loadedTopics);
    setHotTopicsData(loadedTopics);
  }, []);

  const handleTabChange = (value: string) => {
    router.push(`/admin?tab=${value}`);
  };

  // Story handlers
  const handleStorySelect = (storyId: string) => {
    console.log("AdminPage: Navigating to edit story:", storyId);
    router.push(`/admin/story/edit/${storyId}`);
  };

  const handleStoryCreate = (newStory: Story) => {
    if (!storiesData) return;

    const updatedData = {
      ...storiesData,
      stories: {
        ...storiesData.stories,
        [newStory.id]: newStory,
      },
      currentStoryId: newStory.id,
    };

    setStoriesData(updatedData);
    saveStoriesData(updatedData);
    console.log("AdminPage: Created new story:", newStory);
  };

  const handleStoryDelete = (storyId: string) => {
    if (!storiesData) return;

    try {
      const updatedData = deleteStory(storiesData, storyId);
      setStoriesData(updatedData);
      saveStoriesData(updatedData);
      console.log("AdminPage: Deleted story:", storyId);
    } catch (error) {
      console.error("AdminPage: Error deleting story:", error);
      alert("Failed to delete story");
    }
  };

  // Hot topics handlers
  const handleTopicCreate = (newTopic: HotTopic) => {
    if (!hotTopicsData) return;

    const updatedData = {
      ...hotTopicsData,
      topics: {
        ...hotTopicsData.topics,
        [newTopic.id]: newTopic,
      },
    };

    setHotTopicsData(updatedData);
    saveHotTopicsData(updatedData);
    console.log("AdminPage: Created new topic:", newTopic);
  };

  const handleTopicUpdate = (
    topicId: string,
    updates: Partial<Omit<HotTopic, "id">>
  ) => {
    if (!hotTopicsData) return;

    try {
      const updatedData = updateHotTopic(hotTopicsData, topicId, updates);
      setHotTopicsData(updatedData);
      saveHotTopicsData(updatedData);
      console.log("AdminPage: Updated topic:", topicId, updates);
    } catch (error) {
      console.error("AdminPage: Error updating topic:", error);
      alert("Failed to update hot question");
    }
  };

  const handleTopicDelete = (topicId: string) => {
    if (!hotTopicsData) return;

    try {
      const updatedData = deleteHotTopic(hotTopicsData, topicId);
      setHotTopicsData(updatedData);
      saveHotTopicsData(updatedData);
      console.log("AdminPage: Deleted topic:", topicId);
    } catch (error) {
      console.error("AdminPage: Error deleting topic:", error);
      alert("Failed to delete hot question");
    }
  };

  if (!storiesData || !hotTopicsData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="text-2xl font-semibold text-gray-600 animate-pulse">
          Loading admin panel...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-muted-foreground">
            Manage your logical challenge stories and hot questions
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="stories">Story Management</TabsTrigger>
            <TabsTrigger value="hot-questions">Hot Questions</TabsTrigger>
          </TabsList>

          <TabsContent value="stories" className="mt-6">
            <StoryManager
              storiesData={storiesData}
              onStorySelect={handleStorySelect}
              onStoryCreate={handleStoryCreate}
              onStoryDelete={handleStoryDelete}
            />
          </TabsContent>

          <TabsContent value="hot-questions" className="mt-6">
            <HotQuestionsManager
              hotTopicsData={hotTopicsData}
              onTopicCreate={handleTopicCreate}
              onTopicUpdate={handleTopicUpdate}
              onTopicDelete={handleTopicDelete}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
