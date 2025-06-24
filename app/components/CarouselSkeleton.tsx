"use client";

import { Skeleton } from "@/components/ui/skeleton";

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
              <div className="relative h-[22rem] w-full">
                {/* Card skeleton with door-like structure */}
                <div className="absolute inset-0 rounded-lg border-2 border-gray-300 bg-white p-4 shadow-lg">
                  {/* Door handle skeleton */}
                  <Skeleton className="absolute left-2 top-1/2 h-8 w-2 -translate-y-1/2 rounded-r-md" />

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
