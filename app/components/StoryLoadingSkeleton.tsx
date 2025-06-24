"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function StoryLoadingSkeleton() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-md mx-auto px-6">
        <div className="text-center space-y-6">
          {/* Animated logo/spinner skeleton */}
          <div className="relative mx-auto">
            <Skeleton className="w-16 h-16 rounded-full mx-auto animate-pulse" />
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-primary/20 rounded-full animate-ping mx-auto"></div>
          </div>

          {/* Loading text skeleton */}
          <div className="space-y-3">
            <Skeleton className="h-8 w-64 mx-auto" />
            <Skeleton className="h-5 w-80 mx-auto" />
          </div>

          {/* Progress indicator skeleton */}
          <div className="w-64 mx-auto">
            <Skeleton className="h-1 w-full rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
