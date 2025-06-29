"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ArrowUp, Share2, Play } from "lucide-react";
import { Video } from "@/app/types";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear the timeout when the component unmounts
    return () => {
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
    };
  }, []);

  // Type-specific configurations (merged from EnhancedVideoCard)
  const getTypeConfig = () => {
    const configs = {
      fun: {
        aspectRatio: "aspect-[16/9]",
        needsTimeControl: true,
      },
      promises: {
        aspectRatio: "aspect-[9/16]",
        needsTimeControl: false,
      },
      "best-moments": {
        aspectRatio: "aspect-[16/9]",
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

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(
        `https://www.youtube.com/watch?v=${video.ytVideoId}`
      );
      toast.success("ბმული დაკოპირდა!");
    } catch {
      toast.error("ბმულის კოპირება ვერ მოხერხდა");
    }
  };

  const handleUpvoteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleUpvote();

    // Show tooltip for 1.5s to confirm action
    setIsTooltipOpen(true);
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }
    tooltipTimeoutRef.current = setTimeout(() => {
      setIsTooltipOpen(false);
    }, 1500);
  };

  return (
    <div
      className={`relative overflow-hidden rounded-xl shadow-lg ${getAspectRatio()}`}
      onClick={handlePosterClick}
    >
      {/* Video/Thumbnail Container */}
      <div className="h-full w-full">
        {showPoster ? (
          <div className="group relative h-full w-full cursor-pointer">
            <Image
              src={getPosterUrl()}
              alt={video.title}
              className="h-full w-full object-cover"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors group-hover:bg-black/20">
              <Play className="h-12 w-12 text-white drop-shadow-lg" />
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

      {/* Information Overlay - Only shows when poster is visible */}
      {showPoster && (
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-black/80 to-transparent p-3 text-white">
          {/* Left side: Title and time */}
          <div className="min-w-0 flex-1">
            {config.needsTimeControl && (video.startTime || video.endTime) && (
              <div className="mb-1 text-xs text-gray-300">
                {video.startTime && (
                  <span>
                    {Math.floor(video.startTime / 60)}:
                    {(video.startTime % 60).toString().padStart(2, "0")}
                  </span>
                )}
                {video.startTime && video.endTime && <span> - </span>}
                {video.endTime && (
                  <span>
                    {Math.floor(video.endTime / 60)}:
                    {(video.endTime % 60).toString().padStart(2, "0")}
                  </span>
                )}
              </div>
            )}
            {type !== "promises" && (
              <div
                className="font-semibold leading-tight [-webkit-box-orient:vertical] [-webkit-line-clamp:2] [display:-webkit-box] [overflow:hidden]"
                title={video.title}
              >
                {video.title}
              </div>
            )}
          </div>

          {/* Right side: Actions */}
          <div className="flex flex-shrink-0 items-center gap-2">
            <TooltipProvider>
              <Tooltip open={isTooltipOpen} onOpenChange={setIsTooltipOpen}>
                <TooltipTrigger asChild>
                  <button
                    className="group flex h-9 items-center justify-center rounded-full bg-white/20 px-3 transition-all duration-300 hover:bg-white/30"
                    onClick={handleUpvoteClick}
                  >
                    <ArrowUp
                      className={`h-5 w-5 shrink-0 transition-all duration-200 ${
                        localIsUpvoted ? "text-green-400" : "text-white"
                      }`}
                    />
                    <span className="min-w-[2ch] pl-1 text-left text-sm font-semibold tabular-nums">
                      {localUpvoteCount}
                    </span>
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{localIsUpvoted ? "მეტმა ნახოს!" : "მეტმა ნახოს?"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              className="h-9 w-9 rounded-full bg-white/20 text-white transition-colors hover:bg-white/30"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
