import VideoCardSkeleton from "./VideoCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

interface PromisesClientSkeletonProps {
  count?: number;
}

export default function PromisesClientSkeleton({
  count = 12,
}: PromisesClientSkeletonProps) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: count }).map((_, index) => (
          <VideoCardSkeleton key={index} />
        ))}
      </div>

      {/* Pagination skeleton */}
      <div className="mt-8 flex justify-center">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-20" />
        </div>
      </div>

      {/* Total count skeleton */}
      <div className="mt-8 text-center">
        <Skeleton className="h-4 w-48 mx-auto" />
      </div>
    </>
  );
}
