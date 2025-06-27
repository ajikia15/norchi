"use client";

import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";
import { ArrowUp } from "lucide-react";
import { useState } from "react";
import Marquee from "react-fast-marquee";
import { VideoPromise } from "@/app/types";

interface VideoCardProps {
  videoPromise: VideoPromise;
  isUpvoted?: boolean;
  onUpvote?: (videoPromiseId: string) => void;
}

function extractYouTubeId(urlOrId: string): string {
  // If it's already a plain ID (11 chars, no slashes), return as is
  if (/^[a-zA-Z0-9_-]{11}$/.test(urlOrId)) return urlOrId;
  // Try to extract from various YouTube URL formats
  const match = urlOrId.match(
    /(?:youtube\.com\/(?:.*v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : urlOrId;
}

export default function VideoCard({
  videoPromise,
  isUpvoted = false,
  onUpvote,
}: VideoCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const videoId = extractYouTubeId(videoPromise.ytVideoId);
  const totalUpvotes = videoPromise.upvoteCount + videoPromise.algorithmPoints;

  const handleUpvote = () => {
    if (onUpvote) {
      onUpvote(videoPromise.id);
    }
  };

  return (
    <div
      className="bg-card relative mx-auto w-full overflow-hidden rounded-xl border shadow-sm"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-[9/16] w-full">
        <LiteYouTubeEmbed
          id={videoId}
          title={videoPromise.title}
          aspectWidth={9}
          aspectHeight={16}
          poster="maxresdefault"
        />
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between border-t bg-white px-4 py-3">
        {/* Left side - Marquee title */}
        <div className="mr-4 flex-1 overflow-hidden">
          {isHovered ? (
            <Marquee speed={50} gradient={false}>
              <span className="pr-8 text-sm font-medium text-gray-900">
                {videoPromise.title}
              </span>
            </Marquee>
          ) : (
            <div className="truncate text-sm font-medium text-gray-900">
              {videoPromise.title}
            </div>
          )}
        </div>

        {/* Right side - Upvote button */}
        <button
          onClick={handleUpvote}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            isUpvoted
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <ArrowUp
            className={`h-4 w-4 ${
              isUpvoted ? "text-green-600" : "text-gray-600"
            }`}
          />
          <span className="hidden sm:inline">
            {isUpvoted ? "მეტმა ნახოს!" : "მეტმა ნახოს?"}
          </span>
          <span className="text-xs text-gray-500">{totalUpvotes}</span>
        </button>
      </div>
    </div>
  );
}
