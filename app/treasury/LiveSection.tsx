"use client";

import { useState, useEffect, useCallback } from "react";
import { PlayCircle, AlertCircle, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LiveStreamStatus {
  isLive: boolean;
  isLoading: boolean;
  error: string | null;
  viewerCount?: number;
  streamTitle?: string;
}

export default function LiveSection() {
  const [streamStatus, setStreamStatus] = useState<LiveStreamStatus>({
    isLive: false,
    isLoading: true,
    error: null,
  });
  const [nextStreamTime, setNextStreamTime] = useState<Date | null>(null);
  const [timeUntilNext, setTimeUntilNext] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Your YouTube channel ID - replace with your actual channel ID
  const CHANNEL_ID = "UC6o6176a756vk1nZuzAXy5g";

  // YouTube Data API key - you'll need to set this in your environment variables
  const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

  const checkLiveStatus = useCallback(async () => {
    if (!API_KEY) {
      console.warn(
        "YouTube API key not configured. Using fallback detection method."
      );
      // Fallback: assume live and let iframe error handling determine actual status
      setStreamStatus({
        isLive: true,
        isLoading: false,
        error: null,
      });
      return;
    }

    try {
      setStreamStatus((prev) => ({ ...prev, isLoading: true, error: null }));

      // First, get the channel's live streams
      const searchResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/search?` +
          `part=snippet&channelId=${CHANNEL_ID}&eventType=live&type=video&key=${API_KEY}`
      );

      if (!searchResponse.ok) {
        throw new Error(`API Error: ${searchResponse.status}`);
      }

      const searchData = await searchResponse.json();

      if (searchData.items && searchData.items.length > 0) {
        // Get detailed info about the live stream
        const videoId = searchData.items[0].id.videoId;
        const videoResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?` +
            `part=snippet,liveStreamingDetails,statistics&id=${videoId}&key=${API_KEY}`
        );

        if (videoResponse.ok) {
          const videoData = await videoResponse.json();
          const video = videoData.items[0];

          if (
            video?.liveStreamingDetails?.actualStartTime &&
            !video?.liveStreamingDetails?.actualEndTime
          ) {
            // Stream is actually live
            setStreamStatus({
              isLive: true,
              isLoading: false,
              error: null,
              viewerCount: parseInt(
                video.liveStreamingDetails.concurrentViewers || "0"
              ),
              streamTitle: video.snippet.title,
            });
            return;
          }
        }
      }

      // No active live stream found
      setStreamStatus({
        isLive: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error("Error checking live status:", error);
      setStreamStatus({
        isLive: false,
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to check live status",
      });
    }
  }, [API_KEY, CHANNEL_ID]);

  // Alternative method: Check iframe load status
  const [iframeError, setIframeError] = useState(false);
  const [embedAttempted, setEmbedAttempted] = useState(false);

  const handleIframeLoad = useCallback(() => {
    setIframeError(false);
    console.log("YouTube iframe loaded successfully");
  }, []);

  const handleIframeError = useCallback(() => {
    setIframeError(true);
    console.log("YouTube iframe failed to load");
    // If iframe fails to load, mark as not live
    setStreamStatus((prev) => ({ ...prev, isLive: false }));
  }, []);

  // Enhanced iframe error detection using message events
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Listen for YouTube iframe messages
      if (event.origin !== "https://www.youtube.com") return;

      try {
        const data = JSON.parse(event.data);
        if (data.event === "video-error" || data.event === "onError") {
          console.log("YouTube player error detected via postMessage");
          setIframeError(true);
          setStreamStatus((prev) => ({ ...prev, isLive: false }));
        }
      } catch {
        // Ignore non-JSON messages
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Timeout fallback: if embed is attempted but no load/error events fire
  useEffect(() => {
    if (!embedAttempted) return;

    const timeout = setTimeout(() => {
      if (!iframeError && streamStatus.isLive) {
        console.log("YouTube embed timeout - assuming stream unavailable");
        setIframeError(true);
        setStreamStatus((prev) => ({ ...prev, isLive: false }));
      }
    }, 10000); // 10 second timeout

    return () => clearTimeout(timeout);
  }, [embedAttempted, iframeError, streamStatus.isLive]);

  // Check live status on mount and periodically
  useEffect(() => {
    checkLiveStatus();
    const interval = setInterval(checkLiveStatus, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [checkLiveStatus]);

  // Calculate next stream time and countdown
  useEffect(() => {
    const calculateNextStream = () => {
      const now = new Date();
      const today = new Date(now);

      // Set to next 10 AM or 8 PM
      const morning = new Date(today.setHours(10, 0, 0, 0));
      const evening = new Date(today.setHours(20, 0, 0, 0));

      let nextStream: Date;
      if (now < morning) {
        nextStream = morning;
      } else if (now < evening) {
        nextStream = evening;
      } else {
        // Next day 10 AM
        nextStream = new Date(today.setDate(today.getDate() + 1));
        nextStream.setHours(10, 0, 0, 0);
      }

      setNextStreamTime(nextStream);
    };

    calculateNextStream();
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!nextStreamTime || streamStatus.isLive) return;

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = nextStreamTime.getTime() - now;

      if (distance > 0) {
        setTimeUntilNext({
          hours: Math.floor(distance / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [nextStreamTime, streamStatus.isLive]);

  const formatTime = (value: number) => value.toString().padStart(2, "0");

  const renderVideoPlayer = () => {
    if (streamStatus.isLoading) {
      return (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-white"></div>
            <span className="text-sm text-white/60">
              Checking live status...
            </span>
          </div>
        </div>
      );
    }

    if (streamStatus.error && API_KEY) {
      return (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
          <div className="flex flex-col items-center gap-2 px-4 text-center">
            <AlertCircle className="h-12 w-12 text-red-400" />
            <span className="text-sm text-white/80">
              Unable to check live status
            </span>
            <span className="text-xs text-white/60">{streamStatus.error}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={checkLiveStatus}
              className="mt-2"
            >
              Retry
            </Button>
          </div>
        </div>
      );
    }

    if (streamStatus.isLive && !iframeError) {
      return (
        <div className="relative h-full w-full">
          <iframe
            src={`https://www.youtube.com/embed/live_stream?channel=${CHANNEL_ID}&autoplay=1&enablejsapi=1`}
            className="h-full w-full"
            allow="autoplay; encrypted-media"
            title="Live Stream"
            onLoad={() => {
              handleIframeLoad();
              setEmbedAttempted(true);
            }}
            onError={handleIframeError}
          />

          {/* Loading overlay for initial load */}
          {!embedAttempted && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-white"></div>
            </div>
          )}
        </div>
      );
    }

    if (iframeError) {
      return (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
          <div className="p-4 text-center text-white">
            <AlertCircle className="mx-auto mb-2 h-12 w-12 text-red-400" />
            <p className="mb-2 text-sm">Live stream is not available</p>
            <p className="mb-4 text-xs text-white/60">
              The stream may have ended or not started yet
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIframeError(false);
                setEmbedAttempted(false);
                checkLiveStatus();
              }}
              className="mt-2"
            >
              Check Again
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
        <PlayCircle className="h-16 w-16 text-white/60" />
      </div>
    );
  };

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[1fr_1.2fr]">
      {/* Left: Video Player */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-black shadow-lg">
        {renderVideoPlayer()}
      </div>

      {/* Right: Info Panel */}
      <div className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-xl">
        <h2 className="text-3xl font-bold text-gray-800">
          არ გელაპარაკება შენი პარტია?
        </h2>
        <p className="mt-2 text-xl font-semibold text-green-600">
          გირჩი დაგელაპარაკება.
        </p>

        {/* This is the section that will change */}
        <div className="my-8 flex flex-grow flex-col items-center justify-center rounded-lg bg-gray-50 p-6">
          {streamStatus.isLive && !iframeError ? (
            // LIVE STATE: Big badge
            <div className="inline-flex items-center justify-center gap-4 rounded-full bg-red-500 px-12 py-6 text-2xl font-bold text-white shadow-lg">
              <Radio className="h-10 w-10 animate-pulse" />
              <span>LIVE</span>
            </div>
          ) : (
            // OFFLINE STATE: Countdown timer
            <>
              <p className="font-semibold uppercase tracking-wide text-gray-600">
                Don&apos;t Miss Our Next Live
              </p>
              <div className="mt-4 flex items-baseline space-x-2">
                <div className="text-6xl font-bold tabular-nums text-gray-900">
                  {formatTime(timeUntilNext.hours)}
                </div>
                <div className="text-4xl text-gray-400">:</div>
                <div className="text-6xl font-bold tabular-nums text-gray-900">
                  {formatTime(timeUntilNext.minutes)}
                </div>
                <div className="text-4xl text-gray-400">:</div>
                <div className="text-6xl font-bold tabular-nums text-gray-900">
                  {formatTime(timeUntilNext.seconds)}
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                ყოველ სამუშაო დღეს - დილას 10:00-ზე და საღამოს 20:00-ზე
              </p>
            </>
          )}
        </div>

        <div className="mt-auto">
          <p className="text-gray-600">
            {streamStatus.isLive && !iframeError
              ? "Get your questions answered now. Call us live:"
              : "Get your questions ready. Call us live:"}
          </p>
          <div className="mt-2 inline-block rounded-lg border-2 border-dashed border-green-200 bg-green-100 px-6 py-3 font-mono text-2xl text-green-800">
            📞 598 36 36 36
          </div>
        </div>
      </div>
    </div>
  );
}
