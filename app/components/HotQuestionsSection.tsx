import { Suspense } from "react";
import { loadHotTopicsData } from "../lib/storage";
import HotQuestionCard from "./HotQuestionCard";

async function HotQuestionsGrid() {
  const hotTopicsData = await loadHotTopicsData();
  const topics = Object.values(hotTopicsData.topics);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
      {topics.map((topic, index) => (
        <div key={topic.id} className="h-48 lg:h-52">
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
      <p className="mt-4 text-gray-600">Loading hot questions...</p>
    </div>
  );
}

export default function HotQuestionsSection() {
  return (
    <section className="py-12 lg:py-16 bg-gradient-to-br from-gray-50/50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium mb-4">
            🔥 Hot Questions
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Challenge Your Beliefs
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Provocative questions that challenge popular thinking and explore
            libertarian principles. Click to reveal our perspective.
          </p>
        </div>

        <Suspense fallback={<HotQuestionsLoading />}>
          <HotQuestionsGrid />
        </Suspense>
      </div>
    </section>
  );
}
