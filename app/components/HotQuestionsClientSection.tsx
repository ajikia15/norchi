"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { HotTopic } from "../types";
const AnimatedHotQuestionsGrid = dynamic(
  () => import("./AnimatedHotQuestionsGrid"),
  {
    ssr: false,
    // No loading component needed - individual cards will show skeletons
  }
);

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
        <Suspense fallback={<div className="min-h-[24rem]" />}>
          <AnimatedHotQuestionsGrid topics={topics} />
        </Suspense>
      </div>
    </section>
  );
}
