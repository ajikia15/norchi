"use client";

import { Node } from "../types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Edit, Trash2, Crown } from "lucide-react";

interface NodeListProps {
  nodes: Record<string, Node>;
  startNodeId: string;
  onEdit: (node: Node) => void;
  onDelete: (nodeId: string) => void;
  hoveredNodeId?: string | null;
  selectedNodeId?: string | null;
}

export default function NodeList({
  nodes,
  startNodeId,
  onEdit,
  onDelete,
  hoveredNodeId,
  selectedNodeId,
}: NodeListProps) {
  const getNodeTypeColor = (type: string) => {
    switch (type) {
      case "question":
        return "info";
      case "end":
        return "secondary";
      case "callout":
        return "warning";
      case "infocard":
        return "success";
      default:
        return "outline";
    }
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case "question":
        return "❓";
      case "end":
        return "🏁";
      case "callout":
        return "⚠️";
      case "infocard":
        return "💡";
      default:
        return "📄";
    }
  };

  // Get relationship type for a node relative to the selected node
  const getRelationshipType = (nodeId: string): string | null => {
    if (!selectedNodeId || !nodes[selectedNodeId]) return null;

    const selectedNode = nodes[selectedNodeId];

    // Check if this node is referenced by the selected node
    if (selectedNode.type === "question") {
      const isNextNode = selectedNode.options.some(
        (option) => option.nextNodeId === nodeId
      );
      if (isNextNode) return "next";
    } else if (selectedNode.type === "callout") {
      if (selectedNode.returnToNodeId === nodeId) return "return";
    } else if (selectedNode.type === "infocard") {
      if (selectedNode.nextNodeId === nodeId) return "next";
    }

    // Check if the selected node is referenced by this node
    const currentNode = nodes[nodeId];
    if (currentNode.type === "question") {
      const pointsToSelected = currentNode.options.some(
        (option) => option.nextNodeId === selectedNodeId
      );
      if (pointsToSelected) return "points-to";
    } else if (currentNode.type === "callout") {
      if (currentNode.returnToNodeId === selectedNodeId) return "points-to";
    } else if (currentNode.type === "infocard") {
      if (currentNode.nextNodeId === selectedNodeId) return "points-to";
    }

    return null;
  };

  // Get highlighting classes based on relationship
  const getRelationshipHighlight = (nodeId: string) => {
    const relationship = getRelationshipType(nodeId);

    switch (relationship) {
      case "next":
        return "ring-2 ring-green-400 bg-green-50/80 border-green-300";
      case "return":
        return "ring-2 ring-blue-400 bg-blue-50/80 border-blue-300";
      case "points-to":
        return "ring-2 ring-purple-400 bg-purple-50/80 border-purple-300";
      default:
        return "";
    }
  };

  // Get relationship badge
  const getRelationshipBadge = (nodeId: string) => {
    const relationship = getRelationshipType(nodeId);

    switch (relationship) {
      case "next":
        return (
          <Badge
            variant="secondary"
            className="text-xs bg-green-100 text-green-800 border-green-200"
          >
            → შემდეგი
          </Badge>
        );
      case "return":
        return (
          <Badge
            variant="secondary"
            className="text-xs bg-blue-100 text-blue-800 border-blue-200"
          >
            ↩ დაბრუნება
          </Badge>
        );
      case "points-to":
        return (
          <Badge
            variant="secondary"
            className="text-xs bg-purple-100 text-purple-800 border-purple-200"
          >
            ← მიუთითებს აქ
          </Badge>
        );
      default:
        return null;
    }
  };

  const nodeList = Object.values(nodes);

  if (nodeList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Edit className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          კვანძები ჯერ არ არის
        </h3>
        <p className="text-muted-foreground max-w-sm">
          შექმენით თქვენი პირველი კვანძი, რომ დაიწყოთ თქვენი ნაკადის მშენებლობა
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-[600px] overflow-y-auto">
      {nodeList.map((node) => (
        <Card
          key={node.id}
          className={cn(
            "transition-all duration-200 hover:shadow-md cursor-pointer",
            "border border-gray-200/50 bg-white/80 backdrop-blur-sm",
            // Hover highlight effect when this node is being hovered in dropdown
            hoveredNodeId === node.id &&
              "ring-2 ring-blue-500 shadow-lg bg-blue-50/80 border-blue-300",
            // Currently selected node highlight
            selectedNodeId === node.id &&
              "ring-2 ring-orange-400 bg-orange-50/80 border-orange-300",
            // Relationship highlights (only when not hovered or selected)
            !hoveredNodeId &&
              selectedNodeId !== node.id &&
              getRelationshipHighlight(node.id)
          )}
          onClick={() => onEdit(node)}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                {/* Header with ID and badges */}
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <code className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-600">
                    {node.id}
                  </code>

                  {node.id === startNodeId && (
                    <Badge
                      variant="secondary"
                      className="text-xs bg-green-100 text-green-800 border-green-200"
                    >
                      <Crown className="h-3 w-3 mr-1" />
                      დაწყება
                    </Badge>
                  )}

                  <Badge
                    variant={
                      getNodeTypeColor(node.type) as "secondary" | "outline"
                    }
                    className={cn("text-xs", {
                      "bg-blue-100 text-blue-800 border-blue-200":
                        node.type === "question",
                      "bg-purple-100 text-purple-800 border-purple-200":
                        node.type === "end",
                      "bg-yellow-100 text-yellow-800 border-yellow-200":
                        node.type === "callout",
                      "bg-green-100 text-green-800 border-green-200":
                        node.type === "infocard",
                    })}
                  >
                    {getNodeIcon(node.type)} {node.type.toUpperCase()}
                  </Badge>

                  {/* Relationship badge */}
                  {getRelationshipBadge(node.id)}
                </div>

                {/* Content */}
                <p className="text-sm text-gray-700 mb-3 line-clamp-2 leading-relaxed">
                  {node.text}
                </p>

                {/* Metadata */}
                <div className="text-xs text-muted-foreground">
                  {node.type === "question" && (
                    <span>{node.options.length} ოფცია</span>
                  )}
                  {node.type === "callout" && (
                    <span>
                      აბრუნებს: {node.returnToNodeId || "მითითებული არ არის"}
                    </span>
                  )}
                  {node.type === "infocard" && (
                    <span>
                      აგრძელებს: {node.nextNodeId || "მითითებული არ არის"}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-1 ml-3">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(node);
                  }}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                >
                  <Edit className="h-3.5 w-3.5" />
                </Button>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(node.id);
                  }}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
