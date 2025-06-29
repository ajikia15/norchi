import { Suspense } from "react";
import { Story } from "./types";
import { loadStoriesData, loadHotTopics } from "./lib/storage";
import { getCurrentUser } from "./lib/auth-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Settings, BookOpen, Calendar } from "lucide-react";
import Link from "next/link";
import HeroSection from "./components/HeroSection";
import StoriesGridSkeleton from "./components/StoriesGridSkeleton";
import HotQuestionsClientSection from "./components/HotQuestionsClientSection";

// Add static generation to reduce server CPU
export const revalidate = 1800; // Revalidate every 30 minutes

// Optimized parallel data loading for homepage
async function getPageData() {
  const [storiesData, user] = await Promise.all([
    loadStoriesData(),
    getCurrentUser(),
  ]);

  // Load hot topics with user context to prevent N+1 queries
  const hotTopicsResult = await loadHotTopics({
    page: 1,
    limit: 8,
    userId: user?.id, // Pass userId to batch-load saved status
  });

  return {
    storiesData,
    topics: hotTopicsResult.topics,
    user,
  };
}

async function StoriesGrid({ stories }: { stories: Story[] }) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${day}/${month}/${year}`;
  };

  const getNodeCount = (story: Story) => {
    return Object.keys(story.flowData.nodes).length;
  };

  if (stories.length > 0) {
    return (
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {stories.map((story) => (
          <Card
            key={story.id}
            className="hover:border-primary/50 border-2 border-gray-200/50 bg-white/80 backdrop-blur-sm transition-all duration-200 hover:shadow-xl"
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <CardTitle className="mb-3 line-clamp-2 text-xl leading-tight">
                    {story.name}
                  </CardTitle>
                  {story.description && (
                    <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
                      {story.description}
                    </p>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="space-y-4">
                {/* Stats */}
                <div className="text-muted-foreground flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    <span>{getNodeCount(story)} გამოწვევა</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(story.updatedAt)}</span>
                  </div>
                </div>

                {/* Play Button */}
                <Button asChild className="w-full shadow-sm" size="lg">
                  <Link href={`/story/${story.id}`}>
                    <Play className="h-4 w-4" />
                    დაიწყე გზა
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  } else {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
          <BookOpen className="h-10 w-10 text-gray-400" />
        </div>
        <h3 className="mb-3 text-2xl font-semibold text-gray-900">
          გზები არ არის ხელმისაწვდომი
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md text-lg">
          ჯერ არ არის ლოგიკური გამოწვევის გზები. ეწვიეთ ადმინისტრატორის პანელს
          თქვენი პირველი გზის შესაქმნელად.
        </p>
        <Button asChild size="lg" className="shadow-sm">
          <Link href="/admin/story">
            <Settings className="h-4 w-4" />
            შექმენით თქვენი პირველი გზა
          </Link>
        </Button>
      </div>
    );
  }
}

// Main page component with optimized data loading
export default async function HomePage() {
  // Load optimized data for homepage
  const { storiesData, topics, user } = await getPageData();
  const stories = Object.values(storiesData.stories);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <HeroSection />

      <div id="hot-questions">
        <HotQuestionsClientSection topics={topics} user={user} />
      </div>

      {/* Stories section */}
      <div id="stories">
        <div className="border-b border-gray-200/30 bg-white/60 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-6 py-12">
            <div className="text-center">
              <h1 className="mb-4 text-5xl font-bold tracking-tight text-gray-900">
                რაში არ ეთანხმები გირჩს?
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-gray-600">
                გირჩის საზოგადოებაში აზრთა სხვადასხვაობა ბუნებრივია — ლიდერებიც
                კი ყველაფერზე არ თანხმდებიან. მაგრამ ვცხოვრობთ ერთად, რადგან
                მთავარში ვთანხმდებით. რაც არ უნდა გეზიზღებოდეთ, დარწმუნებულები
                ვართ, რომ რაღაცაში დაგვეთანხმები. სცადე გზები, რომელიც ბევრმა
                გირჩელმა გაიარა.
              </p>
            </div>
          </div>
        </div>

        {/* Story Grid - now with pre-loaded data */}
        <div className="mx-auto max-w-7xl px-6 py-12">
          <Suspense
            fallback={<StoriesGridSkeleton cardsCount={stories.length} />}
          >
            <StoriesGrid stories={stories} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
