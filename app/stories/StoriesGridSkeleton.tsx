"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function StoriesGridSkeleton() {
  return (
    <>
      {/* Grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        {Array.from({ length: 9 }).map((_, index) => (
          <div
            key={index}
            className="border-2 border-gray-200 rounded-lg bg-white p-6"
          >
            <div className="space-y-4">
              {/* Title */}
              <Skeleton className="h-6 w-3/4" />

              {/* Description */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 pt-2">
                <div className="flex items-center gap-1">
                  <Skeleton className="h-3 w-3 rounded" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <div className="flex items-center gap-1">
                  <Skeleton className="h-3 w-3 rounded" />
                  <Skeleton className="h-3 w-12" />
                </div>
              </div>

              {/* Button */}
              <Skeleton className="h-10 w-full rounded" />
            </div>
          </div>
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
