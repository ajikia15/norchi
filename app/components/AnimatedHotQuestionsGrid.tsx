"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { HotTopic } from "../types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { ArrowRight, Lightbulb } from "lucide-react";
import ReactMarkdown from "react-markdown";
import ResponsiveArticleDialog from "./ResponsiveArticleDialog";
import HotQuestionCardSkeleton from "./HotQuestionCardSkeleton";

interface AnimatedHotQuestionsGridProps {
  topics: HotTopic[];
}

interface AnimatedCardProps {
  topic: HotTopic;
  index: number;
  openedCards: Set<string>;
  everOpenedCards: Set<string>;
  toggleCard: (topicId: string) => void;
  setArticleDialogTopic: (topic: HotTopic) => void;
}

function AnimatedCard({
  topic,
  index,
  openedCards,
  everOpenedCards,
  toggleCard,
  setArticleDialogTopic,
}: AnimatedCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isCardHovered, setIsCardHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.2,
        rootMargin: "50px",
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const isOpen = openedCards.has(topic.id);
  const isLightOn = everOpenedCards.has(topic.id);

  return (
    <motion.div
      ref={cardRef}
      className="relative h-[22rem] w-full sm:w-80 lg:w-72"
      initial={{
        y: 40,
        opacity: 0,
        rotateY: -10,
      }}
      animate={{
        y: isVisible ? 0 : 40,
        opacity: isVisible ? 1 : 0,
        rotateY: isVisible ? 0 : -10,
      }}
      transition={{
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
        delay: index * 0.08,
        type: "spring",
        stiffness: 150,
        damping: 20,
      }}
      onMouseEnter={() => setIsCardHovered(true)}
      onMouseLeave={() => setIsCardHovered(false)}
    >
      {/* Answer Content Behind Door */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-gray-300 p-4 lg:p-5 flex flex-col overflow-hidden shadow-inner ${
          isOpen ? "cursor-pointer" : "pointer-events-none"
        }`}
        onClick={isOpen ? () => toggleCard(topic.id) : undefined}
      >
        {/* Dynamic Shadow Overlay */}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-lg bg-black"
          animate={{
            opacity: isOpen ? 0 : 0.7,
          }}
          transition={{
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        />

        {/* Door Edge Shadow */}
        <motion.div
          className="pointer-events-none absolute right-0 top-0 h-full w-8 rounded-r-lg bg-gradient-to-l from-black/50 to-transparent"
          animate={{
            opacity: isOpen ? 0 : 0.8,
            scaleX: isOpen ? 0 : 1,
          }}
          transition={{
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          style={{
            transformOrigin: "right center",
          }}
        />

        {/* Content above shadows */}
        <div className="relative z-10 flex h-full flex-col">
          <div className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 relative min-h-0 flex-1 overflow-y-auto">
            <div className="prose prose-sm max-w-none pr-2 text-gray-700">
              <ReactMarkdown>{topic.answer}</ReactMarkdown>
            </div>
          </div>

          {/* Bottom section with tags and read button */}
          <motion.div
            className="relative mt-3 flex flex-shrink-0 items-center justify-between gap-2 border-t border-gray-200 pt-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : 20 }}
            transition={{ delay: isOpen ? 0.2 : 0, duration: 0.3 }}
          >
            {/* Blur effect now part of bottom section */}
            {isOpen && (
              <motion.div
                className="pointer-events-none absolute -top-8 left-0 right-0 h-8 bg-gradient-to-t from-gray-100 to-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              />
            )}
            {/* Tags */}
            {topic.tagData && topic.tagData.length > 0 && (
              <div
                className="scrollbar-hide relative flex min-h-0 flex-1 items-center overflow-x-auto overflow-y-hidden"
                style={{
                  maskImage:
                    "linear-gradient(to right, black 85%, transparent 100%)",
                  WebkitMaskImage:
                    "linear-gradient(to right, black 85%, transparent 100%)",
                }}
              >
                <div className="flex w-max gap-1">
                  {topic.tagData.map((tag, tagIndex) => (
                    <motion.div
                      key={tag.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{
                        opacity: isOpen ? 1 : 0,
                        scale: isOpen ? 1 : 0.8,
                      }}
                      transition={{
                        delay: isOpen ? 0.3 + tagIndex * 0.05 : 0,
                        duration: 0.2,
                      }}
                    >
                      <Badge
                        variant="outline"
                        style={{
                          borderColor: tag.color,
                          color: tag.color,
                        }}
                        className="text-xs"
                      >
                        {tag.emoji} {tag.label}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Read button */}
            <motion.div
              className="flex-shrink-0"
              initial={{ opacity: 0, x: 20, scale: 0.8 }}
              animate={{
                opacity: isOpen ? 1 : 0,
                x: isOpen ? 0 : 20,
                scale: isOpen ? 1 : 0.8,
              }}
              transition={{ delay: isOpen ? 0.25 : 0, duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                size="sm"
                className="touch-manipulation shadow-sm transition-shadow hover:shadow-md"
                onClick={(e) => {
                  e.stopPropagation();
                  setArticleDialogTopic(topic);
                }}
                style={{ touchAction: "manipulation" }}
              >
                წაიკითხე <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Door */}
      <motion.div
        className={`absolute inset-0 z-20 ${
          isOpen ? "pointer-events-none" : "cursor-pointer"
        }`}
        animate={{
          rotateY: isOpen ? 90 : 0,
        }}
        transition={{
          duration: 0.4,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        style={{
          transformOrigin: "right center",
          backfaceVisibility: "hidden",
          perspective: "1000px",
        }}
        onClick={!isOpen ? () => toggleCard(topic.id) : undefined}
        whileHover={
          !isLightOn
            ? {
                filter: "brightness(1.05)",
              }
            : {}
        }
      >
        {/* Door Panel */}
        <div className="absolute flex h-full w-full flex-col justify-between overflow-hidden rounded-lg border-2 border-gray-300 bg-gradient-to-br from-white to-gray-50 p-4 shadow-lg lg:p-5">
          {/* Door Handle */}
          <motion.div
            className="absolute left-2 top-1/2 z-10 h-8 w-2 -translate-y-1/2 rounded-r-md bg-gradient-to-r from-green-600 to-green-400"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          ></motion.div>

          {/* Question title - centered */}
          <div className="flex flex-grow items-center justify-center text-center">
            <div className="relative">
              {/* Lightbulb */}
              <div className="absolute -top-16 left-1/2 -translate-x-1/2">
                <Lightbulb
                  size={32}
                  className={isLightOn ? "text-amber-500" : "text-gray-400"}
                  style={{
                    filter: isLightOn
                      ? "drop-shadow(0 0 10px #f59e0b)"
                      : isCardHovered && !isLightOn
                      ? "drop-shadow(0 0 3px rgba(245, 158, 11, 0.4))"
                      : "none",
                    color:
                      isCardHovered && !isLightOn
                        ? "rgba(245, 158, 11, 0.6)"
                        : undefined,
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
          {topic.tagData && topic.tagData.length > 0 && topic.tagData[0] && (
            <motion.div
              className="absolute bottom-4 left-1/2 -translate-x-1/2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              <Badge
                variant="outline"
                style={{
                  borderColor: topic.tagData[0].color,
                  color: topic.tagData[0].color,
                }}
                className="bg-white/80 text-xs shadow-sm backdrop-blur-sm"
              >
                {topic.tagData[0].emoji} {topic.tagData[0].label}
              </Badge>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

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
  const [mobile, setMobile] = useState<boolean | null>(null); // null = loading state
  const [carouselStopped, setCarouselStopped] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [contentReady, setContentReady] = useState(false);

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

    // Minimal delay to prevent flash while allowing content to appear quickly
    setTimeout(() => {
      setIsLoading(false);
      // Mark content as ready after a brief delay to ensure smooth transition
      setTimeout(() => setContentReady(true), 100);
    }, 50);

    // Listen for media query changes
    const handleChange = (e: MediaQueryListEvent) => {
      setMobile(e.matches);
    };
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Hide skeleton when content is ready
  useEffect(() => {
    if (contentReady) {
      const skeletonElement = document.querySelector("[data-skeleton-layer]");
      const contentElement = document.querySelector("[data-content-layer]");

      if (skeletonElement && contentElement) {
        (skeletonElement as HTMLElement).style.opacity = "0";
        (contentElement as HTMLElement).style.opacity = "1";
      }
    }
  }, [contentReady]);

  // Stop carousel when a card is clicked and restart when all cards are closed
  useEffect(() => {
    if (mobile === true && emblaApi && !isLoading) {
      if (carouselStopped) {
        autoplayRef.current.stop();
      } else if (openedCards.size === 0) {
        // Restart autoplay if no cards are open
        autoplayRef.current.play();
      }
    }
  }, [mobile, emblaApi, carouselStopped, openedCards.size, isLoading]);

  // Track current slide index
  useEffect(() => {
    if (mobile === true && emblaApi && !isLoading) {
      const onSelect = () => {
        setSelectedIndex(emblaApi.selectedScrollSnap());
      };
      emblaApi.on("select", onSelect);
      onSelect(); // Set initial index

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

                          <div className="relative mt-3 flex flex-shrink-0 items-center justify-center border-t border-gray-200 pt-3">
                            {/* Blur effect now part of bottom section */}
                            {openedCards.has(topic.id) && (
                              <div className="pointer-events-none absolute -top-8 left-0 right-0 h-8 bg-gradient-to-t from-gray-100 to-transparent" />
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              className="mx-4 w-full touch-manipulation shadow-sm"
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
                          <div className="absolute left-2 top-1/2 z-10 h-8 w-2 -translate-y-1/2 rounded-r-md bg-green-500"></div>

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
                                variant="outline"
                                style={{
                                  borderColor: topic.tagData[0].color,
                                  color: topic.tagData[0].color,
                                }}
                                className="bg-transparent text-xs"
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
        <AnimatedCard
          key={topic.id}
          topic={topic}
          index={index}
          openedCards={openedCards}
          everOpenedCards={everOpenedCards}
          toggleCard={toggleCard}
          setArticleDialogTopic={setArticleDialogTopic}
        />
      ))}

      {/* Article Dialog */}
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
