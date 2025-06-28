"use client";

import { useState } from "react";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";
import { Share2, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

import { Video } from "../types";
import { toast } from "sonner";

interface TreasuryVideoCardProps {
  video: Video;
  type: "roasts" | "promises" | "best-moments";
  userId?: string;
}

export default function TreasuryVideoCard({
  video,
  type,
  userId,
}: TreasuryVideoCardProps) {
  const [localUpvoteCount, setLocalUpvoteCount] = useState(
    video.upvoteCount + video.algorithmPoints
  );
  const [isUpvoted, setIsUpvoted] = useState(video.hasUpvoted || false);

  // Type-specific configurations
  const getTypeConfig = () => {
    const configs = {
      roasts: {
        aspectRatio: "aspect-[4/3]",
        aspectWidth: 4,
        aspectHeight: 3,
        bgColor: "bg-white",
      },
      promises: {
        aspectRatio: "aspect-[9/16]",
        aspectWidth: 9,
        aspectHeight: 16,
        bgColor: "bg-white",
      },
      "best-moments": {
        aspectRatio: "aspect-[4/3]",
        aspectWidth: 4,
        aspectHeight: 3,
        bgColor: "bg-green-50",
      },
    };
    return configs[type];
  };

  const config = getTypeConfig();

  const handleUpvote = async () => {
    if (!userId) {
      toast.error("უნდა იყოთ ავტორიზებული ვოუთის მისაცემად");
      return;
    }

    // Optimistic update
    const wasUpvoted = isUpvoted;
    setIsUpvoted(!wasUpvoted);
    setLocalUpvoteCount((prev) => prev + (wasUpvoted ? -1 : 1));

    try {
      // This would be replaced with actual API call
      // const result = await toggleVideoUpvote(video.id, userId);
      toast.success(wasUpvoted ? "ვოუთი გაუქმებულია" : "ვოუთი მიცემულია!");
    } catch {
      // Revert on error
      setIsUpvoted(wasUpvoted);
      setLocalUpvoteCount((prev) => prev + (wasUpvoted ? 1 : -1));
      toast.error("ვოუთის მიცემა ვერ მოხერხდა");
    }
  };

  const handleShare = async () => {
    const videoUrl = `https://www.youtube.com/watch?v=${video.ytVideoId}`;
    try {
      await navigator.clipboard.writeText(videoUrl);
      toast.success("ბმული დაკოპირდა!");
    } catch {
      toast.error("ბმულის კოპირება ვერ მოხერხდა");
    }
  };

  return (
    <div
      className={`relative overflow-hidden rounded-xl shadow-sm ${config.bgColor} h-full flex flex-col`}
    >
      {/* Video Container */}
      <div className={`relative ${config.aspectRatio}`}>
        <LiteYouTubeEmbed
          id={video.ytVideoId}
          title={video.title}
          aspectWidth={config.aspectWidth}
          aspectHeight={config.aspectHeight}
          poster="maxresdefault"
          onIframeAdded={() => {}}
        />
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <h4 className="font-medium text-gray-900 leading-snug mb-3 h-12 overflow-hidden">
          {video.title}
        </h4>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-2 mt-auto">
          <button
            className="group flex h-8 flex-row-reverse items-center justify-end gap-x-2 overflow-hidden rounded-lg bg-gray-100 hover:bg-gray-200 pl-2 transition-all duration-300 hover:pr-2"
            onClick={handleUpvote}
          >
            <span
              className={`mr-0 text-sm text-gray-900 whitespace-nowrap overflow-hidden transition-all duration-300 ${
                isUpvoted
                  ? "max-w-[120px] opacity-100 pr-2"
                  : "max-w-0 opacity-0 group-hover:max-w-[120px] group-hover:opacity-100"
              }`}
              style={{ transitionProperty: "max-width, opacity" }}
            >
              {isUpvoted ? "მეტმა ნახოს!" : "მეტმა ნახოს?"}
            </span>
            <ArrowUp
              className={`h-4 w-4 shrink-0 transition-colors duration-200 ${
                isUpvoted
                  ? "text-green-600"
                  : "text-gray-700 group-hover:text-gray-900"
              }`}
            />
            <span className="ml-0 text-xs font-medium text-gray-700">
              {localUpvoteCount}
            </span>
          </button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleShare}
            className="h-8 w-8 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
