"use client";

import { EndNode } from "../types";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { cn } from "../lib/utils";

interface EndCardProps {
  node: EndNode;
  onRestart: () => void;
}

export default function EndCard({ node, onRestart }: EndCardProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card
        className={cn(
          "w-full max-w-lg mx-auto",
          "bg-gradient-to-br from-white via-green-50/20 to-emerald-50/30",
          "shadow-2xl border-0 rounded-3xl",
          "animate-in slide-in-from-bottom-4 duration-500"
        )}
      >
        <CardHeader className="text-center pb-4">
          <Badge
            variant="success"
            className="mx-auto mb-4 px-4 py-2 text-base font-semibold"
          >
            🏁 Conclusion
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
            Journey Complete
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
          <div className="w-20 h-1 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full mx-auto mb-8" />

          <Button
            onClick={onRestart}
            variant="default"
            size="xl"
            className={cn(
              "shadow-lg hover:shadow-xl",
              "transform hover:scale-105 transition-all duration-200",
              "rounded-2xl px-10 py-4",
              "text-lg font-semibold",
              "bg-gradient-to-r from-primary to-primary/90",
              "hover:from-primary/90 hover:to-primary/80"
            )}
          >
            Start New Journey
          </Button>
        </CardContent>
      </Card>

      {/* Decorative elements */}
      <div className="mt-8 text-center text-muted-foreground text-sm opacity-70">
        Ready for another challenge?
      </div>
    </div>
  );
}
