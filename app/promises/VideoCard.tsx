"use client";

import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";
import { ArrowUp, Share2 } from "lucide-react";
import { useState } from "react";
import { VideoPromise } from "@/app/types";
import { Button } from "@/components/ui/button";

interface VideoCardProps {
  videoPromise: VideoPromise;
  isUpvoted?: boolean;
  onUpvote?: (videoPromiseId: string) => void;
}

export default function VideoCard({
  videoPromise,
  isUpvoted = false,
  onUpvote,
}: VideoCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoId = videoPromise.ytVideoId;
  const totalUpvotes = videoPromise.upvoteCount + videoPromise.algorithmPoints;

  // Extract playlist if present
  function extractPlaylistId(urlOrId: string): string | null {
    const match = urlOrId.match(/[?&]list=([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  }
  const playlistId = extractPlaylistId(videoPromise.ytVideoId);

  // Generate shareable link
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}${
    playlistId ? `&list=${playlistId}` : ""
  }`;

  const handleUpvote = () => {
    if (onUpvote) {
      onUpvote(videoPromise.id);
    }
  };

  // Custom gradient overlay style (black)
  const gradientOverlay =
    "absolute top-0 left-0 w-full z-10 px-4 py-6 flex items-start " +
    "bg-gradient-to-b from-black/80 via-black/40 to-black/0";

  // Copy to clipboard handler
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(videoUrl);
    } catch {
      // fallback: alert
      alert("ბმული დაკოპირდა: " + videoUrl);
    }
  };

  return (
    <div className="relative mx-auto w-full overflow-hidden rounded-xl border shadow-sm">
      <div className="relative aspect-[9/16] w-full">
        {/* Title Overlay */}
        {!isPlaying && (
          <div
            className={gradientOverlay}
            style={{ transition: "opacity 0.3s" }}
          >
            <span className="w-full whitespace-pre-line break-words text-base text-white">
              {videoPromise.title}
            </span>
          </div>
        )}
        {/* Vertical Action Buttons */}
        <div className="absolute bottom-12 left-0 z-20 flex flex-col gap-0">
          <button
            onClick={handleUpvote}
            className={`group pointer-events-auto flex h-10 items-center overflow-hidden rounded-r-lg bg-white pl-3 pr-3 transition-all duration-300`}
          >
            <ArrowUp
              className={`h-5 w-5 shrink-0 transition-colors duration-200 ${
                isUpvoted
                  ? "text-green-500"
                  : "text-gray-700 group-hover:text-gray-900"
              }`}
            />
            <span className="ml-2 text-xs font-normal text-gray-700">
              {totalUpvotes}
            </span>
            <span
              className={`ml-2 text-sm text-gray-900 whitespace-nowrap overflow-hidden
                transition-all duration-300
                ${
                  isUpvoted
                    ? "max-w-[120px] opacity-100"
                    : "max-w-0 opacity-0 group-hover:max-w-[120px] group-hover:opacity-100"
                }
              `}
              style={{ transitionProperty: "max-width, opacity" }}
            >
              {isUpvoted ? "მეტმა ნახოს!" : "მეტმა ნახოს?"}
            </span>
          </button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleShare}
            title="ბმულის გაზიარება"
            className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-l-none rounded-tr-none bg-white hover:bg-white"
          >
            <Share2 className="h-5 w-5 text-gray-700" />
          </Button>
        </div>
        <LiteYouTubeEmbed
          id={videoId}
          title={videoPromise.title}
          aspectWidth={9}
          aspectHeight={16}
          poster="maxresdefault"
          onIframeAdded={() => setIsPlaying(true)}
        />
      </div>
    </div>
  );
}
