import { Suspense } from "react";
import { notFound } from "next/navigation";
import { loadStoriesData } from "../../lib/storage";
import StoryClient from "./StoryClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function StoryContent({ params }: PageProps) {
  const { id: storyId } = await params;

  // Load data server-side
  const storiesData = await loadStoriesData();

  // Check if story exists
  const story = storiesData.stories[storyId];
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
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-white">
          <div className="text-2xl font-semibold text-gray-600 animate-pulse">
            გზის ჩატვირთვა...
          </div>
        </div>
      }
    >
      <StoryContent params={params} />
    </Suspense>
  );
}
