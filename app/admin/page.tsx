import { Suspense } from "react";
import { loadAllData } from "../lib/storage";
import AdminClient from "./AdminClient";
import AdminSkeleton from "../components/AdminSkeleton";
import AdminGuard from "../components/AdminGuard";

async function AdminContent() {
  try {
    // Use optimized parallel data loading with error handling
    const { storiesData, hotTopicsData } = await loadAllData();

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
