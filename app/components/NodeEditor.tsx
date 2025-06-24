"use client";

import { useState, useEffect, useMemo } from "react";
import { Node } from "../types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from "@/components/ui/select";
import { Plus, Trash2, GripVertical, Save, X } from "lucide-react";
import CreateNodeDialog from "./CreateNodeDialog";
import MarkdownEditor from "./MarkdownEditor";

const NO_DESTINATION_VALUE = "__NO_DESTINATION__";

interface NodeEditorProps {
  node: Node;
  allNodes: Record<string, Node>;
  onSave: (node: Node) => void;
  onCancel: () => void;
  onNodeHover?: (nodeId: string | null) => void;
  onCreateAndConnect?: (
    node: Node,
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
        options: editedNode.type === "question" ? editedNode.options : [],
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
        confirm(
          "თქვენ გაქვთ შეუნახავი ცვლილებები. დარწმუნებული ხართ, რომ გსურთ გაუქმება?"
        )
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
      alert("გთხოვთ, შეიყვანოთ ტექსტი");
      return;
    }

    if (editedNode.type === "question") {
      if (editedNode.options.length < 1) {
        alert("კითხვას უნდა ჰქონდეს მინიმუმ 1 ოფცია");
        return;
      }

      for (const option of editedNode.options) {
        if (!option.label.trim()) {
          alert("ყველა ოფციას უნდა ჰქონდეს ტექსტი");
          return;
        }
      }
    }

    if (editedNode.type === "callout") {
      if (!editedNode.returnToNodeId) {
        alert(
          "შენიშვნის ტიპის კვანძს უნდა ჰქონდეს მითითებული დასაბრუნებელი კვანძი"
        );
        return;
      }
    }

