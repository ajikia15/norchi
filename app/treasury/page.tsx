import { loadVideosWithUpvoteStatus } from "../lib/storage";
import { getCurrentUser } from "../lib/auth-utils";
import TreasuryClient from "./TreasuryClient";

export default async function TreasuryPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  try {
    const user = await getCurrentUser();
    let currentPage = parseInt(
      Array.isArray(params.page) ? params.page[0] : params.page || "1",
      10
    );
    if (isNaN(currentPage) || currentPage < 1) {
      currentPage = 1;
    }

    // Load different types of videos for Treasury sections
    const [funResult, promisesResult, bestMomentsResult] = await Promise.all([
      loadVideosWithUpvoteStatus({
        page: 1,
        limit: 6,
        userId: user?.id,
        type: "roast",
      }),
      loadVideosWithUpvoteStatus({
        page: 1,
        limit: 6,
        userId: user?.id,
        type: "promise",
      }),
      loadVideosWithUpvoteStatus({
        page: 1,
        limit: 6,
        userId: user?.id,
        type: "best-moment",
      }),
    ]);

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <TreasuryClient
            fun={funResult.videos}
            promises={promisesResult.videos}
            bestMoments={bestMomentsResult.videos}
            userId={user?.id}
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Failed to load treasury content:", error);

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="py-12 text-center">
            <h1 className="mb-4 text-3xl font-bold text-gray-900">
              Treasury - თეზავრე
            </h1>
            <p className="text-lg text-red-500">
              კონტენტის ჩატვირთვა ვერ მოხერხდა.
            </p>
          </div>
        </div>
      </div>
    );
  }
}
