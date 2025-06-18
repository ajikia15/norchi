"use client";

import { InfocardNode } from "../types";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { cn } from "../lib/utils";

interface InfoCardProps {
  node: InfocardNode;
  onContinue: (nextNodeId: string) => void;
}

export default function InfoCard({ node, onContinue }: InfoCardProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card
        className={cn(
          "w-full max-w-lg mx-auto",
          "bg-gradient-to-br from-white via-blue-50/20 to-cyan-50/30",
          "shadow-2xl border-0 rounded-3xl",
          "animate-in slide-in-from-bottom-4 duration-500"
        )}
      >
        <CardHeader className="text-center pb-4">
          <Badge
            variant="info"
            className="mx-auto mb-4 px-4 py-2 text-base font-semibold"
          >
            💡 Information
          </Badge>
        </CardHeader>

        <CardContent className="p-8 pt-0 text-center">
          <h1
            className={cn(
              "text-3xl md:text-4xl font-bold",
              "text-gray-900 leading-tight mb-8",
              "tracking-tight"
            )}
          >
            Good to Know
          </h1>

          <p
            className={cn(
              "text-lg md:text-xl text-gray-700",
              "leading-relaxed mb-10 max-w-md mx-auto"
            )}
          >
            {node.text}
          </p>

          {/* Visual emphasis */}
          <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full mx-auto mb-8" />

          <Button
            onClick={() => onContinue(node.nextNodeId)}
            variant="default"
            size="xl"
            className={cn(
              "shadow-lg hover:shadow-xl",
              "transform hover:scale-105 transition-all duration-200",
              "rounded-2xl px-10 py-4",
              "text-lg font-semibold",
              "bg-gradient-to-r from-blue-500 to-cyan-600",
              "hover:from-blue-600 hover:to-cyan-700",
              "text-white"
            )}
          >
            {node.buttonLabel || "Continue"}
          </Button>
        </CardContent>
      </Card>

      {/* Decorative elements */}
      <div className="mt-8 text-center text-muted-foreground text-sm opacity-70">
        Knowledge is power
      </div>
    </div>
  );
}
