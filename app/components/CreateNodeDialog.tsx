"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CreateNodeDialogProps {
  isOpen: boolean;
  nodeType: string;
  onClose: () => void;
  onConfirm: (nodeType: string, nodeName: string) => void;
}

export default function CreateNodeDialog({
  isOpen,
  nodeType,
  onClose,
  onConfirm,
}: CreateNodeDialogProps) {
  const [nodeName, setNodeName] = useState("");

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

  const getNodeTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const handleConfirm = () => {
    const name = nodeName.trim();
    if (!name) return;

    onConfirm(nodeType, name);
    setNodeName("");
    onClose();
  };

  const handleCancel = () => {
    setNodeName("");
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleConfirm();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getNodeTypeIcon(nodeType)} შექმენით ახალი{" "}
            {getNodeTypeLabel(nodeType)}
          </DialogTitle>
          <DialogDescription>
            შეიყვანეთ სახელი თქვენი ახალი {nodeType} კვანძისთვის. თქვენ
            შეგიძლიათ შეცვალოთ სრული შინაარსი შექმნის შემდეგ.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="node-name" className="text-sm font-medium">
              კვანძის სახელი
            </Label>
            <Input
              id="node-name"
              value={nodeName}
              onChange={(e) => setNodeName(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={`შეიყვანეთ ${nodeType} სახელი...`}
              className="w-full"
              autoFocus
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            გაუქმება
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!nodeName.trim()}
            className="min-w-[100px]"
          >
            შექმენით {getNodeTypeLabel(nodeType)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
