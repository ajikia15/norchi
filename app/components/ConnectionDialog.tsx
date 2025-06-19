"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface ConnectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (optionLabel: string) => void;
  sourceNodeId: string;
  targetNodeId: string;
  initialLabel?: string;
}

export default function ConnectionDialog({
  isOpen,
  onClose,
  onConfirm,
  sourceNodeId,
  targetNodeId,
  initialLabel = "",
}: ConnectionDialogProps) {
  const [optionLabel, setOptionLabel] = useState(initialLabel);

  const handleConfirm = () => {
    if (optionLabel.trim()) {
      onConfirm(optionLabel.trim());
      setOptionLabel("");
      onClose();
    }
  };

  const handleCancel = () => {
    setOptionLabel(initialLabel);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleConfirm();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Set Connection Label</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Creating connection from <strong>{sourceNodeId}</strong> to{" "}
            <strong>{targetNodeId}</strong>
          </div>
          <div className="space-y-2">
            <Label htmlFor="option-label">Option Label</Label>
            <Input
              id="option-label"
              value={optionLabel}
              onChange={(e) => setOptionLabel(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter the choice text (e.g., 'Yes', 'No', 'Continue')"
              autoFocus
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!optionLabel.trim()}>
            Create Connection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
