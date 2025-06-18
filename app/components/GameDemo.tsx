"use client";

import { useState } from "react";
import { Node } from "../types";
import GameCard from "./GameCard";
import GameCardAnimated from "./GameCardAnimated";
import { Button } from "./ui/button";
import { Sparkles, Zap } from "lucide-react";

interface GameDemoProps {
  node: Node;
  onAnswer: (nextNodeId: string, isChallenge?: boolean) => void;
  isTransitioning: boolean;
  nodeHistory: string[];
}

export default function GameDemo({
  node,
  onAnswer,
  isTransitioning,
  nodeHistory,
}: GameDemoProps) {
  const [useAnimated, setUseAnimated] = useState(true);

  return (
    <div className="relative">
      {/* Mode Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-2 shadow-lg border">
          <div className="flex gap-2">
            <Button
              onClick={() => setUseAnimated(false)}
              variant={!useAnimated ? "default" : "outline"}
              size="sm"
              className="rounded-xl"
            >
              <Zap className="h-4 w-4 mr-2" />
              Simple
            </Button>
            <Button
              onClick={() => setUseAnimated(true)}
              variant={useAnimated ? "default" : "outline"}
              size="sm"
              className="rounded-xl"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Enhanced
            </Button>
          </div>
        </div>
      </div>

      {/* Game Card */}
      {useAnimated ? (
        <GameCardAnimated
          node={node}
          onAnswer={onAnswer}
          isTransitioning={isTransitioning}
          nodeHistory={nodeHistory}
        />
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
          <GameCard
            node={node}
            onAnswer={onAnswer}
            isTransitioning={isTransitioning}
          />
        </div>
      )}
    </div>
  );
}