    if (editedNode.type === "infocard") {
      if (!editedNode.nextNodeId) {
        alert(
          "ინფო ბარათის ტიპის კვანძს უნდა ჰქონდეს მითითებული შემდეგი კვანძი"
        );
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

  const formatNodeForDisplay = (nodeId: string): string => {
    const targetNode = allNodes[nodeId];
    if (!targetNode) return `Node not found: ${nodeId}`;
    const icon = getNodeTypeIcon(targetNode.type);
    const text =
      targetNode.text.length > 40
        ? `${targetNode.text.substring(0, 40)}...`
        : targetNode.text;
    return `${icon} ${text}`;
  };

  const getSelectValue = (nodeId: string | undefined): string => {
    return nodeId || NO_DESTINATION_VALUE;
  };

  const handleCreateNewNode = (value: string, currentField: string) => {
    if (value.startsWith("create-")) {
      const nodeType = value.replace("create-", "");
      setCreateDialog({
        isOpen: true,
        nodeType: nodeType,
        currentField,
      });
      return undefined;
    }
    return value;
  };

  const handleCreateConfirm = (nodeType: string, nodeName: string) => {
    if (onCreateAndConnect) {
      onCreateAndConnect(
        editedNode,
        nodeType,
        nodeName,
        createDialog.currentField
      );
    }
    setCreateDialog({ isOpen: false, nodeType: "", currentField: "" });
  };

  const renderNodeOptions = (currentField: string) => {
    const nodeOptions = availableNodes.map((nodeId) => (
      <SelectItem key={nodeId} value={nodeId}>
        {formatNodeForDisplay(nodeId)}
      </SelectItem>
    ));

    const createOptions = [
      { value: "create-question", label: "Create new Question..." },
      { value: "create-callout", label: "Create new Callout..." },
      { value: "create-infocard", label: "Create new Infocard..." },
      { value: "create-end", label: "Create new End..." },
    ].map((opt) => (
      <SelectItem key={opt.value} value={opt.value}>
        <div className="flex items-center gap-2">
          <Plus className="h-4 w-4 text-green-500" />
          {opt.label}
        </div>
      </SelectItem>
    ));

    const handleSelectChange = (value: string) => {
      const result = handleCreateNewNode(value, currentField);
      if (result !== undefined) {
        if (currentField.startsWith("option-")) {
          const index = parseInt(currentField.split("-")[1], 10);
          handleOptionChange(index, "nextNodeId", result);
        } else {
          setEditedNode((prev) => ({
            ...prev,
            [currentField]: result === NO_DESTINATION_VALUE ? "" : result,
          }));
        }
      }
    };

    return {
      nodeOptions,
      createOptions,
      handleSelectChange,
    };
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{getNodeTypeIcon(editedNode.type)}</span>
          <h2 className="text-xl font-semibold">Edit Node</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleSave}
            disabled={!hasUnsavedChanges}
            className="gap-2"
          >
            <Save className="h-4 w-4" /> Save
          </Button>
          <Button onClick={handleCancel} variant="ghost" size="icon">
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto p-4">
        <div className="space-y-6">
          {/* Node Type */}
          <div>
            <Label>Node Type</Label>
            <Select
              value={editedNode.type}
              onValueChange={(
                value: "question" | "end" | "callout" | "infocard"
              ) => handleTypeChange(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select node type..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="question">Question</SelectItem>
                <SelectItem value="end">End</SelectItem>
                <SelectItem value="callout">Callout</SelectItem>
                <SelectItem value="infocard">Info Card</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Node Text */}
          <div>
            <Label htmlFor="node-text">Text (Markdown supported)</Label>
            <MarkdownEditor
              key={editedNode.id}
              value={editedNode.text}
              onChange={handleTextChange}
            />
          </div>

          {/* Question Options */}
          {editedNode.type === "question" && (
            <div>
              <Label>Options</Label>
              <div className="mt-2 space-y-4">
                {editedNode.options.map((option, index) => {
                  const { nodeOptions, createOptions, handleSelectChange } =
                    renderNodeOptions(`option-${index}`);

                  return (
                    <div
                      key={index}
                      className="flex items-start gap-2 rounded-lg border bg-stone-50/50 p-3 dark:bg-stone-800/20"
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, index)}
                      onMouseEnter={() =>
                        onNodeHover && onNodeHover(option.nextNodeId)
                      }
                      onMouseLeave={() => onNodeHover && onNodeHover(null)}
                      style={{
                        opacity: draggedIndex === index ? 0.5 : 1,
                        cursor: "move",
                      }}
                    >
                      <GripVertical className="mt-2 h-5 w-5 flex-shrink-0 text-gray-400" />
                      <div className="flex-grow space-y-2">
                        <Input
                          placeholder={`Option ${index + 1} text`}
                          value={option.label}
                          onChange={(e) =>
                            handleOptionChange(index, "label", e.target.value)
                          }
                          className="bg-white dark:bg-stone-800"
                        />
                        <Select
                          value={getSelectValue(option.nextNodeId)}
                          onValueChange={handleSelectChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select next node..." />
                          </SelectTrigger>
                          <SelectContent>
                            {createOptions}
                            <SelectItem value={NO_DESTINATION_VALUE}>
                              No destination
                            </SelectItem>
                            <SelectSeparator />
                            {nodeOptions}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeOption(index)}
                        className="mt-1 flex-shrink-0 text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
              <Button
                onClick={addOption}
                variant="outline"
                className="mt-4 w-full gap-2"
              >
                <Plus className="h-4 w-4" /> Add Option
              </Button>
            </div>
          )}

          {/* Callout Specific Fields */}
          {editedNode.type === "callout" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="callout-return">Return To Node</Label>
                <Select
                  value={getSelectValue(editedNode.returnToNodeId)}
                  onValueChange={(value) => {
                    const { handleSelectChange } =
                      renderNodeOptions("returnToNodeId");
                    handleSelectChange(value);
                  }}
                >
                  <SelectTrigger id="callout-return">
                    <SelectValue placeholder="Select a node to return to..." />
                  </SelectTrigger>
                  <SelectContent
                    onMouseEnter={() =>
                      onNodeHover && onNodeHover(editedNode.returnToNodeId)
                    }
                    onMouseLeave={() => onNodeHover && onNodeHover(null)}
                  >
                    {renderNodeOptions("returnToNodeId").createOptions}
                    <SelectItem value={NO_DESTINATION_VALUE}>
                      No destination
                    </SelectItem>
                    <SelectSeparator />
                    {renderNodeOptions("returnToNodeId").nodeOptions}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="callout-button">Button Label</Label>
                <Input
                  id="callout-button"
                  placeholder="e.g., Try Again"
                  value={editedNode.buttonLabel}
                  onChange={(e) =>
                    setEditedNode({
                      ...editedNode,
                      buttonLabel: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          )}

          {/* Infocard Specific Fields */}
          {editedNode.type === "infocard" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="infocard-next">Next Node</Label>
                <Select
                  value={getSelectValue(editedNode.nextNodeId)}
                  onValueChange={(value) => {
                    const { handleSelectChange } =
                      renderNodeOptions("nextNodeId");
                    handleSelectChange(value);
                  }}
                >
                  <SelectTrigger id="infocard-next">
                    <SelectValue placeholder="Select next node..." />
                  </SelectTrigger>
                  <SelectContent
                    onMouseEnter={() =>
                      onNodeHover && onNodeHover(editedNode.nextNodeId)
                    }
                    onMouseLeave={() => onNodeHover && onNodeHover(null)}
                  >
                    {renderNodeOptions("nextNodeId").createOptions}
                    <SelectItem value={NO_DESTINATION_VALUE}>
                      No destination
                    </SelectItem>
                    <SelectSeparator />
                    {renderNodeOptions("nextNodeId").nodeOptions}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="infocard-button">Button Label</Label>
                <Input
                  id="infocard-button"
                  placeholder="e.g., Continue"
                  value={editedNode.buttonLabel}
                  onChange={(e) =>
                    setEditedNode({
                      ...editedNode,
                      buttonLabel: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <CreateNodeDialog
        isOpen={createDialog.isOpen}
        nodeType={createDialog.nodeType}
        onClose={() =>
          setCreateDialog({ isOpen: false, nodeType: "", currentField: "" })
        }
        onConfirm={handleCreateConfirm}
      />
    </div>
  );
}
