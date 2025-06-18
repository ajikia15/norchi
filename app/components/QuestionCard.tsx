"use client";

import { QuestionNode } from "../types";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";

interface QuestionCardProps {
  node: QuestionNode;
  onAnswer: (nextNodeId: string) => void;
}

export default function QuestionCard({ node, onAnswer }: QuestionCardProps) {
  const mainOptions = node.options.slice(0, 2);
  const challengeOption = node.options[2];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 relative">
      {/* Main Question Card - Tinder Style */}
      <div className="relative flex items-center justify-center w-full max-w-6xl">
        {/* Left Button */}
        {mainOptions[0] && (
          <Button
            onClick={() => onAnswer(mainOptions[0].nextNodeId)}
            variant="outline"
            size="xl"
            className={cn(
              "absolute left-0 z-10 bg-white/90 backdrop-blur-sm",
              "shadow-lg hover:shadow-xl border-2 hover:border-primary",
              "transform hover:scale-105 transition-all duration-200",
              "min-w-[120px] md:min-w-[160px]",
              "text-sm md:text-base font-semibold"
            )}
          >
            {mainOptions[0].label}
          </Button>
        )}

        {/* Central Card */}
        <Card
          className={cn(
            "w-full max-w-sm md:max-w-md lg:max-w-lg",
            "mx-auto bg-gradient-to-b from-white to-gray-50/80",
            "shadow-2xl border-0 rounded-3xl",
            "animate-in slide-in-from-bottom-4 duration-500",
            "backdrop-blur-sm"
          )}
        >
          <CardContent className="p-8 md:p-12 text-center">
            <h1
              className={cn(
                "text-2xl md:text-3xl lg:text-4xl font-bold",
                "text-gray-900 leading-tight mb-6",
                "tracking-tight"
              )}
            >
              {node.text}
            </h1>

            {/* Visual emphasis */}
            <div className="w-16 h-1 bg-gradient-to-r from-primary to-primary/60 rounded-full mx-auto" />
          </CardContent>
        </Card>

        {/* Right Button */}
        {mainOptions[1] && (
          <Button
            onClick={() => onAnswer(mainOptions[1].nextNodeId)}
            variant="default"
            size="xl"
            className={cn(
              "absolute right-0 z-10",
              "shadow-lg hover:shadow-xl",
              "transform hover:scale-105 transition-all duration-200",
              "min-w-[120px] md:min-w-[160px]",
              "text-sm md:text-base font-semibold"
            )}
          >
            {mainOptions[1].label}
          </Button>
        )}
      </div>

      {/* Challenge Option - Below Card */}
      {challengeOption && (
        <div className="mt-8 animate-in slide-in-from-bottom-6 duration-700">
          <Button
            onClick={() => onAnswer(challengeOption.nextNodeId)}
            variant="destructive"
            size="lg"
            className={cn(
              "shadow-lg hover:shadow-xl",
              "transform hover:scale-105 transition-all duration-200",
              "rounded-2xl px-8 py-3",
              "text-base font-semibold"
            )}
          >
            {challengeOption.label}
          </Button>
        </div>
      )}

      {/* Mobile Layout Hint */}
      <div className="hidden sm:block absolute bottom-8 text-center text-muted-foreground text-sm">
        Choose your path wisely
      </div>
    </div>
  );
}
