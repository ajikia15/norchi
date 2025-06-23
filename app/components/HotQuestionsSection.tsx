import { Suspense } from "react";
import { loadHotTopicsData } from "../lib/storage";
import AnimatedHotQuestionsGrid from "./AnimatedHotQuestionsGrid";

// Server component that loads data and passes to client component
async function HotQuestionsGrid() {
  const hotTopicsData = await loadHotTopicsData();
  const topics = Object.values(hotTopicsData.topics);

  return <AnimatedHotQuestionsGrid topics={topics} />;
}

function HotQuestionsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-6 text-center">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-80 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
    </div>
  );
}

// This component is kept for backward compatibility but is now optimized
export default function HotQuestionsSection() {
  return (
    <section className="py-12 bg-gradient-to-br from-gray-50/50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-xl text-gray-400 text-center mb-12">
          შეუღე კარი სიმართლეს
        </h2>
        {/* <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium mb-4">
            🔥 აქტუალური კითხვები
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            გამოიწვიე შენი რწმენები
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            პროვოკაციული კითხვები, რომლებიც ეჭვქვეშ აყენებს პოპულარულ აზროვნებას
            და იკვლევს ლიბერტარიანულ პრინციპებს. დააკლიკეთ ჩვენი პერსპექტივის
            სანახავად.
          </p>
        </div> */}

        <Suspense fallback={<HotQuestionsLoading />}>
          <HotQuestionsGrid />
        </Suspense>
      </div>
    </section>
  );
}
