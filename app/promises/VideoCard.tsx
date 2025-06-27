"use client";

import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";
import { ArrowUp, Share2 } from "lucide-react";
import { useState, useEffect } from "react";
import { VideoPromise } from "@/app/types";
import { Button } from "@/components/ui/button";

interface VideoCardProps {
  videoPromise: VideoPromise;
  isUpvoted?: boolean;
  onUpvote?: (videoPromiseId: string) => void;
  onVideoPlay?: (videoPromiseId: string) => void;
  onVideoStop?: (videoPromiseId: string) => void;
  currentlyPlayingVideo?: string | null;
}

export default function VideoCard({
  videoPromise,
  isUpvoted = false,
  onUpvote,
  onVideoPlay,
  onVideoStop,
  currentlyPlayingVideo,
}: VideoCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [shouldReset, setShouldReset] = useState(0); // Force component reset
  const videoId = videoPromise.ytVideoId;
  const totalUpvotes = videoPromise.upvoteCount + videoPromise.algorithmPoints;

  // Effect to stop this video if another video starts playing
  useEffect(() => {
    if (
      currentlyPlayingVideo &&
      currentlyPlayingVideo !== videoPromise.id &&
      isPlaying
    ) {
      // Reset this video component to stop playback
      setIsPlaying(false);
      setShouldReset((prev) => prev + 1); // Force component reset
      onVideoStop?.(videoPromise.id);
    }
  }, [currentlyPlayingVideo, videoPromise.id, isPlaying, onVideoStop]);

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

  // Handle when iframe is added (video player is loaded)
  const handleIframeAdded = () => {
    setIsPlaying(true);
    onVideoPlay?.(videoPromise.id);
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
        <div className="absolute right-0 top-24 z-20 flex flex-col items-end gap-0">
          <button
            className={`group pointer-events-auto flex h-10 flex-row-reverse items-center justify-end gap-x-2 overflow-hidden rounded-l-lg bg-white pl-2 transition-all duration-300 hover:pr-2`}
            onClick={handleUpvote}
          >
            <span
              className={`mr-0 text-sm text-gray-900 whitespace-nowrap overflow-hidden
                transition-all duration-300 
                ${
                  isUpvoted
                    ? "max-w-[120px] opacity-100 pr-2"
                    : "max-w-0 opacity-0 group-hover:max-w-[120px] group-hover:opacity-100"
                }
              `}
              style={{ transitionProperty: "max-width, opacity" }}
            >
              {isUpvoted ? "მეტმა ნახოს!" : "მეტმა ნახოს?"}
            </span>
            <ArrowUp
              className={`h-5 w-5 shrink-0 transition-colors duration-200 ${
                isUpvoted
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
          key={`${videoId}-${shouldReset}`} // Force re-render when shouldReset changes
          id={videoId}
          title={videoPromise.title}
          aspectWidth={9}
          aspectHeight={16}
          poster="maxresdefault"
          onIframeAdded={handleIframeAdded}
        />
      </div>
    </div>
  );
}
