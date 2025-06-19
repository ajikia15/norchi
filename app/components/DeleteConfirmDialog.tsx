"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2, AlertTriangle } from "lucide-react";
import { Node } from "../types";

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  nodeToDelete: Node | null;
}

export default function DeleteConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  nodeToDelete,
}: DeleteConfirmDialogProps) {
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

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleConfirm();
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  if (!nodeToDelete) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" onKeyDown={handleKeyDown}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Delete Node
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl">{getNodeIcon(nodeToDelete.type)}</div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm">
                {nodeToDelete.type.toUpperCase()} Node
              </div>
              <div className="text-sm text-muted-foreground truncate">
                {nodeToDelete.text}
              </div>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            <p className="mb-2">
              Are you sure you want to delete this node? This action cannot be
              undone.
            </p>
            {nodeToDelete.type === "question" &&
              nodeToDelete.options?.length > 0 && (
                <p className="text-amber-600 font-medium">
                  ⚠️ This will also remove {nodeToDelete.options.length} option
                  connections.
                </p>
              )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete Node
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
