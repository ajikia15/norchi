"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
      onConfirm(optionLabel);
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
          <DialogTitle>კავშირის იარლიყის დაყენება</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            კავშირის შექმნა <strong>{sourceNodeId}</strong>-დან{" "}
            <strong>{targetNodeId}</strong>-ზე
          </div>
          <div className="space-y-2">
            <Label htmlFor="option-label">ვარიანტის იარლიყი</Label>
            <Input
              id="option-label"
              value={optionLabel}
              onChange={(e) => setOptionLabel(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="შეიყვანეთ არჩევანის ტექსტი (მაგ., 'დიახ', 'არა', 'გაგრძელება')"
              autoFocus
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            გაუქმება
          </Button>
          <Button onClick={handleConfirm} disabled={!optionLabel.trim()}>
            კავშირის შექმნა
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
