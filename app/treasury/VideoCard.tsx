"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { ArrowUp, Share2, Play } from "lucide-react";
import { Video } from "@/app/types";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface VideoCardProps {
  video: Video;
  isUpvoted?: boolean;
  userId?: string;
  onUpvote?: (videoId: string) => void;
  variant?: "horizontal-card" | "vertical-card";
  type?: "fun" | "promises" | "best-moments";
  enableInternalUpvoteHandling?: boolean;
}

export default function VideoCard({
  video,
  isUpvoted = false,
  userId,
  onUpvote,
  variant = "horizontal-card",
  type = "fun",
  enableInternalUpvoteHandling = false,
}: VideoCardProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showPoster, setShowPoster] = useState(true);
  const [localIsUpvoted, setLocalIsUpvoted] = useState(isUpvoted);
  const [localUpvoteCount, setLocalUpvoteCount] = useState(
    video.upvoteCount + video.algorithmPoints
  );

  // Type-specific configurations (merged from EnhancedVideoCard)
  const getTypeConfig = () => {
    const configs = {
      fun: {
        aspectRatio: "aspect-[4/3]",
        bgColor: "bg-white",
        needsTimeControl: true,
      },
      promises: {
        aspectRatio: "aspect-[9/16]",
        bgColor: "bg-white",
        needsTimeControl: false,
      },
      "best-moments": {
        aspectRatio: "aspect-[4/3]",
        bgColor: "bg-green-50",
        needsTimeControl: true,
      },
    };
    return configs[type];
  };

  const config = getTypeConfig();

  // Determine aspect ratio based on video type or variant
  const getAspectRatio = () => {
    if (video.type === "promise" || type === "promises") {
      return "aspect-[9/16]";
    }
    return variant === "vertical-card" ? "aspect-[9/16]" : config.aspectRatio;
  };

  // Generate YouTube URL with parameters
  const getYouTubeEmbedUrl = () => {
    const url = `https://www.youtube.com/embed/${video.ytVideoId}?`;
    const params = new URLSearchParams({
      autoplay: "1",
      enablejsapi: "1",
      origin: window.location.origin,
      rel: "0", // Don't show related videos
      modestbranding: "1", // Minimal YouTube branding
    });

    // Add start/end times for videos that need time control
    if (config.needsTimeControl) {
      if (video.startTime) {
        params.set("start", video.startTime.toString());
      }
      if (video.endTime) {
        params.set("end", video.endTime.toString());
      }
    }

    return url + params.toString();
  };

  // Generate poster image URL
  const getPosterUrl = () => {
    return `https://img.youtube.com/vi/${video.ytVideoId}/maxresdefault.jpg`;
  };

  // YouTube player control functions (merged from EnhancedVideoCard)
  const sendPlayerCommand = (command: string) => {
    if (iframeRef.current && isLoaded) {
      const message = JSON.stringify({
        event: "command",
        func: command,
      });
      iframeRef.current.contentWindow?.postMessage(message, "*");
    }
  };

  const playVideo = () => {
    if (showPoster) {
      setShowPoster(false);
      return;
    }
    sendPlayerCommand("playVideo");
  };

  const seekTo = (seconds: number) => {
    if (iframeRef.current && isLoaded) {
      const message = JSON.stringify({
        event: "command",
        func: "seekTo",
        args: [seconds, true],
      });
      iframeRef.current.contentWindow?.postMessage(message, "*");
    }
  };

  // Handle poster click to load YouTube iframe
  const handlePosterClick = () => {
    playVideo();
  };

  // Handle iframe load
  const handleIframeLoad = () => {
    setIsLoaded(true);
    // If video has start time and needs time control, seek to start time
    if (config.needsTimeControl && video.startTime) {
      setTimeout(() => {
        seekTo(video.startTime!);
      }, 1000); // Wait a bit for player to be ready
    }
  };

  const handleUpvote = () => {
    if (!userId) {
      toast.error("უნდა იყოთ ავტორიზებული ვოუთის მისაცემად");
      return;
    }
    const wasUpvoted = localIsUpvoted;
    setLocalIsUpvoted(!wasUpvoted);
    setLocalUpvoteCount((prev) => prev + (wasUpvoted ? -1 : 1));

    if (enableInternalUpvoteHandling) {
      // Handle internally or call API
      toast.success(wasUpvoted ? "ვოუთი გაუქმებულია" : "ვოუთი მიცემულია!");
    } else {
      onUpvote?.(video.id);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(
        `https://www.youtube.com/watch?v=${video.ytVideoId}`
      );
      toast.success("ბმული დაკოპირდა!");
    } catch {
      toast.error("ბმულის კოპირება ვერ მოხერხდა");
    }
  };

  return (
    <div
      className={`relative flex h-full flex-col overflow-hidden rounded-xl shadow-sm ${config.bgColor}`}
    >
      <div className={`relative ${getAspectRatio()}`}>
        {showPoster ? (
          // Show poster image with UNIFIED custom play button
          <div
            className="group relative h-full w-full cursor-pointer"
            onClick={handlePosterClick}
          >
            <Image
              src={getPosterUrl()}
              alt={video.title}
              className="h-full w-full object-cover"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Play className="h-10 w-10 text-gray-100 opacity-80" />
            </div>
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            src={getYouTubeEmbedUrl()}
            title={video.title}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={handleIframeLoad}
          />
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h4 className="mb-3 h-12 overflow-hidden font-medium leading-snug text-gray-900">
          {video.title}
        </h4>

        {/* Show time info for time-controlled videos (merged from EnhancedVideoCard) */}
        {config.needsTimeControl && (video.startTime || video.endTime) && (
          <div className="mb-2 text-xs text-gray-500">
            {video.startTime && (
              <span>
                Start: {Math.floor(video.startTime / 3600)}:
                {Math.floor((video.startTime % 3600) / 60)
                  .toString()
                  .padStart(2, "0")}
                :{(video.startTime % 60).toString().padStart(2, "0")}
              </span>
            )}
            {video.startTime && video.endTime && <span> • </span>}
            {video.endTime && (
              <span>
                End: {Math.floor(video.endTime / 3600)}:
                {Math.floor((video.endTime % 3600) / 60)
                  .toString()
                  .padStart(2, "0")}
                :{(video.endTime % 60).toString().padStart(2, "0")}
              </span>
            )}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between gap-2">
          <button
            className="group flex h-8 flex-row-reverse items-center justify-end gap-x-2 overflow-hidden rounded-lg bg-gray-100 pl-2 transition-all duration-300 hover:bg-gray-200 hover:pr-2"
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
            className="h-8 w-8 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
