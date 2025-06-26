"use client";

import { useState, useEffect, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Heart, HeartOff } from "lucide-react";
import {
  saveHotCard,
  unsaveHotCard,
  isHotCardSaved,
} from "@/app/server/saved-hotcards";
import { toast } from "sonner";

interface SaveHotCardButtonProps {
  hotTopicId: string;
  user?: { id: string } | null;
}

export default function SaveHotCardButton({
  hotTopicId,
  user,
}: SaveHotCardButtonProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);

  // Check if card is already saved on mount
  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const checkSaved = async () => {
      try {
        const saved = await isHotCardSaved(hotTopicId);
        setIsSaved(saved);
      } catch (error) {
        console.error("Error checking saved status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSaved();
  }, [hotTopicId, user]);

  const handleToggleSave = () => {
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

  // Show skeleton while loading
  if (isLoading) {
    return (
      <Button variant="ghost" size="sm" disabled>
        <div className="h-4 w-4 bg-gray-300 animate-pulse rounded" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggleSave}
      disabled={isPending}
      className={`transition-colors ${
        isSaved
          ? "text-red-500 hover:text-red-600"
          : "text-gray-500 hover:text-red-500"
      }`}
    >
      {isSaved ? (
        <Heart className="h-4 w-4 fill-current" />
      ) : (
        <HeartOff className="h-4 w-4" />
      )}
    </Button>
  );
}
