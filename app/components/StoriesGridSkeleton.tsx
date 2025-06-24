"use client";

import { Skeleton } from "@/components/ui/skeleton";

interface StoriesGridSkeletonProps {
  cardsCount?: number;
}

export default function StoriesGridSkeleton({
  cardsCount = 6,
}: StoriesGridSkeletonProps) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: cardsCount }).map((_, index) => (
          <div key={index} className="group">
            {/* Card skeleton */}
            <div className="relative overflow-hidden rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md">
              {/* Header skeleton */}
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-5 w-24 rounded-full" />
              </div>

              {/* Title skeleton */}
              <div className="space-y-2 mb-4">
                <Skeleton className="h-7 w-full" />
                <Skeleton className="h-7 w-3/4" />
              </div>

              {/* Description skeleton */}
              <div className="space-y-2 mb-6">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/5" />
              </div>

              {/* Button skeleton */}
              <Skeleton className="h-9 w-full rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
