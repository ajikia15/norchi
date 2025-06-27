import { Suspense } from "react";
import {
  loadStoriesData,
  loadHotTopics,
  loadVideoPromises,
} from "../lib/storage";
import AdminClient from "./AdminClient";
import AdminSkeleton from "../components/AdminSkeleton";
import AdminGuard from "../components/AdminGuard";

interface AdminContentProps {
  searchParams: { page?: string; tab?: string };
}

async function AdminContent({ searchParams }: AdminContentProps) {
  try {
    const page = parseInt(searchParams.page || "1");
    const tab = searchParams.tab || "stories";

    // Use optimized separate data loading with error handling
    const [storiesData, hotTopicsResult, videoPromisesResult] =
      await Promise.all([
        loadStoriesData(),
        loadHotTopics({ page: tab === "hotquestions" ? page : 1, limit: 10 }),
        loadVideoPromises({
          page: tab === "videoPromises" ? page : 1,
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
        initialVideoPromisesData={videoPromisesResult}
      />
    );
  } catch (error) {
    console.error("Failed to load admin data:", error);

    // Return AdminClient with empty data instead of throwing
    return (
      <AdminClient
        initialStoriesData={{ stories: {}, currentStoryId: "" }}
        initialHotTopicsData={{ topics: {}, tags: {} }}
        initialVideoPromisesData={{
          videoPromises: [],
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
  searchParams: { page?: string; tab?: string };
}) {
  return (
    <AdminGuard>
      <Suspense fallback={<AdminSkeleton />}>
        <AdminContent searchParams={searchParams} />
      </Suspense>
    </AdminGuard>
  );
}
