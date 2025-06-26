"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function HotQuestionCardSkeleton() {
  return (
    <div className="relative h-[22rem] w-full">
      {/* Card skeleton with door-like structure */}
      <div className="absolute inset-0 rounded-lg border-2 border-gray-300 bg-white p-4 shadow-lg">
        {/* Door handle skeleton */}
        <Skeleton className="absolute left-2 bottom-[30%] h-8 w-2 rounded-r-md" />

        {/* Lightbulb area skeleton */}
        <div className="absolute top-16 left-1/2 -translate-x-1/2">
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>

        {/* Question title skeleton - centered */}
        <div className="flex h-full items-center justify-center">
          <div className="space-y-3 text-center">
            <Skeleton className="h-6 w-48 mx-auto" />
            <Skeleton className="h-6 w-32 mx-auto" />
          </div>
        </div>

        {/* Bottom tag skeleton */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}
