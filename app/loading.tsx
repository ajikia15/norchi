import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Hot Questions skeleton section */}
      <section className="py-12 bg-gradient-to-br from-gray-50/50 to-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <Skeleton className="h-6 w-48 mx-auto mb-12" />

          {/* Mobile-first responsive skeleton grid */}
          <div className="block md:hidden">
            {/* Mobile carousel skeleton */}
            <div className="overflow-hidden">
              <div className="flex">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="min-w-0 flex-[0_0_85%] pl-4">
                    <div className="relative h-[22rem] w-full">
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
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6 flex justify-center space-x-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-2 w-2 rounded-full" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main content skeleton */}
      <div className="bg-white/60 backdrop-blur-sm border-b border-gray-200/30">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center space-y-4">
            <Skeleton className="h-12 w-96 mx-auto" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-full max-w-2xl mx-auto" />
              <Skeleton className="h-5 w-3/4 max-w-2xl mx-auto" />
              <Skeleton className="h-5 w-5/6 max-w-2xl mx-auto" />
            </div>
          </div>
        </div>
      </div>

      {/* Stories grid skeleton */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="group">
              <div className="relative overflow-hidden rounded-xl border bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-5 w-24 rounded-full" />
                </div>
                <div className="space-y-2 mb-4">
                  <Skeleton className="h-7 w-full" />
                  <Skeleton className="h-7 w-3/4" />
                </div>
                <div className="space-y-2 mb-6">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
                <Skeleton className="h-9 w-full rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
