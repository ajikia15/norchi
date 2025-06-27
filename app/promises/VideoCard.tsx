"use client";

import { YouTubeEmbed } from "react-social-media-embed";

interface VideoCardProps {
  videoId?: string;
}

export default function VideoCard({ videoId = "sfOxCDr4ZoI" }: VideoCardProps) {
  const videoUrl = `https://youtube.com/shorts/${videoId}`;

  return (
    <div className="bg-card mx-auto w-fit overflow-hidden rounded-xl border shadow-sm">
      <YouTubeEmbed
        url={videoUrl}
        width={325}
        height={578} // 9:16 aspect ratio for shorts
      />
    </div>
  );
}
