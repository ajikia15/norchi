import { Suspense } from "react";
import { loadHotTopicsData } from "../lib/storage";
import HotQuestionsGrid from "./HotQuestionsGrid";
import HotQuestionsGridSkeleton from "./HotQuestionsGridSkeleton";

async function getHotTopicsData() {
  const hotTopicsData = await loadHotTopicsData();
  return Object.values(hotTopicsData.topics);
}

export default async function HotQuestionsPage() {
  const topics = await getHotTopicsData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight mb-4">
            შეუღე კარი სიმართლეს
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            პროვოკაციული კითხვები, რომლებიც ეჭვქვეშ აყენებს პოპულარულ აზროვნებას
            და იკვლევს ლიბერტარიანულ პრინციპებს.
          </p>
        </div>

        <Suspense fallback={<HotQuestionsGridSkeleton />}>
          <HotQuestionsGrid topics={topics} />
        </Suspense>
      </div>
    </div>
  );
}
