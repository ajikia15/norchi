"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ArrowUp, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Video } from "@/app/types";

interface EnhancedVideoCardProps {
  video: Video;
  type: "fun" | "promises" | "best-moments";
  userId?: string;
  enableInternalUpvoteHandling?: boolean;
}

export default function EnhancedVideoCard({
  video,
  type,
  userId,
  enableInternalUpvoteHandling = false,
}: EnhancedVideoCardProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showPoster, setShowPoster] = useState(true);

  // State for internal upvote handling
  const [localUpvoteCount, setLocalUpvoteCount] = useState(
    video.upvoteCount + video.algorithmPoints
  );
  const [localIsUpvoted, setLocalIsUpvoted] = useState(
    enableInternalUpvoteHandling ? video.hasUpvoted || false : false
  );

  // Type-specific configurations
  const getTypeConfig = () => {
    const configs = {
      fun: {
        aspectRatio: "aspect-[4/3]",
        aspectWidth: 4,
        aspectHeight: 3,
        bgColor: "bg-white",
        needsTimeControl: true,
      },
      promises: {
        aspectRatio: "aspect-[9/16]",
        aspectWidth: 9,
        aspectHeight: 16,
        bgColor: "bg-white",
        needsTimeControl: false, // 9:16 videos don't need time control
      },
      "best-moments": {
        aspectRatio: "aspect-[4/3]",
        aspectWidth: 4,
        aspectHeight: 3,
        bgColor: "bg-green-50",
        needsTimeControl: true,
      },
    };
    return configs[type];
  };

  const config = getTypeConfig();

  // Generate YouTube URL with start/end times
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

  // YouTube player control functions
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

  // Handle poster click
  const handlePosterClick = () => {
    playVideo();
  };

  // Handle upvote
  const handleUpvote = async () => {
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
  };

  // Handle share
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
        {showPoster ? (
          // Show poster image
          <div
            className="relative cursor-pointer group w-full h-full"
            onClick={handlePosterClick}
          >
            <Image
              src={getPosterUrl()}
              alt={video.title}
              className="w-full h-full object-cover"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
              <div className="bg-red-600 hover:bg-red-700 transition-colors rounded-full p-4">
                <svg
                  className="w-8 h-8 text-white ml-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
        ) : (
          // Show YouTube iframe
          <iframe
            ref={iframeRef}
            src={getYouTubeEmbedUrl()}
            title={video.title}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={handleIframeLoad}
          />
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <h4 className="font-medium text-gray-900 leading-snug mb-3 h-12 overflow-hidden">
          {video.title}
        </h4>

        {/* Show time info for time-controlled videos */}
        {config.needsTimeControl && (video.startTime || video.endTime) && (
          <div className="text-xs text-gray-500 mb-2">
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

        {/* Action Buttons */}
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
