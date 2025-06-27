import { Suspense } from "react";
import { loadHotTopics } from "../lib/storage";
import { getCurrentUser } from "../lib/auth-utils";
import HotQuestionsClient from "./HotQuestionsClient";
import HotQuestionsGridSkeleton from "./HotQuestionsGridSkeleton";

// Add static generation to reduce server CPU
export const revalidate = 1800; // Revalidate every 30 minutes

export default async function HotQuestionsPage() {
  const user = await getCurrentUser();
  const hotTopicsResult = await loadHotTopics({
    page: 1,
    limit: 12,
    userId: user?.id, // Pass userId to batch-load saved status
  });

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
          <HotQuestionsClient topics={hotTopicsResult.topics} user={user} />
        </Suspense>
      </div>
    </div>
  );
}
