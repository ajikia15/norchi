"use client";

import { useState, useEffect, useMemo } from "react";
import { Node } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { cn } from "../lib/utils";
import { Plus, Trash2, GripVertical, Save, X, ArrowRight } from "lucide-react";
import CreateNodeDialog from "./CreateNodeDialog";

const NO_DESTINATION_VALUE = "__NO_DESTINATION__";

interface NodeEditorProps {
  node: Node;
  allNodes: Record<string, Node>;
  onSave: (node: Node) => void;
  onCancel: () => void;
  onNodeHover?: (nodeId: string | null) => void;
  onCreateAndConnect?: (
    nodeType: string,
    nodeName: string,
    currentField: string
  ) => void;
}

export default function NodeEditor({
  node,
  allNodes,
  onSave,
  onCancel,
  onNodeHover,
  onCreateAndConnect,
}: NodeEditorProps) {
  const [editedNode, setEditedNode] = useState<Node>(node);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [createDialog, setCreateDialog] = useState<{
    isOpen: boolean;
    nodeType: string;
    currentField: string;
  }>({
    isOpen: false,
    nodeType: "",
    currentField: "",
  });

  // Sync editedNode state when node prop changes
  useEffect(() => {
    setEditedNode(node);
    setDraggedIndex(null); // Clear any drag state when switching nodes
  }, [node]);

  // Check if there are unsaved changes by comparing editedNode with original node
  const hasUnsavedChanges = useMemo(() => {
    return JSON.stringify(editedNode) !== JSON.stringify(node);
  }, [editedNode, node]);

  const handleTextChange = (text: string) => {
    setEditedNode({ ...editedNode, text });
  };

  const handleTypeChange = (
    type: "question" | "end" | "callout" | "infocard"
  ) => {
    if (type === "question") {
      setEditedNode({
        id: editedNode.id,
        type: "question",
        text: editedNode.text,
        options: [
          { label: "Option 1", nextNodeId: "" },
          { label: "Option 2", nextNodeId: "" },
        ],
      });
    } else if (type === "end") {
      setEditedNode({
        id: editedNode.id,
        type: "end",
        text: editedNode.text,
      });
    } else if (type === "callout") {
      setEditedNode({
        id: editedNode.id,
        type: "callout",
        text: editedNode.text,
        returnToNodeId: "",
        buttonLabel: "Try Again",
      });
    } else if (type === "infocard") {
      setEditedNode({
        id: editedNode.id,
        type: "infocard",
        text: editedNode.text,
        nextNodeId: "",
        buttonLabel: "Continue",
      });
    }
  };

  const handleOptionChange = (
    index: number,
    field: "label" | "nextNodeId",
    value: string
  ) => {
    if (editedNode.type !== "question") return;

    const newOptions = [...editedNode.options];
    newOptions[index] = {
      ...newOptions[index],
      [field]: value === NO_DESTINATION_VALUE ? "" : value,
    };

    setEditedNode({
      ...editedNode,
      options: newOptions,
    });
  };

  const addOption = () => {
    if (editedNode.type !== "question") return;

    setEditedNode({
      ...editedNode,
      options: [...editedNode.options, { label: "New option", nextNodeId: "" }],
    });
  };

  const removeOption = (index: number) => {
    if (editedNode.type !== "question") return;

    const newOptions = editedNode.options.filter((_, i) => i !== index);
    setEditedNode({
      ...editedNode,
      options: newOptions,
    });
  };

  const moveOption = (fromIndex: number, toIndex: number) => {
    if (editedNode.type !== "question") return;

    const newOptions = [...editedNode.options];
    const [movedOption] = newOptions.splice(fromIndex, 1);
    newOptions.splice(toIndex, 0, movedOption);

    setEditedNode({
      ...editedNode,
      options: newOptions,
    });
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      moveOption(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      if (
        confirm("You have unsaved changes. Are you sure you want to cancel?")
      ) {
        onCancel();
      }
    } else {
      onCancel();
    }
  };

  const handleSave = () => {
    // Basic validation
    if (!editedNode.text.trim()) {
      alert("Please enter some text");
      return;
    }

    if (editedNode.type === "question") {
      if (editedNode.options.length < 2) {
        alert("Questions must have at least 2 options");
        return;
      }

      for (const option of editedNode.options) {
        if (!option.label.trim()) {
          alert("All options must have labels");
          return;
        }
      }
    }

    if (editedNode.type === "callout") {
      if (!editedNode.returnToNodeId) {
        alert("Callout nodes must specify a return node");
        return;
      }
    }

    if (editedNode.type === "infocard") {
      if (!editedNode.nextNodeId) {
        alert("Infocard nodes must specify a next node");
        return;
      }
    }

    onSave(editedNode);
  };

  const availableNodes = Object.keys(allNodes).filter(
    (id) => id !== editedNode.id
  );

  const getNodeTypeIcon = (type: string) => {
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

  // Helper function to format node for display in dropdowns
  const formatNodeForDisplay = (nodeId: string): string => {
    const node = allNodes[nodeId];
    if (!node) return nodeId;

    const icon = getNodeTypeIcon(node.type);
    const truncatedText =
      node.text.length > 30 ? node.text.substring(0, 30) + "..." : node.text;
    const capitalizedType =
      node.type.charAt(0).toUpperCase() + node.type.slice(1);

    return `${icon} ${truncatedText} (${capitalizedType})`;
  };

  // Helper function to get value for current dropdown selection
  const getSelectValue = (nodeId: string | undefined): string => {
    return nodeId || NO_DESTINATION_VALUE;
  };

  // Helper function to get display text for current selection
  const getSelectDisplayValue = (nodeId: string | undefined): string => {
    if (!nodeId) return "-- No destination --";
    return formatNodeForDisplay(nodeId);
  };

  // Helper function to handle special create actions
  const handleCreateNewNode = (value: string, currentField: string) => {
    if (value.startsWith("__CREATE_")) {
      const nodeType = value.replace("__CREATE_", "").toLowerCase();
      setCreateDialog({
        isOpen: true,
        nodeType,
        currentField,
      });
      return true;
    }
    return false;
  };

  // Handle dialog confirmation
  const handleCreateConfirm = (nodeType: string, nodeName: string) => {
    onCreateAndConnect?.(nodeType, nodeName, createDialog.currentField);
  };

  // Create options for dropdowns
  const getDropdownOptions = () => {
    return [
      {
        value: NO_DESTINATION_VALUE,
        label: "-- No destination --",
        isCreate: false,
      },
      {
        value: "__CREATE_QUESTION",
        label: "❓ + Create New Question",
        isCreate: true,
      },
      { value: "__CREATE_END", label: "🏁 + Create New End", isCreate: true },
      {
        value: "__CREATE_CALLOUT",
        label: "⚠️ + Create New Callout",
        isCreate: true,
      },
      {
        value: "__CREATE_INFOCARD",
        label: "💡 + Create New Info Card",
        isCreate: true,
      },
      {
        value: "__SEPARATOR__",
        label: "---- Existing Nodes ----",
        isCreate: false,
      },
      ...availableNodes.map((nodeId) => ({
        value: nodeId,
        label: formatNodeForDisplay(nodeId),
        isCreate: false,
      })),
    ];
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="text-sm">
              {getNodeTypeIcon(editedNode.type)} {editedNode.type.toUpperCase()}
            </Badge>
            {hasUnsavedChanges && (
              <Badge variant="destructive" className="text-xs">
                Unsaved changes
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button onClick={handleCancel} variant="outline" size="sm">
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            {hasUnsavedChanges && (
              <Button onClick={handleSave} size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save Node
              </Button>
            )}
          </div>
        </div>

        {/* Basic Configuration */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Basic Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Node Type</Label>
              <Select
                value={editedNode.type}
                onValueChange={(value) =>
                  handleTypeChange(
                    value as "question" | "end" | "callout" | "infocard"
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="question">❓ Question</SelectItem>
                  <SelectItem value="end">🏁 End</SelectItem>
                  <SelectItem value="callout">⚠️ Callout</SelectItem>
                  <SelectItem value="infocard">💡 Info Card</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="node-text">Content</Label>
              <Textarea
                id="node-text"
                value={editedNode.text}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder="Enter the main text content..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Type-specific Configuration */}
        {editedNode.type === "question" && (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Answer Options</CardTitle>
                <Button onClick={addOption} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Option
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {editedNode.options.map((option, index) => (
                <Card
                  key={index}
                  className={cn(
                    "border border-gray-200 bg-gray-50/50",
                    draggedIndex === index && "opacity-50"
                  )}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 cursor-move mt-1"
                      >
                        <GripVertical className="h-4 w-4" />
                      </Button>

                      <div className="flex-1 space-y-3">
                        <div className="space-y-2">
                          <Label className="text-sm">Option {index + 1}</Label>
                          <Input
                            value={option.label}
                            onChange={(e) =>
                              handleOptionChange(index, "label", e.target.value)
                            }
                            placeholder="Enter option label..."
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm flex items-center gap-2">
                            Next Node
                            <ArrowRight className="h-3 w-3" />
                          </Label>
                          <Select
                            value={getSelectValue(option.nextNodeId)}
                            onValueChange={(value) => {
                              if (
                                !handleCreateNewNode(
                                  value,
                                  `question_option_${index}`
                                )
                              ) {
                                handleOptionChange(index, "nextNodeId", value);
                              }
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue>
                                {getSelectDisplayValue(option.nextNodeId)}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {getDropdownOptions().map(
                                (option, optionIndex) => (
                                  <SelectItem
                                    key={optionIndex}
                                    value={option.value}
                                    onMouseEnter={() => {
                                      if (
                                        !option.isCreate &&
                                        option.value !== NO_DESTINATION_VALUE &&
                                        option.value !== "__SEPARATOR__"
                                      ) {
                                        onNodeHover?.(option.value);
                                      }
                                    }}
                                    onMouseLeave={() => onNodeHover?.(null)}
                                    disabled={option.value === "__SEPARATOR__"}
                                    className={cn(
                                      option.isCreate &&
                                        "font-medium text-blue-600",
                                      option.value === "__SEPARATOR__" &&
                                        "text-gray-500 italic font-normal"
                                    )}
                                  >
                                    {option.label}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <Button
                        onClick={() => removeOption(index)}
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-red-50 hover:text-red-600 mt-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        )}

        {editedNode.type === "callout" && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Callout Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Return to Node</Label>
                <Select
                  value={getSelectValue(editedNode.returnToNodeId)}
                  onValueChange={(value) => {
                    if (!handleCreateNewNode(value, "callout_return")) {
                      setEditedNode({
                        ...editedNode,
                        returnToNodeId:
                          value === NO_DESTINATION_VALUE ? "" : value,
                      });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue>
                      {getSelectDisplayValue(editedNode.returnToNodeId)}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {getDropdownOptions().map((option, optionIndex) => (
                      <SelectItem
                        key={optionIndex}
                        value={option.value}
                        onMouseEnter={() => {
                          if (
                            !option.isCreate &&
                            option.value !== NO_DESTINATION_VALUE &&
                            option.value !== "__SEPARATOR__"
                          ) {
                            onNodeHover?.(option.value);
                          }
                        }}
                        onMouseLeave={() => onNodeHover?.(null)}
                        disabled={option.value === "__SEPARATOR__"}
                        className={cn(
                          option.isCreate && "font-medium text-blue-600",
                          option.value === "__SEPARATOR__" &&
                            "text-gray-500 italic font-normal"
                        )}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Button Label</Label>
                <Input
                  value={editedNode.buttonLabel || "Try Again"}
                  onChange={(e) =>
                    setEditedNode({
                      ...editedNode,
                      buttonLabel: e.target.value,
                    })
                  }
                  placeholder="Try Again"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {editedNode.type === "infocard" && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Info Card Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Next Node</Label>
                <Select
                  value={getSelectValue(editedNode.nextNodeId)}
                  onValueChange={(value) => {
                    if (!handleCreateNewNode(value, "infocard_next")) {
                      setEditedNode({
                        ...editedNode,
                        nextNodeId: value === NO_DESTINATION_VALUE ? "" : value,
                      });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue>
                      {getSelectDisplayValue(editedNode.nextNodeId)}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {getDropdownOptions().map((option, optionIndex) => (
                      <SelectItem
                        key={optionIndex}
                        value={option.value}
                        onMouseEnter={() => {
                          if (
                            !option.isCreate &&
                            option.value !== NO_DESTINATION_VALUE &&
                            option.value !== "__SEPARATOR__"
                          ) {
                            onNodeHover?.(option.value);
                          }
                        }}
                        onMouseLeave={() => onNodeHover?.(null)}
                        disabled={option.value === "__SEPARATOR__"}
                        className={cn(
                          option.isCreate && "font-medium text-blue-600",
                          option.value === "__SEPARATOR__" &&
                            "text-gray-500 italic font-normal"
                        )}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Button Label</Label>
                <Input
                  value={editedNode.buttonLabel || "Continue"}
                  onChange={(e) =>
                    setEditedNode({
                      ...editedNode,
                      buttonLabel: e.target.value,
                    })
                  }
                  placeholder="Continue"
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create Node Dialog */}
      <CreateNodeDialog
        isOpen={createDialog.isOpen}
        nodeType={createDialog.nodeType}
        onClose={() =>
          setCreateDialog({ isOpen: false, nodeType: "", currentField: "" })
        }
        onConfirm={handleCreateConfirm}
      />
    </>
  );
}
