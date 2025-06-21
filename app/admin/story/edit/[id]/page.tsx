import { Suspense } from "react";
import { notFound } from "next/navigation";
import { loadStoriesData } from "@/app/lib/storage";
import StoryEditClient from "./StoryEditClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function StoryEditContent({ params }: PageProps) {
  const { id: storyId } = await params;

  // Load data server-side
  const storiesData = await loadStoriesData();

  // Check if story exists
  const story = storiesData.stories[storyId];
  if (!story) {
    notFound();
  }

  return <StoryEditClient storyId={storyId} initialStory={story} />;
}

export default function StoryEditPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-white">
          <div className="text-2xl font-semibold text-gray-600 animate-pulse">
            Loading story editor...
          </div>
        </div>
      }
    >
      <StoryEditContent params={params} />
    </Suspense>
  );
}
