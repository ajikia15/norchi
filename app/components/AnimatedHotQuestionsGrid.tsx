"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { HotTopic } from "../types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { ArrowRight, Lightbulb } from "lucide-react";
import ReactMarkdown from "react-markdown";
import ArticleDialog from "./ArticleDialog";
import HotQuestionCardSkeleton from "./HotQuestionCardSkeleton";

interface AnimatedHotQuestionsGridProps {
  topics: HotTopic[];
}

interface CardRowProps {
  topics: HotTopic[];
  direction: 0 | 1; // 0 = left-to-right, 1 = right-to-left
  openedCards: Set<string>;
  everOpenedCards: Set<string>;
  toggleCard: (topicId: string) => void;
  setArticleDialogTopic: (topic: HotTopic) => void;
  startIndex: number;
}

function CardRow({
  topics,
  direction,
  openedCards,
  everOpenedCards,
  toggleCard,
  setArticleDialogTopic,
  startIndex,
}: CardRowProps) {
  const animationDirection = direction === 0 ? -1 : 1; // -1 for left-to-right, 1 for right-to-left

  return (
    <>
      {topics.map((topic, positionInRow) => {
        const globalIndex = startIndex + positionInRow;
        const dropDelay = positionInRow * 0.15;

        const isOpen = openedCards.has(topic.id);
        const isLightOn = everOpenedCards.has(topic.id);

        return (
          <motion.div
            key={topic.id}
            className="relative h-[22rem] w-full sm:w-80 lg:w-72"
            initial={{
              x: animationDirection * (400 - globalIndex * 3),
              y: globalIndex * 2,
              rotateY: -animationDirection * 90,
              zIndex: 50 - globalIndex,
            }}
            animate={{
              x: 0,
              y: 0,
              rotateY: 0,
            }}
            transition={{
              delay: dropDelay,
              type: "spring",
              stiffness: 200,
              damping: 25,
              mass: 0.6,
            }}
            style={{
              filter: `drop-shadow(${globalIndex * 2}px ${globalIndex * 2}px ${
                globalIndex * 4
              }px rgba(0,0,0,0.15))`,
              perspective: "1000px",
            }}
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
                <div className="relative min-h-0 flex-1 overflow-hidden">
                  <div className="prose prose-sm max-w-none text-gray-700">
                    <ReactMarkdown>{topic.answer}</ReactMarkdown>
                  </div>
                  {isOpen && (
                    <motion.div
                      className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-100 to-transparent"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4, duration: 0.3 }}
                    />
                  )}
                </div>

                {/* Bottom section with tags and read button */}
                <motion.div
                  className="mt-3 flex flex-shrink-0 items-center justify-between gap-2 border-t border-gray-200 pt-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : 20 }}
                  transition={{ delay: isOpen ? 0.2 : 0, duration: 0.3 }}
                >
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
                      წაკითხვა <ArrowRight className="ml-1 h-3 w-3" />
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
              style={{
                transformStyle: "preserve-3d",
                transformOrigin: "right center",
              }}
              animate={{
                rotateY: isOpen ? 120 : 0,
              }}
              transition={{
                duration: isOpen ? 0.5 : 0.3,
                ease: isOpen ? [0.25, 0.46, 0.45, 0.94] : [0.4, 0.0, 0.2, 1],
              }}
              onClick={!isOpen ? () => toggleCard(topic.id) : undefined}
            >
              {/* Door Panel */}
              <motion.div
                className="absolute flex h-full w-full flex-col justify-between overflow-hidden rounded-lg border-2 bg-white p-4 shadow-lg lg:p-5"
                style={{
                  backfaceVisibility: "hidden",
                }}
              >
                {/* Door Handle */}
                <div className="absolute left-2 top-1/2 z-10 h-8 w-2 -translate-y-1/2 transform rounded-r-md bg-gradient-to-r from-green-400 to-green-600 shadow-md"></div>

                {/* Question title - perfectly centered */}
                <div className="flex flex-grow items-center justify-center text-center">
                  <div className="relative">
                    {/* Lightbulb above question */}
                    <motion.div className="absolute -top-16 left-1/2 -translate-x-1/2 transform">
                      <motion.div
                        className="relative"
                        animate={{
                          filter: isLightOn
                            ? "drop-shadow(0 0 20px #f59e0b)"
                            : "none",
                        }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <motion.div
                          className="relative"
                          animate={{
                            scale: isLightOn ? 1.15 : 1,
                          }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                          {/* Main lightbulb icon */}
                          <motion.div
                            animate={{
                              color: isLightOn ? "#f59e0b" : "#9ca3af",
                            }}
                            transition={{ duration: 0.3 }}
                          >
                            <Lightbulb size={32} />
                          </motion.div>

                          {/* Single strong glow layer */}
                          <AnimatePresence>
                            {isLightOn && (
                              <motion.div
                                className="pointer-events-none absolute inset-0"
                                initial={{
                                  opacity: 0,
                                  filter: "blur(20px)",
                                }}
                                animate={{
                                  opacity: 0.8,
                                  filter: "blur(0px)",
                                }}
                                exit={{
                                  opacity: 0,
                                  filter: "blur(20px)",
                                }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                              >
                                <Lightbulb
                                  size={32}
                                  className="text-yellow-300"
                                />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      </motion.div>
                    </motion.div>

                    {/* Question with light effect */}
                    <motion.h3
                      className="text-lg font-semibold leading-tight text-gray-900 lg:text-xl"
                      animate={{
                        color: isLightOn ? "#1f2937" : "#374151",
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {topic.title}
                    </motion.h3>
                  </div>
                </div>

                {/* Primary tag - positioned at bottom center */}
                {topic.tagData && topic.tagData.length > 0 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 transform">
                    <Badge
                      variant="outline"
                      style={{
                        borderColor: topic.tagData[0].color,
                        color: topic.tagData[0].color,
                      }}
                      className="bg-transparent text-xs"
                    >
                      {topic.tagData[0].emoji} {topic.tagData[0].label}
                    </Badge>
                  </div>
                )}
              </motion.div>
            </motion.div>

            {/* Wall/Background when door is open */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-b from-stone-200 to-stone-300"
                  style={{
                    transform: "translateZ(-50px)",
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.8 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                />
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </>
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
    // Delay loading completion to prevent flash
    setTimeout(() => setIsLoading(false), 100);

    // Listen for media query changes
    const handleChange = (e: MediaQueryListEvent) => {
      setMobile(e.matches);
    };
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

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
                topics.map((topic) => {
                  const isOpen = openedCards.has(topic.id);
                  const isLightOn = everOpenedCards.has(topic.id);

                  return (
                    <div key={topic.id} className="min-w-0 flex-[0_0_85%] pl-4">
                      <div className="relative h-[22rem] w-full">
                        {/* Answer Content Behind Door */}
                        <div
                          className={`absolute inset-0 bg-gray-100 rounded-lg border-2 border-gray-300 p-4 flex flex-col overflow-hidden ${
                            isOpen ? "cursor-pointer" : "pointer-events-none"
                          }`}
                          style={{
                            opacity: isOpen ? 1 : 0.3,
                            transition: "opacity 0.3s ease",
                          }}
                          onClick={
                            isOpen ? () => toggleCard(topic.id) : undefined
                          }
                        >
                          <div className="relative z-10 flex h-full flex-col">
                            <div className="relative min-h-0 flex-1 overflow-hidden">
                              <div className="prose prose-sm max-w-none text-gray-700">
                                <ReactMarkdown>{topic.answer}</ReactMarkdown>
                              </div>
                              {isOpen && (
                                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-100 to-transparent" />
                              )}
                            </div>

                            <div className="mt-3 flex flex-shrink-0 items-center justify-center border-t border-gray-200 pt-3">
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
                            isOpen ? "pointer-events-none" : "cursor-pointer"
                          }`}
                          style={{
                            transformOrigin: "right center",
                            transform: isOpen
                              ? "rotateY(120deg)"
                              : "rotateY(0deg)",
                            transition: "transform 0.5s ease-out",
                            backfaceVisibility: "hidden",
                          }}
                          onClick={
                            !isOpen ? () => toggleCard(topic.id) : undefined
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
                                      isLightOn
                                        ? "text-amber-500"
                                        : "text-gray-400"
                                    }
                                    style={{
                                      filter: isLightOn
                                        ? "drop-shadow(0 0 10px #f59e0b)"
                                        : "none",
                                      transition: "all 0.3s ease",
                                    }}
                                  />
                                </div>

                                <h3
                                  className={`text-lg font-semibold leading-tight ${
                                    isLightOn
                                      ? "text-gray-900"
                                      : "text-gray-600"
                                  }`}
                                >
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
                  );
                })}
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
          <ArticleDialog
            topic={articleDialogTopic}
            isOpen={!!articleDialogTopic}
            onClose={() => setArticleDialogTopic(null)}
          />
        )}
      </div>
    );
  }

  // Desktop version - super simple with CardRow components
  const cardsPerRow = 4;
  const firstRowTopics = topics.slice(0, cardsPerRow);
  const secondRowTopics = topics.slice(cardsPerRow, cardsPerRow * 2);
  const thirdRowTopics = topics.slice(cardsPerRow * 2, cardsPerRow * 3);
  const fourthRowTopics = topics.slice(cardsPerRow * 3, cardsPerRow * 4);

  return (
    <div className="flex flex-wrap justify-center gap-4 lg:gap-6">
      <CardRow
        topics={firstRowTopics}
        direction={0}
        openedCards={openedCards}
        everOpenedCards={everOpenedCards}
        toggleCard={toggleCard}
        setArticleDialogTopic={setArticleDialogTopic}
        startIndex={0}
      />
      <CardRow
        topics={secondRowTopics}
        direction={1}
        openedCards={openedCards}
        everOpenedCards={everOpenedCards}
        toggleCard={toggleCard}
        setArticleDialogTopic={setArticleDialogTopic}
        startIndex={cardsPerRow}
      />
      <CardRow
        topics={thirdRowTopics}
        direction={0}
        openedCards={openedCards}
        everOpenedCards={everOpenedCards}
        toggleCard={toggleCard}
        setArticleDialogTopic={setArticleDialogTopic}
        startIndex={cardsPerRow * 2}
      />
      <CardRow
        topics={fourthRowTopics}
        direction={1}
        openedCards={openedCards}
        everOpenedCards={everOpenedCards}
        toggleCard={toggleCard}
        setArticleDialogTopic={setArticleDialogTopic}
        startIndex={cardsPerRow * 3}
      />

      {/* Article Dialog */}
      {articleDialogTopic && (
        <ArticleDialog
          topic={articleDialogTopic}
          isOpen={!!articleDialogTopic}
          onClose={() => setArticleDialogTopic(null)}
        />
      )}
    </div>
  );
}
