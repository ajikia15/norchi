import { Suspense } from "react";
import { notFound } from "next/navigation";
import { loadSingleStory } from "../../lib/storage";
import StoryClient from "./StoryClient";
import { cache } from "react";
import StoryLoadingSkeleton from "../../components/StoryLoadingSkeleton";

// Add static generation to reduce server CPU
export const revalidate = 1800; // Revalidate every 30 minutes

interface PageProps {
  params: Promise<{ id: string }>;
}

// Optimized function for individual story loading (reduces server CPU)
const getStory = cache(async (storyId: string) => {
  return await loadSingleStory(storyId);
});

async function StoryContent({ params }: PageProps) {
  const { id: storyId } = await params;

  // Load individual story instead of all stories
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
// Note: generateStaticParams removed to avoid loading all stories
// Dynamic pages will be generated on-demand with revalidation
