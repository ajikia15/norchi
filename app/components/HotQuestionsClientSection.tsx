"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { HotTopic } from "../types";

const AnimatedHotQuestionsGrid = dynamic(
  () => import("./AnimatedHotQuestionsGrid"),
  {
    ssr: false,
  }
);

function HotQuestionsLoadingFallback() {
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

interface HotQuestionsClientSectionProps {
  topics: HotTopic[];
}

export default function HotQuestionsClientSection({
  topics,
}: HotQuestionsClientSectionProps) {
  return (
    <section className="py-12 bg-gradient-to-br from-gray-50/50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-xl text-gray-400 text-center mb-12">
          შეუღე კარი სიმართლეს
        </h2>
        <Suspense fallback={<HotQuestionsLoadingFallback />}>
          <AnimatedHotQuestionsGrid topics={topics} />
        </Suspense>
      </div>
    </section>
  );
}
