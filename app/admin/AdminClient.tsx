"use client";

import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { StoriesData, HotTopicsData } from "../types";
import {
  createStory,
  deleteStory as deleteStoryAction,
  createHotTopic,
  updateHotTopic as updateHotTopicAction,
  deleteHotTopic as deleteHotTopicAction,
  createTag,
  updateTag,
  deleteTag,
} from "../lib/actions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StoryManagerClient from "../components/StoryManagerClient";
import HotQuestionsManagerClient from "../components/HotQuestionsManagerClient";

interface AdminClientProps {
  initialStoriesData: StoriesData;
  initialHotTopicsData: HotTopicsData;
}

export default function AdminClient({
  initialStoriesData,
  initialHotTopicsData,
}: AdminClientProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "stories";

  const handleTabChange = (value: string) => {
    router.push(`/admin?tab=${value}`);
  };

  // Story handlers
  const handleStorySelect = (storyId: string) => {
    router.push(`/admin/story/edit/${storyId}`);
  };

  const handleStoryCreate = async (name: string, description?: string) => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("name", name);
        if (description) {
          formData.append("description", description);
        }

        const result = await createStory(formData);
        if (result.success) {
          // Refresh the page to get updated data
          router.refresh();
        }
      } catch (error) {
        console.error("AdminClient: Error creating story:", error);
        alert("Failed to create story");
      }
    });
  };

  const handleStoryDelete = async (storyId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this story? This action cannot be undone."
      )
    ) {
      return;
    }

    startTransition(async () => {
      try {
        await deleteStoryAction(storyId);
        // Refresh the page to get updated data
        router.refresh();
      } catch (error) {
        console.error("AdminClient: Error deleting story:", error);
        alert("Failed to delete story");
      }
    });
  };

  // Tag handlers
  const handleTagCreate = async (
    id: string,
    label: string,
    emoji: string,
    color: string
  ) => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("id", id);
        formData.append("label", label);
        formData.append("emoji", emoji);
        formData.append("color", color);

        const result = await createTag(formData);
        if (result.success) {
          router.refresh();
        }
      } catch (error) {
        console.error("AdminClient: Error creating tag:", error);
        alert("Failed to create tag");
      }
    });
  };

  const handleTagUpdate = async (
    tagId: string,
    label: string,
    emoji: string,
    color: string
  ) => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("label", label);
        formData.append("emoji", emoji);
        formData.append("color", color);

        await updateTag(tagId, formData);
        router.refresh();
      } catch (error) {
        console.error("AdminClient: Error updating tag:", error);
        alert("Failed to update tag");
      }
    });
  };

  const handleTagDelete = async (tagId: string) => {
    startTransition(async () => {
      try {
        await deleteTag(tagId);
        router.refresh();
      } catch (error) {
        console.error("AdminClient: Error deleting tag:", error);
        alert("Failed to delete tag");
      }
    });
  };

  // Hot topics handlers
  const handleTopicCreate = async (
    selectedTags: string[],
    title: string,
    answer: string,
    link?: string
  ) => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("tags", JSON.stringify(selectedTags));
        formData.append("title", title);
        formData.append("answer", answer);
        if (link) {
          formData.append("link", link);
        }

        const result = await createHotTopic(formData);
        if (result.success) {
          // Refresh the page to get updated data
          router.refresh();
        }
      } catch (error) {
        console.error("AdminClient: Error creating hot topic:", error);
        alert("Failed to create hot question");
      }
    });
  };

  const handleTopicUpdate = async (
    topicId: string,
    selectedTags: string[],
    title: string,
    answer: string,
    link?: string
  ) => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("tags", JSON.stringify(selectedTags));
        formData.append("title", title);
        formData.append("answer", answer);
        if (link) {
          formData.append("link", link);
        }

        await updateHotTopicAction(topicId, formData);
        // Refresh the page to get updated data
        router.refresh();
      } catch (error) {
        console.error("AdminClient: Error updating hot topic:", error);
        alert("Failed to update hot question");
      }
    });
  };

  const handleTopicDelete = async (topicId: string) => {
    startTransition(async () => {
      try {
        await deleteHotTopicAction(topicId);
        // Refresh the page to get updated data
        router.refresh();
      } catch (error) {
        console.error("AdminClient: Error deleting hot topic:", error);
        alert("Failed to delete hot question");
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Norchi Admin Panel
          </h1>
          <p className="text-gray-600">
            Manage your ideological challenge system
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="stories">Stories</TabsTrigger>
            <TabsTrigger value="hotquestions">Hot Questions</TabsTrigger>
          </TabsList>

          <TabsContent value="stories" className="mt-6">
            <StoryManagerClient
              storiesData={initialStoriesData}
              onStorySelect={handleStorySelect}
              onStoryCreate={handleStoryCreate}
              onStoryDelete={handleStoryDelete}
              isLoading={isPending}
            />
          </TabsContent>

          <TabsContent value="hotquestions" className="mt-6">
            <HotQuestionsManagerClient
              hotTopicsData={initialHotTopicsData}
              onTopicCreate={handleTopicCreate}
              onTopicUpdate={handleTopicUpdate}
              onTopicDelete={handleTopicDelete}
              onTagCreate={handleTagCreate}
              onTagUpdate={handleTagUpdate}
              onTagDelete={handleTagDelete}
              isLoading={isPending}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
