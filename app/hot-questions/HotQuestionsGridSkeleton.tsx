"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function HotQuestionsGridSkeleton() {
  return (
    <>
      {/* Grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="relative h-[22rem] w-full">
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
