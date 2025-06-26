"use client";

import { Skeleton } from "@/components/ui/skeleton";
import HotQuestionCardSkeleton from "./HotQuestionCardSkeleton";

interface CarouselSkeletonProps {
  cardsCount?: number;
}

export default function CarouselSkeleton({
  cardsCount = 3,
}: CarouselSkeletonProps) {
  return (
    <div className="w-full">
      {/* Mobile carousel skeleton */}
      <div className="overflow-hidden">
        <div className="flex">
          {Array.from({ length: cardsCount }).map((_, index) => (
            <div key={index} className="min-w-0 flex-[0_0_85%] pl-4">
              <HotQuestionCardSkeleton />
            </div>
          ))}
        </div>
      </div>

      {/* Carousel indicators skeleton */}
      <div className="mt-6 flex justify-center space-x-2">
        {Array.from({ length: cardsCount }).map((_, index) => (
          <Skeleton key={index} className="h-2 w-2 rounded-full" />
        ))}
      </div>
    </div>
  );
}
