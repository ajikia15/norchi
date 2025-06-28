"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Video } from "../types";
import VideoCard from "./VideoCard";

interface VideoSliderProps {
  title: string;
  videos: Video[];
  type: "fun" | "promises" | "best-moments";
  userId?: string;
  viewAllHref: string;
}

export default function VideoSlider({
  title,
  videos,
  type,
  userId,
  viewAllHref,
}: VideoSliderProps) {
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  // Configure slides to scroll based on type and screen size
  const getSlidesToScroll = () => {
    if (typeof window === "undefined") return 1;
    const width = window.innerWidth;

    if (width < 768) return 1; // Mobile: 1 slide
    if (type === "promises") {
      return width < 1024 ? 2 : 3; // Tablet: 2, Desktop: 3 (for 9:16 aspect)
    }
    return width < 1024 ? 2 : 3; // Tablet: 2, Desktop: 3 (for 4:3 aspect)
  };

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: getSlidesToScroll(),
    skipSnaps: false,
    loop: false,
    containScroll: "trimSnaps",
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Get card width based on type
  const getCardWidth = () => {
    switch (type) {
      case "promises":
        return "basis-[200px] md:basis-[220px] lg:basis-[240px]";
      case "fun":
      case "best-moments":
        return "basis-[280px] md:basis-[300px] lg:basis-[320px]";
      default:
        return "basis-[280px]";
    }
  };

  if (videos.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-500">No {title.toLowerCase()} available yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-green-600">{title}</h3>
        <div className="flex items-center gap-2">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              className="text-green-600 hover:bg-green-50 disabled:opacity-30"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={scrollNext}
              disabled={!canScrollNext}
              className="text-green-600 hover:bg-green-50 disabled:opacity-30"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
          <Button
            variant="link"
            className="text-sm text-green-600 underline-offset-4 hover:underline"
            onClick={() => (window.location.href = viewAllHref)}
          >
            View All
          </Button>
        </div>
      </div>

      {/* Slider - Now using ONLY VideoCard for unified play button experience */}
      <div className="embla__fade overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {videos.map((video) => (
            <div
              key={video.id}
              className={`${getCardWidth()} min-w-0 flex-none`}
            >
              <VideoCard
                video={video}
                variant="horizontal-card"
                type={type}
                userId={userId}
                enableInternalUpvoteHandling={true}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
