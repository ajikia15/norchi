import { Suspense } from "react";
import { loadHotTopicsData } from "../lib/storage";
import dynamic from "next/dynamic";
const AnimatedHotQuestionsGrid = dynamic(
  () => import("./AnimatedHotQuestionsGrid"),
  {
    ssr: false,
    // No loading component needed - individual cards will show skeletons
  }
);

// Server component that loads data and passes to client component
async function HotQuestionsGrid() {
  const hotTopicsData = await loadHotTopicsData();
  const topics = Object.values(hotTopicsData.topics);

  return <AnimatedHotQuestionsGrid topics={topics} />;
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

        <Suspense fallback={<div className="min-h-[24rem]" />}>
          <HotQuestionsGrid />
        </Suspense>
      </div>
    </section>
  );
}
