"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { HotTopic } from "../types";
import HotQuestionCardSkeleton from "./HotQuestionCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

const AnimatedHotQuestionsGrid = dynamic(
  () => import("./AnimatedHotQuestionsGrid"),
  {
    ssr: false,
    // No loading component needed - individual cards will show skeletons
  }
);

function HotQuestionsLoadingSkeleton({ topicsCount }: { topicsCount: number }) {
  // Calculate how many cards to show on mobile (max 3 visible in carousel)
  const mobileCardsCount = Math.min(topicsCount, 3);

  return (
    <>
      {/* Mobile skeleton */}
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

      {/* Desktop skeleton - matches exact real component structure */}
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
}

export default function HotQuestionsClientSection({
  topics,
}: HotQuestionsClientSectionProps) {
  return (
    <section className="py-8 bg-gradient-to-br from-gray-50/50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-xl text-gray-400 text-center mb-8">
          შეუღე კარი სიმართლეს
        </h2>
        {/* CSS Grid stacking container - both skeleton and real content occupy the same grid area */}
        <div className="grid">
          {/* Skeleton layer - always present but hidden when content loads */}
          <div
            className="[grid-area:1/1] transition-opacity duration-500"
            data-skeleton-layer
          >
            <HotQuestionsLoadingSkeleton topicsCount={topics.length} />
          </div>

          {/* Real content layer - overlaps skeleton in same grid area */}
          <div
            className="[grid-area:1/1] transition-opacity duration-500 opacity-0"
            data-content-layer
          >
            <Suspense fallback={null}>
              <AnimatedHotQuestionsGrid topics={topics} />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
}
