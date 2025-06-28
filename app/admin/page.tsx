import { Suspense } from "react";
import { loadStoriesData, loadHotTopics, loadVideos } from "../lib/storage";
import AdminClient from "./AdminClient";
import AdminSkeleton from "../components/AdminSkeleton";
import AdminGuard from "../components/AdminGuard";

interface AdminContentProps {
  searchParams: Promise<{ page?: string; tab?: string }>;
}

async function AdminContent({ searchParams }: AdminContentProps) {
  const params = await searchParams;
  try {
    const page = parseInt(params.page || "1");
    const tab = params.tab || "stories";

    // Use optimized separate data loading with error handling
    const [storiesData, hotTopicsResult, videosResult] = await Promise.all([
      loadStoriesData(),
      loadHotTopics({ page: tab === "hotquestions" ? page : 1, limit: 10 }),
      loadVideos({
        page: tab === "videos" ? page : 1,
        limit: 10,
      }),
    ]);

    // Convert to legacy format for AdminClient compatibility
    const hotTopicsData = {
      topics: Object.fromEntries(
        hotTopicsResult.topics.map((topic) => [topic.id, topic])
      ),
      tags: hotTopicsResult.tags,
    };

    return (
      <AdminClient
        initialStoriesData={storiesData}
        initialHotTopicsData={hotTopicsData}
        initialVideosData={videosResult}
      />
    );
  } catch (error) {
    console.error("Failed to load admin data:", error);

    // Return AdminClient with empty data instead of throwing
    return (
      <AdminClient
        initialStoriesData={{ stories: {}, currentStoryId: "" }}
        initialHotTopicsData={{ topics: {}, tags: {} }}
        initialVideosData={{
          videos: [],
          pagination: {
            currentPage: 1,
            totalPages: 0,
            totalItems: 0,
            itemsPerPage: 10,
            hasNextPage: false,
            hasPreviousPage: false,
          },
        }}
      />
    );
  }
}

export default function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; tab?: string }>;
}) {
  return (
    <AdminGuard>
      <Suspense fallback={<AdminSkeleton />}>
        <AdminContent searchParams={searchParams} />
      </Suspense>
    </AdminGuard>
  );
}
