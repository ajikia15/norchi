"use client";

import { DragEvent } from "react";

const nodeTypes = [
  {
    type: "question",
    icon: "❓",
    label: "კითხვა",
    color: "#3b82f6",
  },
  {
    type: "end",
    icon: "🏁",
    label: "დასასრული",
    color: "#e879f9",
  },
  {
    type: "callout",
    icon: "⚠️",
    label: "შენიშვნა",
    color: "#ef4444",
  },
  {
    type: "infocard",
    icon: "💡",
    label: "ინფო ბარათი",
    color: "#10b981",
  },
];

interface NodePaletteProps {
  orientation?: "horizontal" | "vertical";
}

export default function NodePalette({
  orientation = "vertical",
}: NodePaletteProps) {
  const handleDragStart = (e: DragEvent<HTMLDivElement>, nodeType: string) => {
    e.dataTransfer.setData("application/reactflow", nodeType);
    e.dataTransfer.effectAllowed = "move";
  };

  if (orientation === "horizontal") {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
          კვანძების პალიტრა:
        </span>
        <div className="flex gap-3">
          {nodeTypes.map((nodeType) => (
            <div
              key={nodeType.type}
              draggable
              onDragStart={(e) => handleDragStart(e, nodeType.type)}
              className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg cursor-grab active:cursor-grabbing hover:border-gray-300 hover:shadow-sm transition-all bg-white/80 min-w-0"
              style={{
                borderLeftWidth: "3px",
                borderLeftColor: nodeType.color,
              }}
              title={`${nodeType.icon} ${nodeType.label}`}
            >
              <div
                className="w-6 h-6 rounded flex items-center justify-center text-white text-sm flex-shrink-0"
                style={{ backgroundColor: nodeType.color }}
              >
                {nodeType.icon}
              </div>
              <span className="text-xs font-medium text-gray-700 whitespace-nowrap">
                {nodeType.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Original vertical layout for backward compatibility
  return (
    <div className="w-64 h-fit shadow-sm border-0 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200">
      <div className="p-4 pb-3 border-b border-gray-200">
        <h3 className="text-lg font-semibold">კვანძების პალიტრა</h3>
        <p className="text-sm text-muted-foreground mt-1">
          გადაიტანეთ კვანძები ტილოზე, რომ დაამატოთ ისინი
        </p>
      </div>
      <div className="p-4 pt-3 space-y-3">
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
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
