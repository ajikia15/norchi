"use client";

import { Skeleton } from "@/components/ui/skeleton";
import HotQuestionCardSkeleton from "../components/HotQuestionCardSkeleton";

export default function HotQuestionsGridSkeleton() {
  return (
    <>
      {/* Grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 12 }).map((_, index) => (
          <HotQuestionCardSkeleton key={index} />
        ))}
      </div>

      {/* Pagination skeleton */}
      <div className="flex items-center justify-center space-x-2">
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-10" />
      </div>
    </>
  );
}
