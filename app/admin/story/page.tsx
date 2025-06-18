"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { StoriesData, Story } from "../../types";
import {
  loadStoriesData,
  saveStoriesData,
  getDefaultStoriesData,
  migrateLegacyData,
  deleteStory,
} from "../../lib/storage";
import StoryManager from "../../components/StoryManager";

export default function AdminStoryPage() {
  const [storiesData, setStoriesData] = useState<StoriesData | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Load stories data with migration support
    const loaded =
      loadStoriesData() || migrateLegacyData() || getDefaultStoriesData();
    console.log("AdminStoryPage: Loaded stories data:", loaded);
    setStoriesData(loaded);
  }, []);

  const handleStorySelect = (storyId: string) => {
    console.log("AdminStoryPage: Navigating to edit story:", storyId);
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
    console.log("AdminStoryPage: Created new story:", newStory);
  };

  const handleStoryDelete = (storyId: string) => {
    if (!storiesData) return;

    try {
      const updatedData = deleteStory(storiesData, storyId);
      setStoriesData(updatedData);
      saveStoriesData(updatedData);
      console.log("AdminStoryPage: Deleted story:", storyId);
    } catch (error) {
      console.error("AdminStoryPage: Error deleting story:", error);
      alert("Failed to delete story");
    }
  };

  if (!storiesData) {
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
      {/* Story Management */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <StoryManager
          storiesData={storiesData}
          onStorySelect={handleStorySelect}
          onStoryCreate={handleStoryCreate}
          onStoryDelete={handleStoryDelete}
        />
      </div>
    </div>
  );
}
