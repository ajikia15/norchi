"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PlayerState, StoriesData, Node } from "../../types";
import {
  loadStoriesData,
  getDefaultStoriesData,
  migrateLegacyData,
} from "../../lib/storage";
import GameCard from "../../components/GameCard";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { cn } from "../../lib/utils";
import { ArrowLeft, Settings } from "lucide-react";

export default function StoryPage() {
  const params = useParams();
  const router = useRouter();
  const storyId = params.id as string;

  const [storiesData, setStoriesData] = useState<StoriesData | null>(null);
  const [playerState, setPlayerState] = useState<PlayerState | null>(null);
  const [loopAnimation, setLoopAnimation] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("StoryPage: Loading story with ID:", storyId);

    // Load stories data
    const loaded =
      loadStoriesData() || migrateLegacyData() || getDefaultStoriesData();
    console.log("StoryPage: Loaded stories data:", loaded);

    if (!loaded) {
      console.error("StoryPage: No stories data found");
      router.push("/");
      return;
    }

    // Check if story exists
    const story = loaded.stories[storyId];
    console.log("StoryPage: Found story:", story);

    if (!story) {
      console.error("StoryPage: Story not found with ID:", storyId);
      console.log("StoryPage: Available stories:", Object.keys(loaded.stories));
      alert(`Story not found: ${storyId}`);
      router.push("/");
      return;
    }

    setStoriesData(loaded);

    // Initialize player state with this story
    if (story.flowData && story.flowData.startNodeId) {
      console.log(
        "StoryPage: Setting player state with start node:",
        story.flowData.startNodeId
      );
      setPlayerState({
        currentNodeId: story.flowData.startNodeId,
        history: [],
      });
    } else {
      console.error("StoryPage: Story has no valid flow data or start node");
      alert(
        "This story has no content yet. Please set it up in the admin panel."
      );
      router.push("/admin");
      return;
    }

    setIsLoading(false);
  }, [storyId, router]);

  const currentStory = storiesData?.stories[storyId];
  const flowData = currentStory?.flowData;

  const handleAnswer = (nextNodeId: string, isChallenge: boolean = false) => {
    if (!flowData || !playerState) return;

    // Check if this is a loop (staying on same node) or challenge
    if (nextNodeId === playerState.currentNodeId || isChallenge) {
      setLoopAnimation(true);
      setTimeout(() => setLoopAnimation(false), 500);

      if (isChallenge) {
        setPlayerState({
          currentNodeId: nextNodeId,
          history: playerState.history, // Don't add to history for challenges
        });
      }
      return;
    }

    // Move to next node
    setPlayerState({
      currentNodeId: nextNodeId,
      history: [...playerState.history, playerState.currentNodeId],
    });
  };

  const handleRestart = () => {
    if (!flowData) return;

    setPlayerState({
      currentNodeId: flowData.startNodeId,
      history: [],
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="text-2xl font-semibold text-gray-600 animate-pulse">
          Loading your journey...
        </div>
      </div>
    );
  }

  if (!storiesData || !currentStory || !flowData || !playerState) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-br from-red-50 to-red-100">
        <div className="bg-red-100 border-2 border-red-300 text-red-800 px-6 py-4 rounded-2xl mb-6 text-center max-w-md">
          <h2 className="text-xl font-bold mb-2">Story Not Found</h2>
          <p className="mb-4">
            The story you&apos;re looking for doesn&apos;t exist or has no
            content.
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => router.push("/")} variant="outline">
              Back to Stories
            </Button>
            <Button onClick={() => router.push("/admin")}>Admin Panel</Button>
          </div>
        </div>
      </div>
    );
  }

  const currentNode: Node = flowData.nodes[playerState.currentNodeId];

  if (!currentNode) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-br from-red-50 to-red-100">
        <div className="bg-red-100 border-2 border-red-300 text-red-800 px-6 py-4 rounded-2xl mb-6 text-center">
          <h2 className="text-xl font-bold mb-2">Oops! Path Not Found</h2>
          <p>Node ID: {playerState.currentNodeId}</p>
        </div>
        <Button
          onClick={handleRestart}
          variant="destructive"
          size="lg"
          className="rounded-2xl"
        >
          Return to Start
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "min-h-screen",
        "transition-all duration-500",
        loopAnimation && "animate-pulse"
      )}
    >
      {/* Fixed UI Elements - Made more subtle */}
      <div className="fixed inset-x-0 top-0 z-50 flex items-center justify-between p-4 bg-black/10 backdrop-blur-sm">
        {/* Progress indicator with story name */}
        <div className="flex items-center gap-3">
          <Badge
            variant="secondary"
            className="bg-white/90 backdrop-blur-sm shadow-lg px-4 py-2 text-sm font-medium"
          >
            Step {playerState.history.length + 1}
          </Badge>
          <Badge
            variant="outline"
            className="bg-white/80 backdrop-blur-sm shadow-sm px-3 py-1 text-xs text-muted-foreground"
          >
            {currentStory.name}
          </Badge>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center gap-2">
          <Button
            onClick={() => router.push("/")}
            variant="outline"
            size="sm"
            className="bg-white/90 backdrop-blur-sm shadow-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Stories
          </Button>
          <Button
            onClick={() => router.push("/admin")}
            variant="outline"
            size="sm"
            className="bg-white/90 backdrop-blur-sm shadow-sm"
          >
            <Settings className="h-4 w-4 mr-2" />
            Admin
          </Button>
        </div>
      </div>

      {/* Story content area - Remove constraining padding */}
      <div
        className={cn(
          "transition-all duration-300",
          loopAnimation && "scale-105"
        )}
      >
        <GameCard
          node={currentNode}
          onAnswer={handleAnswer}
          isTransitioning={loopAnimation}
        />
      </div>
    </div>
  );
}
