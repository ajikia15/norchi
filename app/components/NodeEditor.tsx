"use client";

import { useState, useEffect, useMemo } from "react";
import { Node } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Plus, Trash2, GripVertical, Save, X } from "lucide-react";
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
      if (editedNode.options.length < 2) {
        alert("კითხვას უნდა ჰქონდეს მინიმუმ 2 ოფცია");
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
    // Auto-save current changes before creating new connected node
    if (hasUnsavedChanges) {
      onSave(editedNode);
    }
    onCreateAndConnect?.(nodeType, nodeName, createDialog.currentField);
  };

  // Create options for dropdowns
  const getDropdownOptions = () => {
    const options = availableNodes.map((id) => (
      <SelectItem key={id} value={id}>
        {formatNodeForDisplay(id)}
      </SelectItem>
    ));

    options.unshift(
      <SelectItem key={NO_DESTINATION_VALUE} value={NO_DESTINATION_VALUE}>
        <span className="text-gray-400">დანიშნულების გარეშე</span>
      </SelectItem>
    );

    options.push(
      <SelectItem key="create-new" value="create-new" className="text-blue-600">
        ახალი კვანძის შექმნა...
      </SelectItem>
    );

    return options;
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex-shrink-0">
        <div className="flex justify-between items-center">
          <CardTitle>კვანძის რედაქტორი</CardTitle>
          <div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSave}
              disabled={!hasUnsavedChanges}
              aria-label="Save changes"
            >
              <Save className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCancel}
              aria-label="Cancel editing"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-grow overflow-y-auto pr-2">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="node-type">კვანძის ტიპი</Label>
              <Select
                value={editedNode.type}
                onValueChange={(
                  value: "question" | "end" | "callout" | "infocard"
                ) => handleTypeChange(value)}
              >
                <SelectTrigger id="node-type">
                  <SelectValue placeholder="აირჩიეთ ტიპი" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="question">❓ კითხვა</SelectItem>
                  <SelectItem value="end">🏁 დასასრული</SelectItem>
                  <SelectItem value="callout">⚠️ შენიშვნა</SelectItem>
                  <SelectItem value="infocard">💡 ინფო ბარათი</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="node-id">კვანძის ID</Label>
              <Input id="node-id" value={editedNode.id} disabled />
            </div>
          </div>

          <div>
            <Label htmlFor="node-text">კვანძის ტექსტი</Label>
            <Textarea
              id="node-text"
              value={editedNode.text}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="შეიყვანეთ კვანძის ტექსტი (Markdown მხარდაჭერილია)"
              className="min-h-[120px]"
            />
          </div>

          {editedNode.type === "question" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>ოფციები</Label>
                <Button variant="outline" size="sm" onClick={addOption}>
                  <Plus className="h-4 w-4 " />
                  ოფციის დამატება
                </Button>
              </div>
              <div
                className="space-y-2"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, editedNode.options.length)}
              >
                {editedNode.options.map((option, index) => (
                  <div
                    key={index}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                    className={cn(
                      "flex items-center gap-2 p-2 border rounded-md bg-white",
                      draggedIndex === index && "opacity-50"
                    )}
                  >
                    <GripVertical className="h-5 w-5 text-gray-400 cursor-move flex-shrink-0" />
                    <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-2">
                      <Input
                        value={option.label}
                        onChange={(e) =>
                          handleOptionChange(index, "label", e.target.value)
                        }
                        placeholder={`ოფცია ${index + 1}`}
                      />
                      <Select
                        value={getSelectValue(option.nextNodeId)}
                        onValueChange={(value) =>
                          handleCreateNewNode(
                            value,
                            `options[${index}].nextNodeId`
                          )
                        }
                        onOpenChange={() =>
                          onNodeHover && onNodeHover(option.nextNodeId || null)
                        }
                      >
                        <SelectTrigger
                          onMouseOver={() =>
                            onNodeHover &&
                            onNodeHover(option.nextNodeId || null)
                          }
                          onMouseLeave={() => onNodeHover && onNodeHover(null)}
                        >
                          <SelectValue placeholder="აირჩიეთ დანიშნულება">
                            {getSelectDisplayValue(option.nextNodeId)}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <div className="max-h-60 overflow-y-auto">
                            {getDropdownOptions()}
                          </div>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeOption(index)}
                      className="flex-shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {editedNode.type === "callout" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="returnToNodeId">დაბრუნება</Label>
                <Select
                  value={getSelectValue(editedNode.returnToNodeId)}
                  onValueChange={(value) =>
                    handleCreateNewNode(value, "returnToNodeId")
                  }
                  onOpenChange={() =>
                    onNodeHover &&
                    onNodeHover(editedNode.returnToNodeId || null)
                  }
                >
                  <SelectTrigger
                    id="returnToNodeId"
                    onMouseOver={() =>
                      onNodeHover &&
                      onNodeHover(editedNode.returnToNodeId || null)
                    }
                    onMouseLeave={() => onNodeHover && onNodeHover(null)}
                  >
                    <SelectValue placeholder="აირჩიეთ დანიშნულება">
                      {getSelectDisplayValue(editedNode.returnToNodeId)}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <div className="max-h-60 overflow-y-auto">
                      {getDropdownOptions()}
                    </div>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="callout-button-label">ღილაკის ტექსტი</Label>
                <Input
                  id="callout-button-label"
                  value={editedNode.buttonLabel}
                  onChange={(e) =>
                    setEditedNode({
                      ...editedNode,
                      buttonLabel: e.target.value,
                    })
                  }
                  placeholder="მაგ., სცადეთ თავიდან"
                />
              </div>
            </div>
          )}

          {editedNode.type === "infocard" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="nextNodeId">შემდეგი კვანძი</Label>
                <Select
                  value={getSelectValue(editedNode.nextNodeId)}
                  onValueChange={(value) =>
                    handleCreateNewNode(value, "nextNodeId")
                  }
                  onOpenChange={() =>
                    onNodeHover && onNodeHover(editedNode.nextNodeId || null)
                  }
                >
                  <SelectTrigger
                    id="nextNodeId"
                    onMouseOver={() =>
                      onNodeHover && onNodeHover(editedNode.nextNodeId || null)
                    }
                    onMouseLeave={() => onNodeHover && onNodeHover(null)}
                  >
                    <SelectValue placeholder="აირჩიეთ დანიშნულება">
                      {getSelectDisplayValue(editedNode.nextNodeId)}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <div className="max-h-60 overflow-y-auto">
                      {getDropdownOptions()}
                    </div>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="infocard-button-label">ღილაკის ტექსტი</Label>
                <Input
                  id="infocard-button-label"
                  value={editedNode.buttonLabel}
                  onChange={(e) =>
                    setEditedNode({
                      ...editedNode,
                      buttonLabel: e.target.value,
                    })
                  }
                  placeholder="მაგ., გაგრძელება"
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>

      <div className="p-4 border-t flex-shrink-0">
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleCancel}>
            გაუქმება
          </Button>
          <Button onClick={handleSave} disabled={!hasUnsavedChanges}>
            <Save className="h-4 w-4 " />
            ცვლილებების შენახვა
          </Button>
        </div>
      </div>

      <CreateNodeDialog
        isOpen={createDialog.isOpen}
        onClose={() => setCreateDialog({ ...createDialog, isOpen: false })}
        onConfirm={handleCreateConfirm}
        nodeType={createDialog.nodeType}
      />
    </Card>
  );
}
