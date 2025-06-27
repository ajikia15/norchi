import { Suspense } from "react";
import { loadStoriesData, loadHotTopics } from "../lib/storage";
import AdminClient from "./AdminClient";
import AdminSkeleton from "../components/AdminSkeleton";
import AdminGuard from "../components/AdminGuard";

async function AdminContent() {
  try {
    // Use optimized separate data loading with error handling
    const [storiesData, hotTopicsResult] = await Promise.all([
      loadStoriesData(),
      loadHotTopics(), // Load all for admin management
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
      />
    );
  } catch (error) {
    console.error("Failed to load admin data:", error);

    // Return AdminClient with empty data instead of throwing
    return (
      <AdminClient
        initialStoriesData={{ stories: {}, currentStoryId: "" }}
        initialHotTopicsData={{ topics: {}, tags: {} }}
      />
    );
  }
}

export default function AdminPage() {
  return (
    <AdminGuard>
      <Suspense fallback={<AdminSkeleton />}>
        <AdminContent />
      </Suspense>
    </AdminGuard>
  );
}
