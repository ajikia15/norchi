import { Suspense } from "react";
import { loadStoriesData } from "../lib/storage";
import StoriesGrid from "./StoriesGrid";
import StoriesGridSkeleton from "./StoriesGridSkeleton";

// Add static generation to reduce server CPU
export const revalidate = 1800; // Revalidate every 30 minutes

async function getStoriesData() {
  const storiesData = await loadStoriesData();
  return Object.values(storiesData.stories);
}

export default async function StoriesPage() {
  const stories = await getStoriesData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight mb-4">
            რაში არ ეთანხმები გირჩს?
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            გირჩის საზოგადოებაში აზრთა სხვადასხვაობა ბუნებრივია — ლიდერებიც კი
            ყველაფერზე არ თანხმდებიან. მაგრამ ვცხოვრობთ ერთად, რადგან მთავარში
            ვთანხმდებით. რაც არ უნდა გეზიზღებოდეთ, დარწმუნებულები ვართ, რომ
            რაღაცაში დაგვეთანხმები. სცადე გზები, რომელიც ბევრმა გირჩელმა გაიარა.
          </p>
        </div>

        <Suspense fallback={<StoriesGridSkeleton />}>
          <StoriesGrid stories={stories} />
        </Suspense>
      </div>
    </div>
  );
}
