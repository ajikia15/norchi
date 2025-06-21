import { Suspense } from "react";
import { loadStoriesData, loadHotTopicsData } from "../lib/storage";
import AdminClient from "./AdminClient";

async function AdminContent() {
  // Load data server-side
  const [storiesData, hotTopicsData] = await Promise.all([
    loadStoriesData(),
    loadHotTopicsData(),
  ]);

  return (
    <AdminClient
      initialStoriesData={storiesData}
      initialHotTopicsData={hotTopicsData}
    />
  );
}

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-white">
          <div className="text-2xl font-semibold text-gray-600 animate-pulse">
            Loading admin panel...
          </div>
        </div>
      }
    >
      <AdminContent />
    </Suspense>
  );
}
