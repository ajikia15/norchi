import { Suspense } from "react";
import { loadHotTopicsData } from "../lib/storage";
import AnimatedHotQuestionsGrid from "./AnimatedHotQuestionsGrid";

async function HotQuestionsGrid() {
  const hotTopicsData = await loadHotTopicsData();
  const topics = Object.values(hotTopicsData.topics);

  return <AnimatedHotQuestionsGrid topics={topics} />;
}

function HotQuestionsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-6 text-center">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-primary"></div>
      <p className="mt-4 text-gray-600">აქტუალური კითხვების ჩატვირთვა...</p>
    </div>
  );
}

export default function HotQuestionsSection() {
  return (
    <section className="py-12 lg:py-16 bg-gradient-to-br from-gray-50/50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl lg:text-6xl font-bold text-gray-900  text-center mb-12">
          გაუღე კარი სიმართლეს
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
