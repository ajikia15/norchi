import { Suspense } from "react";
import { loadAllData } from "../lib/storage";
import AdminClient from "./AdminClient";
import AdminSkeleton from "../components/AdminSkeleton";

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
    <Suspense fallback={<AdminSkeleton />}>
      <AdminContent />
    </Suspense>
  );
}
