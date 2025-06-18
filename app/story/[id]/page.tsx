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
import StoryProgressBar from "../../components/StoryProgressBar";
import { Button } from "../../components/ui/button";
import { cn } from "../../lib/utils";

export default function StoryPage() {
  const params = useParams();
  const router = useRouter();
  const storyId = params.id as string;

  const [storiesData, setStoriesData] = useState<StoriesData | null>(null);
  const [playerState, setPlayerState] = useState<PlayerState | null>(null);
  const [loopAnimation, setLoopAnimation] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Calculate actual story progress - only count unique question nodes visited
  const calculateCurrentProgress = (): number => {
    if (!playerState || !currentStory?.flowData?.nodes) return 0;

    // Get all unique question nodes visited (from history + current)
    const allVisited = [...playerState.history, playerState.currentNodeId];
    const uniqueQuestionNodes = new Set(
      allVisited.filter((nodeId) => {
        const node = currentStory.flowData.nodes[nodeId];
        return node?.type === "question";
      })
    );

    return uniqueQuestionNodes.size;
  };

  // Calculate total question nodes in story (actual progression steps)
  const calculateTotalSteps = (
    story: StoriesData["stories"][string]
  ): number => {
    if (!story?.flowData?.nodes) return 0;
    const nodes = Object.values(story.flowData.nodes);
    // Only count question nodes as real progression
    return nodes.filter((node: Node) => node.type === "question").length;
  };

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
        "min-h-screen transition-all duration-500",
        loopAnimation && "animate-pulse"
      )}
    >
      {/* Header with Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              {currentStory.name}
            </h1>
            <Button onClick={handleRestart} variant="outline" size="sm">
              Restart
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <StoryProgressBar
          currentStep={calculateCurrentProgress()}
          totalSteps={calculateTotalSteps(currentStory)}
          currentNodeType={currentNode.type}
        />
      </div>

      {/* Story content area */}
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
