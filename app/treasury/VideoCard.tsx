"use client";

import CustomYouTubeEmbed from "./CustomYouTubeEmbed";
import { ArrowUp, Share2 } from "lucide-react";
import { useState } from "react";
import { Video } from "@/app/types";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface VideoCardProps {
  video: Video;
  isUpvoted?: boolean;
  userId?: string;
  onUpvote?: (videoId: string) => void;
}

export default function VideoCard({
  video,
  isUpvoted = false,
  userId,
  onUpvote,
}: VideoCardProps) {
  const [localIsUpvoted, setLocalIsUpvoted] = useState(isUpvoted);
  const [localUpvoteCount, setLocalUpvoteCount] = useState(
    video.upvoteCount + video.algorithmPoints
  );

  const aspectRatio = video.type === "promise" ? "aspect-[9/16]" : "aspect-[16/9]";

  const handleUpvote = () => {
    if (!userId) {
      toast.error("უნდა იყოთ ავტორიზებული ვოუთის მისაცემად");
      return;
    }
    setLocalIsUpvoted((prev) => !prev);
    setLocalUpvoteCount((prev) => prev + (localIsUpvoted ? -1 : 1));
    onUpvote?.(video.id);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(`https://www.youtube.com/watch?v=${video.ytVideoId}`);
      toast.success("ბმული დაკოპირდა!");
    } catch {
      toast.error("ბმულის კოპირება ვერ მოხერხდა");
    }
  };

  return (
    <div className="relative overflow-hidden rounded-xl shadow-sm bg-white h-full flex flex-col">
      <div className={`relative ${aspectRatio}`}>
        <CustomYouTubeEmbed
          id={video.ytVideoId}
          title={video.title}
          poster="maxresdefault"
          onIframeAdded={() => {}}
        />
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h4 className="font-medium text-gray-900 leading-snug mb-3 h-12 overflow-hidden">
          {video.title}
        </h4>
        <div className="flex items-center justify-between gap-2 mt-auto">
          <button
            className="group flex h-8 flex-row-reverse items-center justify-end gap-x-2 overflow-hidden rounded-lg bg-gray-100 hover:bg-gray-200 pl-2 transition-all duration-300 hover:pr-2"
            onClick={handleUpvote}
          >
            <span
              className={`mr-0 text-sm text-gray-900 whitespace-nowrap overflow-hidden transition-all duration-300 ${
                localIsUpvoted
                  ? "max-w-[120px] opacity-100 pr-2"
                  : "max-w-0 opacity-0 group-hover:max-w-[120px] group-hover:opacity-100"
              }`}
              style={{ transitionProperty: "max-width, opacity" }}
            >
              {localIsUpvoted ? "მეტმა ნახოს!" : "მეტმა ნახოს?"}
            </span>
            <ArrowUp
              className={`h-4 w-4 shrink-0 transition-colors duration-200 ${
                localIsUpvoted
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
