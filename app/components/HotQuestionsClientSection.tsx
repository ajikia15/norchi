"use client";

import { Suspense, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { HotTopic } from "../types";
import HotQuestionCardSkeleton from "./HotQuestionCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

const AnimatedHotQuestionsGrid = dynamic(
  () => import("./AnimatedHotQuestionsGrid"),
  {
    ssr: false,
  }
);

/**
 * Skeleton component that matches the exact layout of the real content
 * to prevent layout shifts during loading
 */
function HotQuestionsLoadingSkeleton({ topicsCount }: { topicsCount: number }) {
  const mobileCardsCount = Math.min(topicsCount, 3);

  return (
    <>
      {/* Mobile skeleton - carousel layout */}
      <div className="block md:hidden">
        <div className="overflow-hidden">
          <div className="flex">
            {Array.from({ length: mobileCardsCount }).map((_, index) => (
              <div key={index} className="min-w-0 flex-[0_0_85%] pl-4">
                <HotQuestionCardSkeleton />
              </div>
            ))}
          </div>
        </div>
        {topicsCount > 1 && (
          <div className="mt-6 flex justify-center space-x-2">
            {Array.from({ length: Math.min(topicsCount, 5) }).map(
              (_, index) => (
                <Skeleton key={index} className="h-2 w-2 rounded-full" />
              )
            )}
          </div>
        )}
      </div>

      {/* Desktop skeleton - flex-wrap grid layout */}
      <div className="hidden md:flex flex-wrap justify-center gap-4 lg:gap-6">
        {Array.from({ length: topicsCount }).map((_, index) => (
          <div
            key={index}
            className="relative h-[22rem] w-full sm:w-80 lg:w-72"
          >
            <div className="absolute inset-0 rounded-lg border-2 border-gray-300 bg-white p-4 shadow-lg">
              <Skeleton className="absolute left-2 top-1/2 h-8 w-2 -translate-y-1/2 rounded-r-md" />
              <div className="absolute top-16 left-1/2 -translate-x-1/2">
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
              <div className="flex h-full items-center justify-center">
                <div className="space-y-3 text-center">
                  <Skeleton className="h-6 w-48 mx-auto" />
                  <Skeleton className="h-6 w-32 mx-auto" />
                </div>
              </div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

interface HotQuestionsClientSectionProps {
  topics: HotTopic[];
  user?: { id: string } | null;
}

/**
 * Hot Questions section with CSS Grid stacking technique to prevent layout shifts.
 * Uses overlapping skeleton and real content in the same grid area for seamless transitions.
 */
export default function HotQuestionsClientSection({
  topics,
  user,
}: HotQuestionsClientSectionProps) {
  const [contentLoaded, setContentLoaded] = useState(false);

  // Handle skeleton-to-content transition
  useEffect(() => {
    const timer = setTimeout(() => {
      setContentLoaded(true);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-8 bg-gradient-to-br from-gray-50/50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-xl text-gray-400 text-center mb-8">
          შეუღე კარი სიმართლეს
        </h2>

        {/* CSS Grid stacking - both layers occupy [grid-area:1/1] */}
        <div className="grid">
          {/* Skeleton layer - fades out when content loads */}
          <div
            className={`[grid-area:1/1] transition-opacity duration-500 ${
              contentLoaded ? "opacity-0" : "opacity-100"
            }`}
          >
            <HotQuestionsLoadingSkeleton topicsCount={topics.length} />
          </div>

          {/* Real content layer - fades in when ready */}
          <div
            className={`[grid-area:1/1] transition-opacity duration-500 ${
              contentLoaded ? "opacity-100" : "opacity-0"
            }`}
          >
            <Suspense fallback={null}>
              <AnimatedHotQuestionsGrid topics={topics} user={user} />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
}
