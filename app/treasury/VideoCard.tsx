"use client";

import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";
import { ArrowUp, Share2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Video } from "@/app/types";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type VideoCardVariant = "vertical-overlay" | "horizontal-card";
type VideoType = "roasts" | "promises" | "best-moments";

interface VideoCardProps {
  video: Video;
  variant?: VideoCardVariant;
  type?: VideoType;
  isUpvoted?: boolean;
  userId?: string;
  // Callback-based upvote handling (for external state management)
  onUpvote?: (videoId: string) => void;
  // Video playback control (for vertical-overlay variant)
  onVideoPlay?: (videoId: string) => void;
  onVideoStop?: (videoId: string) => void;
  currentlyPlayingVideo?: string | null;
  // Internal upvote handling (for horizontal-card variant)
  enableInternalUpvoteHandling?: boolean;
}

export default function VideoCard({
  video,
  variant = "vertical-overlay",
  type = "promises",
  isUpvoted = false,
  userId,
  onUpvote,
  onVideoPlay,
  onVideoStop,
  currentlyPlayingVideo,
  enableInternalUpvoteHandling = false,
}: VideoCardProps) {
  // State for video playback (vertical-overlay variant)
  const [isPlaying, setIsPlaying] = useState(false);
  const [shouldReset, setShouldReset] = useState(0);
  
  // State for internal upvote handling (horizontal-card variant)
  const [localUpvoteCount, setLocalUpvoteCount] = useState(
    video.upvoteCount + video.algorithmPoints
  );
  const [localIsUpvoted, setLocalIsUpvoted] = useState(
    enableInternalUpvoteHandling ? (video.hasUpvoted || false) : isUpvoted
  );

  const videoId = video.ytVideoId;
  const totalUpvotes = enableInternalUpvoteHandling 
    ? localUpvoteCount 
    : video.upvoteCount + video.algorithmPoints;

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

  // Effect to stop this video if another video starts playing (vertical-overlay variant)
  useEffect(() => {
    if (
      variant === "vertical-overlay" &&
      currentlyPlayingVideo &&
      currentlyPlayingVideo !== video.id &&
      isPlaying
    ) {
      setIsPlaying(false);
      setShouldReset((prev) => prev + 1);
      onVideoStop?.(video.id);
    }
  }, [currentlyPlayingVideo, video.id, isPlaying, onVideoStop, variant]);

  // Extract playlist if present
  function extractPlaylistId(urlOrId: string): string | null {
    const match = urlOrId.match(/[?&]list=([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  }

  const playlistId = extractPlaylistId(video.ytVideoId);

  // Generate shareable link
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}${
    playlistId ? `&list=${playlistId}` : ""
  }`;

  // Handle upvote
  const handleUpvote = async () => {
    if (enableInternalUpvoteHandling) {
      // Internal upvote handling for horizontal-card variant
      if (!userId) {
        toast.error("უნდა იყოთ ავტორიზებული ვოუთის მისაცემად");
        return;
      }

      const wasUpvoted = localIsUpvoted;
      setLocalIsUpvoted(!wasUpvoted);
      setLocalUpvoteCount((prev) => prev + (wasUpvoted ? -1 : 1));

      try {
        // This would be replaced with actual API call
        // const result = await toggleVideoUpvote(video.id, userId);
        toast.success(wasUpvoted ? "ვოუთი გაუქმებულია" : "ვოუთი მიცემულია!");
      } catch {
        // Revert on error
        setLocalIsUpvoted(wasUpvoted);
        setLocalUpvoteCount((prev) => prev + (wasUpvoted ? 1 : -1));
        toast.error("ვოუთის მიცემა ვერ მოხერხდა");
      }
    } else {
      // External upvote handling for vertical-overlay variant
      if (onUpvote) {
        onUpvote(video.id);
      }
    }
  };

  // Handle when iframe is added (video player is loaded)
  const handleIframeAdded = () => {
    if (variant === "vertical-overlay") {
      setIsPlaying(true);
      onVideoPlay?.(video.id);
    }
  };

  // Copy to clipboard handler
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(videoUrl);
      if (variant === "horizontal-card") {
        toast.success("ბმული დაკოპირდა!");
      }
    } catch {
      if (variant === "vertical-overlay") {
        alert("ბმული დაკოპირდა: " + videoUrl);
      } else {
        toast.error("ბმულის კოპირება ვერ მოხერხდა");
      }
    }
  };

  const currentIsUpvoted = enableInternalUpvoteHandling ? localIsUpvoted : isUpvoted;

  // Render vertical overlay variant (original VideoCard)
  if (variant === "vertical-overlay") {
    const gradientOverlay =
      "absolute top-0 left-0 w-full z-10 px-4 py-6 flex items-start " +
      "bg-gradient-to-b from-black/80 via-black/40 to-black/0";

    return (
      <div className="relative mx-auto w-full overflow-hidden rounded-xl border shadow-sm">
        <div className="relative aspect-[9/16] w-full">
          {/* Title Overlay */}
          {!isPlaying && (
            <div
              className={gradientOverlay}
              style={{ transition: "opacity 0.3s" }}
            >
              <span className="line-clamp-2 w-full whitespace-pre-line break-words text-base text-white">
                {video.title}
              </span>
            </div>
          )}
          
          {/* Vertical Action Buttons */}
          <div className="absolute right-0 top-24 z-20 flex flex-col items-end gap-0">
            <button
              className="group pointer-events-auto flex h-10 flex-row-reverse items-center justify-end gap-x-2 overflow-hidden rounded-l-lg bg-white pl-2 transition-all duration-300 hover:pr-2"
              onClick={handleUpvote}
            >
              <span
                className={`mr-0 text-sm text-gray-900 whitespace-nowrap overflow-hidden transition-all duration-300 ${
                  currentIsUpvoted
                    ? "max-w-[120px] opacity-100 pr-2"
                    : "max-w-0 opacity-0 group-hover:max-w-[120px] group-hover:opacity-100"
                }`}
                style={{ transitionProperty: "max-width, opacity" }}
              >
                {currentIsUpvoted ? "მეტმა ნახოს!" : "მეტმა ნახოს?"}
              </span>
              <ArrowUp
                className={`h-5 w-5 shrink-0 transition-colors duration-200 ${
                  currentIsUpvoted
                    ? "text-green-500"
                    : "text-gray-700 group-hover:text-gray-900"
                }`}
              />
              <span className="ml-0 text-xs font-normal text-gray-700">
                {totalUpvotes}
              </span>
            </button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              title="ბმულის გაზიარება"
              className="pointer-events-auto flex h-10 w-10 items-center justify-center self-end rounded-r-none rounded-tl-none bg-white"
            >
              <Share2 className="h-5 w-5 text-gray-700" />
            </Button>
          </div>
          
          <LiteYouTubeEmbed
            key={`${videoId}-${shouldReset}`}
            id={videoId}
            title={video.title}
            aspectWidth={9}
            aspectHeight={16}
            poster="maxresdefault"
            onIframeAdded={handleIframeAdded}
          />
        </div>
      </div>
    );
  }

  // Render horizontal card variant (original TreasuryVideoCard)
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
                currentIsUpvoted
                  ? "max-w-[120px] opacity-100 pr-2"
                  : "max-w-0 opacity-0 group-hover:max-w-[120px] group-hover:opacity-100"
              }`}
              style={{ transitionProperty: "max-width, opacity" }}
            >
              {currentIsUpvoted ? "მეტმა ნახოს!" : "მეტმა ნახოს?"}
            </span>
            <ArrowUp
              className={`h-4 w-4 shrink-0 transition-colors duration-200 ${
                currentIsUpvoted
                  ? "text-green-600"
                  : "text-gray-700 group-hover:text-gray-900"
              }`}
            />
            <span className="ml-0 text-xs font-medium text-gray-700">
              {totalUpvotes}
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
