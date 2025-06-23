import { Suspense } from "react";
import { loadAllData } from "../lib/storage";
import AdminClient from "./AdminClient";

async function AdminContent() {
  // Use optimized parallel data loading
  const { storiesData, hotTopicsData } = await loadAllData();

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
            ადმინისტრატორის პანელის ჩატვირთვა...
          </div>
        </div>
      }
    >
      <AdminContent />
    </Suspense>
  );
}
