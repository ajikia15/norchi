import { Suspense } from "react";
import { loadVideosWithUpvoteStatus } from "../lib/storage";
import { getCurrentUser } from "../lib/auth-utils";
import TreasuryClient from "./TreasuryClient";
import TreasuryLoadingSkeleton from "./TreasuryLoadingSkeleton";

async function TreasuryContent({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
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
    <TreasuryClient
      fun={funResult.videos}
      promises={promisesResult.videos}
      bestMoments={bestMomentsResult.videos}
      userId={user?.id}
    />
  );
}

export default async function TreasuryPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<TreasuryLoadingSkeleton />}>
          <TreasuryContent searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
