import { Skeleton } from "@/components/ui/skeleton";

export default function VideoCardSkeleton({
  aspectRatio = "aspect-[16/9]",
}: {
  aspectRatio?: string;
}) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-sm">
      <Skeleton className={`relative w-full ${aspectRatio}`} />
      <div className="flex flex-1 flex-col p-4">
        <Skeleton className="mb-3 h-5 w-5/6" />
        <Skeleton className="h-5 w-3/4" />
        <div className="mt-auto flex items-center justify-between pt-4">
          <Skeleton className="h-8 w-24 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
