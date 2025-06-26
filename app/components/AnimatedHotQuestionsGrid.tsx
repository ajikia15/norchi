"use client";

import { useState, useEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { HotTopic } from "../types";

import HotQuestionCardSkeleton from "./HotQuestionCardSkeleton";

import AnimatedHotQuestionCard from "./AnimatedHotQuestionCard";
import BaseHotQuestionCard from "./BaseHotQuestionCard";

interface AnimatedHotQuestionsGridProps {
  topics: HotTopic[];
  user?: { id: string } | null;
}

/**
 * Animated grid component for hot questions with responsive layout.
 * Features beautiful entrance animations, mobile carousel, and desktop grid layout.
 * Restored intersection observer animations for optimal user experience.
 */
export default function AnimatedHotQuestionsGrid({
  topics,
  user,
}: AnimatedHotQuestionsGridProps) {
  const [mobile, setMobile] = useState<boolean | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Embla Carousel setup with autoplay
  const autoplayRef = useRef(
    Autoplay({
      delay: 3500,
      stopOnInteraction: true,
      stopOnMouseEnter: true,
      stopOnFocusIn: true,
    })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "center",
      skipSnaps: false,
      dragFree: false,
      containScroll: "trimSnaps",
      slidesToScroll: 1,
    },
    mobile === true ? [autoplayRef.current] : []
  );

  useEffect(() => {
    // Use media query for mobile detection to avoid hydration mismatches
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const isMobileDevice = mediaQuery.matches;
    setMobile(isMobileDevice);

    // Brief delay to ensure smooth initial render
    setTimeout(() => setIsLoading(false), 100);

    // Listen for media query changes
    const handleChange = (e: MediaQueryListEvent) => {
      setMobile(e.matches);
    };
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Carousel control effects
  useEffect(() => {
    if (mobile === true && emblaApi && !isLoading) {
      autoplayRef.current.play();
    }
  }, [mobile, emblaApi, isLoading]);

  useEffect(() => {
    if (mobile === true && emblaApi && !isLoading) {
      const onSelect = () => {
        setSelectedIndex(emblaApi.selectedScrollSnap());
      };
      emblaApi.on("select", onSelect);
      onSelect();

      return () => {
        emblaApi.off("select", onSelect);
      };
    }
  }, [mobile, emblaApi, isLoading]);

  // Show mobile version if mobile is detected or if we're still detecting
  // This prevents layout shifts during mobile detection
  if (mobile === true || (mobile === null && isLoading)) {
    return (
      <div className="w-full">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {isLoading || mobile === null
              ? // Show skeleton cards while loading or detecting device
                Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={`skeleton-${index}`}
                    className="min-w-0 flex-[0_0_85%] pl-4"
                  >
                    <HotQuestionCardSkeleton />
                  </div>
                ))
              : // Show actual cards when loaded and device detected
                topics.map((topic) => (
                  <div key={topic.id} className="min-w-0 flex-[0_0_85%] pl-4">
                    <BaseHotQuestionCard topic={topic} user={user} />
                  </div>
                ))}
          </div>
        </div>
        {/* Carousel Indicators */}
        <div className="mt-6 flex justify-center space-x-2">
          {(isLoading || mobile === null
            ? Array.from({ length: 3 })
            : topics
          ).map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                index === selectedIndex
                  ? "bg-green-500 w-8"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              onClick={() =>
                !(isLoading || mobile === null) && emblaApi?.scrollTo(index)
              }
              aria-label={`Go to slide ${index + 1}`}
              disabled={isLoading || mobile === null}
            />
          ))}
        </div>
      </div>
    );
  }

  // Desktop version - simple grid with intersection observer animation
  return (
    <div className="flex flex-wrap justify-center gap-4 lg:gap-6">
      {topics.map((topic, index) => (
        <div key={topic.id} className="w-full sm:w-80 lg:w-72">
          <AnimatedHotQuestionCard topic={topic} index={index} user={user} />
        </div>
      ))}
    </div>
  );
}
