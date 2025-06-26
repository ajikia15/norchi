"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { HotTopic } from "../types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { ArrowRight, Lightbulb, Bookmark } from "lucide-react";
import ReactMarkdown from "react-markdown";
import ResponsiveArticleDialog from "./ResponsiveArticleDialog";
import HotQuestionCardSkeleton from "./HotQuestionCardSkeleton";
import DoorHandleIcon from "./DoorHandleIcon";
import AnimatedHotQuestionCard from "./AnimatedHotQuestionCard";

interface AnimatedHotQuestionsGridProps {
  topics: HotTopic[];
}

/**
 * Animated grid component for hot questions with responsive layout.
 * Features beautiful entrance animations, mobile carousel, and desktop grid layout.
 * Restored intersection observer animations for optimal user experience.
 */
export default function AnimatedHotQuestionsGrid({
  topics,
}: AnimatedHotQuestionsGridProps) {
  const [openedCards, setOpenedCards] = useState<Set<string>>(new Set());
  const [everOpenedCards, setEverOpenedCards] = useState<Set<string>>(
    new Set()
  );
  const [articleDialogTopic, setArticleDialogTopic] = useState<HotTopic | null>(
    null
  );
  const [mobile, setMobile] = useState<boolean | null>(null);
  const [carouselStopped, setCarouselStopped] = useState(false);
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
      if (carouselStopped) {
        autoplayRef.current.stop();
      } else if (openedCards.size === 0) {
        autoplayRef.current.play();
      }
    }
  }, [mobile, emblaApi, carouselStopped, openedCards.size, isLoading]);

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

  const toggleCard = useCallback(
    (topicId: string) => {
      setOpenedCards((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(topicId)) {
          newSet.delete(topicId);
        } else {
          newSet.add(topicId);
          // Stop carousel when card is opened
          if (mobile) {
            setCarouselStopped(true);
          }
          // Track that this card has been opened at least once
          setEverOpenedCards((everPrev) => new Set(everPrev).add(topicId));
        }

        // Reset carousel stopped state when all cards are closed
        if (newSet.size === 0 && mobile) {
          setCarouselStopped(false);
        }
        return newSet;
      });
    },
    [mobile]
  );

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
                    <div className="relative h-[22rem] w-full">
                      {/* Answer Content Behind Door */}
                      <div
                        className={`absolute inset-0 bg-gray-100 rounded-lg border-2 border-gray-300 p-4 flex flex-col overflow-hidden ${
                          openedCards.has(topic.id)
                            ? "cursor-pointer"
                            : "pointer-events-none"
                        }`}
                        style={{
                          opacity: openedCards.has(topic.id) ? 1 : 0.3,
                          transition: "opacity 0.3s ease",
                        }}
                        onClick={
                          openedCards.has(topic.id)
                            ? () => toggleCard(topic.id)
                            : undefined
                        }
                      >
                        <div className="relative z-10 flex h-full flex-col">
                          <div className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 relative min-h-0 flex-1 overflow-y-auto">
                            <div className="prose prose-sm max-w-none pr-2 text-gray-700">
                              <ReactMarkdown>{topic.answer}</ReactMarkdown>
                            </div>
                          </div>

                          <div className="relative mt-3 flex flex-shrink-0 items-center justify-between gap-2 border-t border-gray-200 pt-3">
                            {/* Blur effect now part of bottom section */}
                            {openedCards.has(topic.id) && (
                              <div className="pointer-events-none absolute -top-8 left-0 right-0 h-8 bg-gradient-to-t from-gray-100 to-transparent" />
                            )}

                            {/* Bookmark button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="flex-shrink-0 px-2"
                            >
                              <Bookmark className="h-4 w-4" />
                            </Button>

                            {/* Read button */}
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 touch-manipulation shadow-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setArticleDialogTopic(topic);
                              }}
                              style={{ touchAction: "manipulation" }}
                            >
                              წაიკითხე ბოლომდე{" "}
                              <ArrowRight className="ml-1 h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Door - Ultra simplified */}
                      <div
                        className={`absolute inset-0 z-20 ${
                          openedCards.has(topic.id)
                            ? "pointer-events-none"
                            : "cursor-pointer"
                        }`}
                        style={{
                          transformOrigin: "right center",
                          transform: openedCards.has(topic.id)
                            ? "rotateY(120deg)"
                            : "rotateY(0deg)",
                          transition: "transform 0.5s ease-out",
                          backfaceVisibility: "hidden",
                        }}
                        onClick={
                          !openedCards.has(topic.id)
                            ? () => toggleCard(topic.id)
                            : undefined
                        }
                      >
                        {/* Door Panel */}
                        <div className="absolute flex h-full w-full flex-col justify-between overflow-hidden rounded-lg border-2 bg-white p-4 shadow-lg">
                          {/* Door Handle */}
                          <div className="absolute left-2 bottom-[30%] z-10 text-gray-400">
                            <DoorHandleIcon width={20} height={20} />
                          </div>

                          {/* Question title - centered */}
                          <div className="flex flex-grow items-center justify-center text-center">
                            <div className="relative">
                              {/* Lightbulb - ultra simplified */}
                              <div className="absolute -top-16 left-1/2 -translate-x-1/2">
                                <Lightbulb
                                  size={32}
                                  className={
                                    everOpenedCards.has(topic.id)
                                      ? "text-amber-500"
                                      : "text-gray-400"
                                  }
                                  style={{
                                    filter: everOpenedCards.has(topic.id)
                                      ? "drop-shadow(0 0 10px #f59e0b)"
                                      : "none",
                                    transition: "all 0.3s ease",
                                  }}
                                />
                              </div>

                              <h3 className="text-lg font-semibold leading-tight text-gray-900">
                                {topic.title}
                              </h3>
                            </div>
                          </div>

                          {/* Primary tag */}
                          {topic.tagData && topic.tagData.length > 0 && (
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                              <Badge
                                variant="default"
                                style={{
                                  backgroundColor: topic.tagData[0].color,
                                  borderColor: topic.tagData[0].color,
                                  color: "white",
                                }}
                                className="bg-white/80 text-xs shadow-sm backdrop-blur-sm"
                              >
                                {topic.tagData[0].emoji}{" "}
                                {topic.tagData[0].label}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
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

        {/* Article Dialog for mobile */}
        {articleDialogTopic && (
          <ResponsiveArticleDialog
            topic={articleDialogTopic}
            isOpen={!!articleDialogTopic}
            onClose={() => setArticleDialogTopic(null)}
          />
        )}
      </div>
    );
  }

  // Desktop version - simple grid with intersection observer animation
  return (
    <div className="flex flex-wrap justify-center gap-4 lg:gap-6">
      {topics.map((topic, index) => (
        <div key={topic.id} className="w-full sm:w-80 lg:w-72">
          <AnimatedHotQuestionCard topic={topic} index={index} />
        </div>
      ))}
    </div>
  );
}
