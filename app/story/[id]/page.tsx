import { Suspense } from "react";
import { notFound } from "next/navigation";
import { loadStoriesData } from "../../lib/storage";
import StoryClient from "./StoryClient";
import { cache } from "react";

interface PageProps {
  params: Promise<{ id: string }>;
}

// Cached function for individual story loading
const getStory = cache(async (storyId: string) => {
  const storiesData = await loadStoriesData();
  return storiesData.stories[storyId];
});

async function StoryContent({ params }: PageProps) {
  const { id: storyId } = await params;

  // Load data server-side with caching
  const story = await getStory(storyId);

  // Check if story exists
  if (!story) {
    notFound();
  }

  // Check if story has valid flow data
  if (!story.flowData || !story.flowData.startNodeId) {
    notFound();
  }

  return <StoryClient storyId={storyId} story={story} />;
}

function StoryLoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="text-center space-y-6">
        {/* Animated logo or spinner */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-primary rounded-full animate-spin mx-auto"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-primary/20 rounded-full animate-ping mx-auto"></div>
        </div>

        {/* Loading text */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-gray-900 animate-pulse">
            გზის ჩატვირთვა...
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            მომზადება იდეოლოგიური გამოწვევისთვის
          </p>
        </div>

        {/* Progress indicator */}
        <div className="w-64 h-1 bg-gray-200 rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-primary rounded-full animate-pulse w-2/3"></div>
        </div>
      </div>
    </div>
  );
}

export default function StoryPage({ params }: PageProps) {
  return (
    <Suspense fallback={<StoryLoadingFallback />}>
      <StoryContent params={params} />
    </Suspense>
  );
}

// Generate static params for better performance
export async function generateStaticParams() {
  try {
    const storiesData = await loadStoriesData();
    const stories = Object.values(storiesData.stories);

    return stories.map((story) => ({
      id: story.id,
    }));
  } catch (error) {
    console.error("Error generating static params for stories:", error);
    return [];
  }
}
