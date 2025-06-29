import VideoCardSkeleton from "@/app/components/VideoCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function VideoSliderSkeleton({
  cardAspectRatio,
}: {
  cardAspectRatio?: string;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-1/3" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-20" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="basis-[280px] flex-none md:basis-[300px] lg:basis-[320px]">
          <VideoCardSkeleton aspectRatio={cardAspectRatio} />
        </div>
        <div className="hidden basis-[280px] flex-none md:block md:basis-[300px] lg:basis-[320px]">
          <VideoCardSkeleton aspectRatio={cardAspectRatio} />
        </div>
        <div className="hidden basis-[280px] flex-none lg:block lg:basis-[320px]">
          <VideoCardSkeleton aspectRatio={cardAspectRatio} />
        </div>
        <div className="hidden basis-[280px] flex-none lg:block lg:basis-[320px]">
          <VideoCardSkeleton aspectRatio={cardAspectRatio} />
        </div>
      </div>
    </div>
  );
}
