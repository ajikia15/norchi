"use client";

import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { StoriesData, HotTopicsData, VideoPromise } from "../types";
import {
  createStory,
  deleteStory as deleteStoryAction,
  createHotTopic,
  updateHotTopic as updateHotTopicAction,
  deleteHotTopic as deleteHotTopicAction,
  createTag,
  updateTag,
  deleteTag,
  exportHotTopics,
  importHotTopic,
  createVideoPromise,
  updateVideoPromise,
  deleteVideoPromise,
  updateVideoPromiseAlgorithmPoints,
} from "../lib/actions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StoryManagerClient from "../components/StoryManagerClient";
import HotQuestionsManagerClient from "../components/HotQuestionsManagerClient";
import VideoPromisesManagerClient from "../components/VideoPromisesManagerClient";

interface AdminClientProps {
  initialStoriesData: StoriesData;
  initialHotTopicsData: HotTopicsData;
  initialVideoPromisesData: {
    videoPromises: VideoPromise[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
}

// Utility function for file downloads
function downloadJsonFile(data: unknown, filename: string) {
  const dataStr = JSON.stringify(data, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

export default function AdminClient({
  initialStoriesData,
  initialHotTopicsData,
  initialVideoPromisesData,
}: AdminClientProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get tab from URL or default to "stories"
  const activeTab = searchParams.get("tab") || "stories";

  const handleTabChange = (value: string) => {
    router.push(`/admin?tab=${value}`);
  };

  const handleVideoPromisesPageChange = (page: number) => {
    router.push(`/admin?tab=videoPromises&page=${page}`);
  };

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
          router.refresh();
        }
      } catch (error) {
        console.error("Error creating story:", error);
        alert("გზის შექმნა ვერ მოხერხდა");
      }
    });
  };

  const handleStoryDelete = async (storyId: string) => {
    if (
      !confirm(
        "დარწმუნებული ხართ, რომ გსურთ ამ გზის წაშლა? ამ ქმედების გაუქმება შეუძლებელია."
      )
    ) {
      return;
    }

    startTransition(async () => {
      try {
        await deleteStoryAction(storyId);
        router.refresh();
      } catch (error) {
        console.error("Error deleting story:", error);
        alert("გზის წაშლა ვერ მოხერხდა");
      }
    });
  };

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
        console.error("Error creating tag:", error);
        alert("თეგის შექმნა ვერ მოხერხდა");
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
        console.error("Error updating tag:", error);
        alert("თეგის განახლება ვერ მოხერხდა");
      }
    });
  };

  const handleTagDelete = async (tagId: string) => {
    startTransition(async () => {
      try {
        await deleteTag(tagId);
        router.refresh();
      } catch (error) {
        console.error("Error deleting tag:", error);
        alert("თეგის წაშლა ვერ მოხერხდა");
      }
    });
  };

  const handleTopicCreate = async (
    selectedTags: string[],
    title: string,
    answer: string
  ) => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("tags", JSON.stringify(selectedTags));
        formData.append("title", title);
        formData.append("answer", answer);

        const result = await createHotTopic(formData);
        if (result.success) {
          router.refresh();
        }
      } catch (error) {
        console.error("Error creating hot topic:", error);
        alert("ცხელი კითხვის შექმნა ვერ მოხერხდა");
      }
    });
  };

  const handleTopicUpdate = async (
    topicId: string,
    selectedTags: string[],
    title: string,
    answer: string
  ) => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("tags", JSON.stringify(selectedTags));
        formData.append("title", title);
        formData.append("answer", answer);

        await updateHotTopicAction(topicId, formData);
        router.refresh();
      } catch (error) {
        console.error("Error updating hot topic:", error);
        alert("ცხელი კითხვის განახლება ვერ მოხერხდა");
      }
    });
  };

  const handleTopicDelete = async (topicId: string) => {
    startTransition(async () => {
      try {
        await deleteHotTopicAction(topicId);
        router.refresh();
      } catch (error) {
        console.error("Error deleting hot topic:", error);
        alert("ცხელი კითხვის წაშლა ვერ მოხერხდა");
      }
    });
  };

  const handleExportTopics = async () => {
    startTransition(async () => {
      try {
        const result = await exportHotTopics();
        if (result.success) {
          downloadJsonFile(
            result.data,
            result.filename || "hot-topics-export.json"
          );
        } else {
          alert("ექსპორტი ვერ მოხერხდა");
        }
      } catch (error) {
        console.error("Error exporting hot topics:", error);
        alert("ექსპორტი ვერ მოხერხდა");
      }
    });
  };

  const handleImportTopic = async (jsonData: string) => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("jsonData", jsonData);

        const result = await importHotTopic(formData);
        if (result.success) {
          alert(result.message || "ცხელი კითხვა წარმატებით იმპორტირდა!");
          router.refresh();
        } else {
          alert(`იმპორტი ვერ მოხერხდა: ${result.error}`);
        }
      } catch (error) {
        console.error("Error importing hot topic:", error);
        alert("იმპორტი ვერ მოხერხდა");
      }
    });
  };

  // Video Promises handlers
  const handleVideoPromiseCreate = async (ytVideoId: string, title: string) => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("ytVideoId", ytVideoId);
        formData.append("title", title);

        const result = await createVideoPromise(formData);
        if (result.success) {
          router.refresh();
        }
      } catch (error) {
        console.error("Error creating video promise:", error);
        alert("ვიდეო დაპირების შექმნა ვერ მოხერხდა");
      }
    });
  };

  const handleVideoPromiseUpdate = async (
    id: string,
    ytVideoId: string,
    title: string
  ) => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("ytVideoId", ytVideoId);
        formData.append("title", title);

        await updateVideoPromise(id, formData);
        router.refresh();
      } catch (error) {
        console.error("Error updating video promise:", error);
        alert("ვიდეო დაპირების განახლება ვერ მოხერხდა");
      }
    });
  };

  const handleVideoPromiseDelete = async (id: string) => {
    startTransition(async () => {
      try {
        await deleteVideoPromise(id);
        router.refresh();
      } catch (error) {
        console.error("Error deleting video promise:", error);
        alert("ვიდეო დაპირების წაშლა ვერ მოხერხდა");
      }
    });
  };

  const handleVideoPromiseAlgorithmPointsUpdate = async (
    id: string,
    algorithmPoints: number
  ) => {
    startTransition(async () => {
      try {
        const result = await updateVideoPromiseAlgorithmPoints(
          id,
          algorithmPoints
        );
        if (result.success) {
          router.refresh();
        } else {
          alert("ალგორითმული ქულების განახლება ვერ მოხერხდა");
        }
      } catch (error) {
        console.error("Error updating algorithm points:", error);
        alert("ალგორითმული ქულების განახლება ვერ მოხერხდა");
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ნორჩის ადმინისტრატორის პანელი
          </h1>
          <p className="text-gray-600">
            მართეთ თქვენი იდეოლოგიური გამოწვევის სისტემა
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="stories">გზები</TabsTrigger>
            <TabsTrigger value="hotquestions">ცხელი კითხვები</TabsTrigger>
            <TabsTrigger value="videoPromises">ვიდეო დაპირებები</TabsTrigger>
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
              onExportTopics={handleExportTopics}
              onImportTopic={handleImportTopic}
              isLoading={isPending}
            />
          </TabsContent>

          <TabsContent value="videoPromises" className="mt-6">
            <VideoPromisesManagerClient
              videoPromises={initialVideoPromisesData.videoPromises}
              pagination={initialVideoPromisesData.pagination}
              onVideoPromiseCreate={handleVideoPromiseCreate}
              onVideoPromiseUpdate={handleVideoPromiseUpdate}
              onVideoPromiseDelete={handleVideoPromiseDelete}
              onPageChange={handleVideoPromisesPageChange}
              onAlgorithmPointsUpdate={handleVideoPromiseAlgorithmPointsUpdate}
              isLoading={isPending}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
