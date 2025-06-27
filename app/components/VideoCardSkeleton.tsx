import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUp, Share2 } from "lucide-react";

export default function VideoCardSkeleton() {
  return (
    <div className="relative mx-auto w-full overflow-hidden rounded-xl border shadow-sm">
      <div className="relative aspect-[9/16] w-full">
        {/* Main video area skeleton */}
        <Skeleton className="h-full w-full rounded-xl bg-gray-300" />

        {/* Title overlay skeleton */}
        <div className="absolute top-0 left-0 w-full z-10 px-4 py-6 flex items-start bg-gradient-to-b from-black/80 via-black/40 to-black/0">
          <div className="w-full space-y-2">
            <Skeleton className="h-4 w-full bg-white/30" />
            <Skeleton className="h-4 w-3/4 bg-white/30" />
          </div>
        </div>

        {/* Action buttons skeleton */}
        <div className="absolute right-0 top-24 z-20 flex flex-col items-end gap-0">
          {/* Upvote button skeleton */}
          <div className="group pointer-events-auto flex h-10 flex-row-reverse items-center justify-end gap-x-2 overflow-hidden rounded-l-lg bg-white pl-2 pr-2">
            <div className="animate-pulse bg-gray-300 h-4 w-16 rounded" />
            <ArrowUp className="h-5 w-5 shrink-0 text-gray-300" />
            <div className="animate-pulse bg-gray-300 h-3 w-4 rounded" />
          </div>

          {/* Share button skeleton */}
          <div className="pointer-events-auto flex h-10 w-10 items-center justify-center self-end rounded-r-none rounded-tl-none bg-white">
            <Share2 className="h-5 w-5 text-gray-300" />
          </div>
        </div>
      </div>
    </div>
  );
}
