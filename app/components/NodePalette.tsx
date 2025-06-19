"use client";

import { DragEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const nodeTypes = [
  {
    type: "question",
    icon: "❓",
    label: "Question",
    description: "Ask user to choose between options",
    color: "#3b82f6",
  },
  {
    type: "end",
    icon: "🏁",
    label: "End",
    description: "Terminal node that ends the story",
    color: "#e879f9",
  },
  {
    type: "callout",
    icon: "⚠️",
    label: "Callout",
    description: "Show warning or important message",
    color: "#ef4444",
  },
  {
    type: "infocard",
    icon: "💡",
    label: "Info Card",
    description: "Display information to continue",
    color: "#10b981",
  },
];

export default function NodePalette() {
  const handleDragStart = (e: DragEvent<HTMLDivElement>, nodeType: string) => {
    e.dataTransfer.setData("application/reactflow", nodeType);
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <Card className="w-64 h-fit shadow-sm border-0 bg-white/60 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Node Palette</CardTitle>
        <p className="text-sm text-muted-foreground">
          Drag nodes to the canvas to add them
        </p>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        {nodeTypes.map((nodeType) => (
          <div
            key={nodeType.type}
            draggable
            onDragStart={(e) => handleDragStart(e, nodeType.type)}
            className="p-3 border border-gray-200 rounded-lg cursor-grab active:cursor-grabbing hover:border-gray-300 hover:shadow-sm transition-all bg-white/80"
            style={{
              borderLeftWidth: "4px",
              borderLeftColor: nodeType.color,
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg"
                style={{ backgroundColor: nodeType.color }}
              >
                {nodeType.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">{nodeType.label}</div>
                <div className="text-xs text-muted-foreground leading-tight">
                  {nodeType.description}
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
