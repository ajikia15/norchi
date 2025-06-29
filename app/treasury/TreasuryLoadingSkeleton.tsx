import { Skeleton } from "@/components/ui/skeleton";
import VideoSliderSkeleton from "./VideoSliderSkeleton";

export default function TreasuryLoadingSkeleton() {
  return (
    <div className="space-y-12">
      {/* Page Header Skeleton */}
      <div className="text-center">
        <Skeleton className="mx-auto mb-2 h-10 w-48" />
        <Skeleton className="mx-auto h-6 w-80" />
      </div>

      {/* Promises Section Skeleton */}
      <section>
        <VideoSliderSkeleton cardAspectRatio="aspect-[9/16]" />
      </section>

      {/* Best Moments Section Skeleton */}
      <section>
        <VideoSliderSkeleton cardAspectRatio="aspect-[16/9]" />
      </section>
    </div>
  );
}
