import { loadVideoPromisesWithUpvoteStatus } from "../lib/storage";
import { getCurrentUser } from "../lib/auth-utils";
import PromisesClient from "./PromisesClient";

interface PromisesPageProps {
  searchParams: {
    page?: string;
  };
}

export default async function PromisesPage({
  searchParams,
}: PromisesPageProps) {
  try {
    const user = await getCurrentUser();
    let currentPage = parseInt(searchParams.page || "1", 10);
    if (isNaN(currentPage) || currentPage < 1) {
      currentPage = 1;
    }
    const videoPromisesResult = await loadVideoPromisesWithUpvoteStatus({
      page: currentPage,
      limit: 12,
      userId: user?.id,
    });

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

          <PromisesClient
            videoPromises={videoPromisesResult.videoPromises}
            upvotedPromises={videoPromisesResult.upvotedPromises}
            userId={user?.id}
            pagination={videoPromisesResult.pagination}
          />

          {/* Show total count */}
          {videoPromisesResult.pagination.totalItems > 0 && (
            <div className="mt-8 text-center text-sm text-gray-500">
              სულ {videoPromisesResult.pagination.totalItems} ვიდეო დაპირება
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Failed to load video promises:", error);

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

          <div className="text-center py-12">
            <p className="text-red-500 text-lg">
              ვიდეო დაპირებების ჩატვირთვა ვერ მოხერხდა.
            </p>
          </div>
        </div>
      </div>
    );
  }
}
