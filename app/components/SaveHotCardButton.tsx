"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { saveHotCard, unsaveHotCard } from "@/app/server/saved-hotcards";
import { toast } from "sonner";

interface SaveHotCardButtonProps {
  hotTopicId: string;
  user?: { id: string } | null;
  initialSavedStatus?: boolean; // Pre-loaded from server to prevent N+1 queries
}

export default function SaveHotCardButton({
  hotTopicId,
  user,
  initialSavedStatus = false,
}: SaveHotCardButtonProps) {
  const [isSaved, setIsSaved] = useState(initialSavedStatus);
  const [isPending, startTransition] = useTransition();

  const handleToggleSave = (e: React.MouseEvent) => {
    // Prevent event propagation to avoid closing the card
    e.stopPropagation();

    if (!user) {
      toast.error("პირველ გაიარეთ ავტორიზაცია");
      return;
    }

    startTransition(async () => {
      try {
        if (isSaved) {
          await unsaveHotCard(hotTopicId);
          setIsSaved(false);
          toast.success("კითხვა წაიშალა შენახულებიდან");
        } else {
          await saveHotCard(hotTopicId);
          setIsSaved(true);
          toast.success("კითხვა შენახულია");
        }
      } catch (error) {
        const e = error as Error;
        toast.error(e.message || "შეცდომა");
      }
    });
  };

  // Don't show button if user is not logged in
  if (!user) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggleSave}
      disabled={isPending}
      className={`transition-colors touch-manipulation ${
        isSaved
          ? "text-yellow-600 hover:text-yellow-700"
          : "text-gray-500 hover:text-yellow-500"
      }`}
      style={{ touchAction: "manipulation" }}
    >
      <Star className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
    </Button>
  );
}
