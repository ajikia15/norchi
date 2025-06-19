"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { PlayerState, StoriesData, Node } from "../../types";
import {
  loadStoriesData,
  getDefaultStoriesData,
  migrateLegacyData,
} from "../../lib/storage";
import GameCard from "../../components/GameCard";

export default function StoryPage() {
  const params = useParams();
  const router = useRouter();
  const storyId = params.id as string;

  const [storiesData, setStoriesData] = useState<StoriesData | null>(null);
  const [playerState, setPlayerState] = useState<PlayerState | null>(null);
  const [loopAnimation, setLoopAnimation] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cardKey, setCardKey] = useState(0); // For forcing card re-mount

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

    // Move to next node and increment card key for animation
    setCardKey((prev) => prev + 1);
    setPlayerState({
      currentNodeId: nextNodeId,
      history: [...playerState.history, playerState.currentNodeId],
    });
  };

  if (isLoading) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="text-center space-y-4"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="text-3xl font-bold text-gray-800 mb-2">
            Loading your journey...
          </div>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mx-auto animate-pulse" />
        </motion.div>
      </motion.div>
    );
  }

  if (!storiesData || !currentStory || !flowData || !playerState) {
    router.push("/");
    return null;
  }

  const currentNode: Node = flowData.nodes[playerState.currentNodeId];

  if (!currentNode) {
    router.push("/");
    return null;
  }

  return (
    <GameCard
      key={`gamecard-${playerState.currentNodeId}-${cardKey}`}
      node={currentNode}
      onAnswer={handleAnswer}
      isTransitioning={loopAnimation}
      currentStep={calculateCurrentProgress()}
      totalSteps={calculateTotalSteps(currentStory)}
    />
  );
}
