import { Suspense } from "react";
import { notFound } from "next/navigation";
import { loadSingleStory } from "@/app/lib/storage";
import StoryEditClient from "./StoryEditClient";
import StoryLoadingSkeleton from "@/app/components/StoryLoadingSkeleton";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function StoryEditContent({ params }: PageProps) {
  const { id: storyId } = await params;

  // Load individual story instead of all stories (reduces server CPU)
  const story = await loadSingleStory(storyId);

  // Check if story exists
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
