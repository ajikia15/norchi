import { Suspense } from "react";
import { loadHotTopicsData } from "../lib/storage";
import HotQuestionCard from "./HotQuestionCard";

async function HotQuestionsGrid() {
  const hotTopicsData = await loadHotTopicsData();
  const topics = Object.values(hotTopicsData.topics);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-8">
      {topics.map((topic, index) => (
        <div key={topic.id}>
          <HotQuestionCard topic={topic} index={index} />
        </div>
      ))}
    </div>
  );
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
    <section className="py-12 lg:py-16 bg-gradient-to-br from-gray-50/50 to-white">
      <div className="max-w-7xl mx-auto px-6">
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
