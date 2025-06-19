"use client";

import { memo, useState } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Node } from "../types";
import { Edit2, Plus } from "lucide-react";

interface CustomNodeData {
  node: Node;
  isSelected: boolean;
  onEdit: (node: Node) => void;
  onAddConnection: (sourceNodeId: string, optionIndex?: number) => void;
}

function CustomNode({ data, selected }: NodeProps<CustomNodeData>) {
  const { node, isSelected, onEdit, onAddConnection } = data;
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(node.text);

  const getNodeColor = () => {
    switch (node.type) {
      case "question":
        return "#3b82f6"; // Blue
      case "end":
        return "#e879f9"; // Purple
      case "callout":
        return "#ef4444"; // Red
      case "infocard":
        return "#10b981"; // Emerald
      default:
        return "#6b7280"; // Gray
    }
  };

  const getNodeIcon = () => {
    switch (node.type) {
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

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditText(node.text);
  };

  const handleEditSubmit = () => {
    if (editText.trim()) {
      onEdit({ ...node, text: editText.trim() });
    }
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setEditText(node.text);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleEditSubmit();
    } else if (e.key === "Escape") {
      handleEditCancel();
    }
  };

  return (
    <div
      className={`relative bg-white border-2 rounded-lg shadow-md min-w-[200px] max-w-[300px] ${
        isSelected || selected ? "border-blue-500 shadow-lg" : "border-gray-300"
      }`}
      style={{ backgroundColor: getNodeColor() }}
      onDoubleClick={handleDoubleClick}
    >
      {/* Target Handle - Only show for all nodes (they can all be targets) */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-gray-600 border-2 border-white"
      />

      {/* Node Header */}
      <div className="p-3 text-white">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">{getNodeIcon()}</span>
            <span className="font-semibold text-sm">
              {node.type.toUpperCase()}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(node);
            }}
            className="p-1 hover:bg-white/20 rounded transition-colors"
            title="Edit node"
          >
            <Edit2 className="w-3 h-3" />
          </button>
        </div>

        {/* Node Content */}
        <div className="text-xs">
          {isEditing ? (
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleEditSubmit}
              className="w-full p-2 text-black rounded border-0 resize-none"
              rows={3}
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <div className="break-words">
              {node.text.length > 80
                ? `${node.text.substring(0, 80)}...`
                : node.text}
            </div>
          )}
        </div>
      </div>

      {/* Question Options with Handles */}
      {node.type === "question" && (
        <div className="px-3 pb-3">
          {node.options.map((option, index) => (
            <div key={index} className="relative mb-2 last:mb-0">
              <div className="bg-white/20 rounded p-2 text-xs text-white">
                {option.label}
              </div>
              <Handle
                type="source"
                position={Position.Right}
                id={`option-${index}`}
                style={{
                  top: `${50 + index * 40}px`,
                  right: "-8px",
                }}
                className="w-3 h-3 !bg-white border-2 border-gray-600"
                title={`Connect "${option.label}"`}
              />
            </div>
          ))}
        </div>
      )}

      {/* Source Handle for non-question nodes */}
      {node.type !== "question" && node.type !== "end" && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 !bg-white border-2 border-gray-600"
        />
      )}

      {/* Add Connection Button for Question nodes */}
      {node.type === "question" && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddConnection(node.id);
          }}
          className="absolute -right-8 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors shadow-md"
          title="Add new option"
        >
          <Plus className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

export default memo(CustomNode);
