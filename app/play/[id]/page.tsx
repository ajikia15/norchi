"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Story, Node } from "../../types";
import {
  loadStoriesData,
  getDefaultStoriesData,
  migrateLegacyData,
} from "../../lib/storage";
import GameCard from "../../components/GameCard";
import { Button } from "../../components/ui/button";
import { ArrowLeft, RotateCcw } from "lucide-react";

export default function PlayPage() {
  const params = useParams();
  const router = useRouter();
  const storyId = params.id as string;

  const [story, setStory] = useState<Story | null>(null);
  const [currentNodeId, setCurrentNodeId] = useState<string>("");
  const [history, setHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    console.log("PlayPage: Loading story with ID:", storyId);

    // Load stories data
    const storiesData =
      loadStoriesData() || migrateLegacyData() || getDefaultStoriesData();

    if (!storiesData) {
      console.error("PlayPage: No stories data found");
      router.push("/");
      return;
    }

    // Find the story
    const foundStory = storiesData.stories[storyId];

    if (!foundStory) {
      console.error("PlayPage: Story not found with ID:", storyId);
      alert(`Story not found: ${storyId}`);
      router.push("/");
      return;
    }

    setStory(foundStory);
    setCurrentNodeId(foundStory.flowData.startNodeId);
    setHistory([foundStory.flowData.startNodeId]);
    setIsLoading(false);
  }, [storyId, router]);

  const getCurrentNode = (): Node | null => {
    if (!story || !currentNodeId) return null;
    return story.flowData.nodes[currentNodeId] || null;
  };

  const handleAnswer = (nextNodeId: string, isChallenge: boolean = false) => {
    if (isTransitioning) return;

    setIsTransitioning(true);

    // If it's a challenge answer (returnToNodeId), don't add to history
    if (isChallenge) {
      setTimeout(() => {
        setCurrentNodeId(nextNodeId);
        setIsTransitioning(false);
      }, 300);
    } else {
      // Add current node to history before moving
      setTimeout(() => {
        setCurrentNodeId(nextNodeId);
        setHistory((prev) => [...prev, nextNodeId]);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const handleRestart = () => {
    if (!story) return;
    setCurrentNodeId(story.flowData.startNodeId);
    setHistory([story.flowData.startNodeId]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-2xl font-semibold text-gray-600 animate-pulse">
          Loading story...
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-8">
        <div className="bg-red-100 border-2 border-red-300 text-red-800 px-6 py-4 rounded-2xl text-center max-w-md">
          <h2 className="text-xl font-bold mb-2">Story Not Found</h2>
          <p className="mb-4">
            The story you&apos;re trying to play doesn&apos;t exist.
          </p>
          <Button onClick={() => router.push("/")} variant="outline">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const currentNode = getCurrentNode();

  if (!currentNode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-8">
        <div className="bg-red-100 border-2 border-red-300 text-red-800 px-6 py-4 rounded-2xl text-center max-w-md">
          <h2 className="text-xl font-bold mb-2">Node Not Found</h2>
          <p className="mb-4">
            There&apos;s an issue with the story structure.
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => router.push("/")} variant="outline">
              Back to Home
            </Button>
            <Button onClick={handleRestart}>Restart Story</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 fixed top-0 left-0 right-0 z-20">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Button
                onClick={() => router.push("/")}
                variant="ghost"
                size="sm"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">
                {story.name}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                Step {history.length}
              </span>
              <Button onClick={handleRestart} variant="outline" size="sm">
                <RotateCcw className="h-4 w-4 mr-2" />
                Restart
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="pt-20 min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
        <GameCard
          node={currentNode}
          onAnswer={handleAnswer}
          isTransitioning={isTransitioning}
        />
      </div>
    </div>
  );
}
