"use client";

import { memo, useState } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Node } from "../types";
import { Edit2, Plus } from "lucide-react";

interface CustomNodeData {
  node: Node;
  isSelected: boolean;
  onEdit: (node: Node) => void;
  onClick?: (node: Node) => void;
  onAddConnection: (sourceNodeId: string, optionIndex?: number) => void;
}

function CustomNode({ data, selected }: NodeProps<CustomNodeData>) {
  const { node, isSelected, onEdit, onClick, onAddConnection } = data;
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
      onEdit({ ...node, text: editText });
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

  const handleClick = (e: React.MouseEvent) => {
    // Don't trigger click when clicking edit button or handles
    if (
      e.target !== e.currentTarget &&
      !(e.target as HTMLElement).closest(".node-content")
    ) {
      return;
    }
    onClick?.(node);
  };

  return (
    <div
      className={`relative bg-white border-2 rounded-lg shadow-md min-w-[220px] max-w-[320px] ${
        isSelected || selected
          ? "border-blue-500 shadow-lg ring-2 ring-blue-200"
          : "border-gray-300 hover:border-gray-400"
      } transition-all duration-150 cursor-pointer`}
      style={{ backgroundColor: getNodeColor() }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      {/* Target Handle - Only show for all nodes (they can all be targets) */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-4 h-4 !bg-gray-600 border-2 border-white hover:!bg-blue-600 transition-colors"
      />

      {/* Node Header */}
      <div className="p-4 text-white node-content">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">{getNodeIcon()}</span>
            <span className="font-semibold text-sm">
              {node.type.toUpperCase()}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(node);
            }}
            className="p-1.5 hover:bg-white/20 rounded transition-colors"
            title="კვანძის რედაქტირება"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>

        {/* Node Content */}
        <div className="text-sm leading-relaxed">
          {isEditing ? (
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleEditSubmit}
              className="w-full p-2 text-black rounded border-0 resize-none text-sm"
              rows={3}
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <div className="break-words">
              {node.text.length > 100
                ? `${node.text.substring(0, 100)}...`
                : node.text}
            </div>
          )}
        </div>
      </div>

      {/* Question Options with Handles */}
      {node.type === "question" && (
        <div className="px-4 pb-4">
          {node.options.map((option, index) => (
            <div key={index} className="relative mb-3 last:mb-0">
              <div className="bg-white/20 backdrop-blur-sm rounded-md p-3 text-sm text-white border border-white/10 hover:bg-white/30 transition-colors">
                {option.label}
              </div>
              <Handle
                type="source"
                position={Position.Right}
                id={`option-${index}`}
                style={{
                  top: `${55 + index * 45}px`,
                  right: "-10px",
                }}
                className="w-4 h-4 !bg-white border-2 border-gray-600 hover:!bg-blue-100 transition-colors"
                title={`დაკავშირება "${option.label}"`}
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
          className="w-4 h-4 !bg-white border-2 border-gray-600 hover:!bg-blue-100 transition-colors"
        />
      )}

      {/* Add Connection Button for Question nodes */}
      {node.type === "question" && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddConnection(node.id);
          }}
          className="absolute -right-10 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-all shadow-lg"
          title="ახალი ვარიანტის დამატება"
        >
          <Plus className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export default memo(CustomNode);
