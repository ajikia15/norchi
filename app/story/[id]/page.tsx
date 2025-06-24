import { Suspense } from "react";
import { notFound } from "next/navigation";
import { loadStoriesData } from "../../lib/storage";
import StoryClient from "./StoryClient";
import { cache } from "react";
import StoryLoadingSkeleton from "../../components/StoryLoadingSkeleton";

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

export default function StoryPage({ params }: PageProps) {
  return (
    <Suspense fallback={<StoryLoadingSkeleton />}>
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
