import VideoCardSkeleton from "./VideoCardSkeleton";

interface PromisesGridSkeletonProps {
  count?: number;
}

export default function PromisesGridSkeleton({
  count = 12,
}: PromisesGridSkeletonProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ვიდეო დაპირებები
          </h1>
          <p className="text-gray-600">
            გაეცანით ჩვენი პოლიტიკური დაპირებების ვიდეო კოლექციას
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: count }).map((_, index) => (
            <VideoCardSkeleton key={index} />
          ))}
        </div>

        {/* Pagination skeleton */}
        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-2">
            <div className="h-10 w-20 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-10 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-10 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-10 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-20 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
