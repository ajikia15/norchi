import { Suspense } from "react";
import { Story } from "./types";
import { loadAllData } from "./lib/storage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Settings, BookOpen, Calendar } from "lucide-react";
import Link from "next/link";
import HotQuestionsClientSection from "./components/HotQuestionsClientSection";
import StoriesGridSkeleton from "./components/StoriesGridSkeleton";

// Optimized parallel data loading
async function getPageData() {
  return await loadAllData();
}

async function StoriesGrid({ stories }: { stories: Story[] }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getNodeCount = (story: Story) => {
    return Object.keys(story.flowData.nodes).length;
  };

  if (stories.length > 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {stories.map((story) => (
          <Card
            key={story.id}
            className="transition-all duration-200 hover:shadow-xl hover:scale-[1.02] border-2 border-gray-200/50 hover:border-primary/50 bg-white/80 backdrop-blur-sm"
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-xl leading-tight line-clamp-2 mb-3">
                    {story.name}
                  </CardTitle>
                  {story.description && (
                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                      {story.description}
                    </p>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="space-y-4">
                {/* Stats */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
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
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <BookOpen className="h-10 w-10 text-gray-400" />
        </div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-3">
          გზები არ არის ხელმისაწვდომი
        </h3>
        <p className="text-muted-foreground max-w-md mb-6 text-lg">
          ჯერ არ არის ლოგიკური გამოწვევის გზები. ეწვიეთ ადმინისტრატორის პანელს
          თქვენი პირველი გზის შესაქმნელად.
        </p>
        <Button asChild size="lg" className="shadow-sm">
          <Link href="/admin/story">
            <Settings className="h-4 w-4 " />
            შექმენით თქვენი პირველი გზა
          </Link>
        </Button>
      </div>
    );
  }
}

// Main page component with optimized data loading
export default async function HomePage() {
  // Load all data in parallel at the top level
  const { storiesData, hotTopicsData } = await getPageData();
  const stories = Object.values(storiesData.stories);
  const topics = Object.values(hotTopicsData.topics);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Hot Questions Section - now with pre-loaded data */}
      <HotQuestionsClientSection topics={topics} />

      {/* Stories section */}
      <div className="bg-white/60 backdrop-blur-sm border-b border-gray-200/30">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 tracking-tight mb-4">
              რაში არ ეთანხმები გირჩს?
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              გირჩის საზოგადოებაში აზრთა სხვადასხვაობა ბუნებრივია — ლიდერებიც კი
              ყველაფერზე არ თანხმდებიან. მაგრამ ვცხოვრობთ ერთად, რადგან მთავარში
              ვთანხმდებით. რაც არ უნდა გეზიზღებოდეთ, დარწმუნებულები ვართ, რომ
              რაღაცაში დაგვეთანხმები. სცადე გზები, რომელიც ბევრმა გირჩელმა
              გაიარა.
            </p>
          </div>
        </div>
      </div>

      {/* Story Grid - now with pre-loaded data */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <Suspense
          fallback={<StoriesGridSkeleton cardsCount={stories.length} />}
        >
          <StoriesGrid stories={stories} />
        </Suspense>
      </div>
    </div>
  );
}
