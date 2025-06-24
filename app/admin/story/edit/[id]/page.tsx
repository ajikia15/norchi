import { Suspense } from "react";
import { notFound } from "next/navigation";
import { loadStoriesData } from "@/app/lib/storage";
import StoryEditClient from "./StoryEditClient";
import StoryLoadingSkeleton from "@/app/components/StoryLoadingSkeleton";

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
    <Suspense fallback={<StoryLoadingSkeleton />}>
      <StoryEditContent params={params} />
    </Suspense>
  );
}
