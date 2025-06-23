"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HotTopic } from "../types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowRight, Lightbulb } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface AnimatedHotQuestionsGridProps {
  topics: HotTopic[];
}

export default function AnimatedHotQuestionsGrid({
  topics,
}: AnimatedHotQuestionsGridProps) {
  const [openedCards, setOpenedCards] = useState<Set<string>>(new Set());
  const [everOpenedCards, setEverOpenedCards] = useState<Set<string>>(
    new Set()
  );

  const toggleCard = (topicId: string) => {
    setOpenedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(topicId)) {
        newSet.delete(topicId);
      } else {
        newSet.add(topicId);
        // Track that this card has been opened at least once
        setEverOpenedCards((everPrev) => new Set(everPrev).add(topicId));
      }
      return newSet;
    });
  };

  return (
    <div className="flex flex-wrap justify-center gap-4 lg:gap-6">
      {topics.map((topic, index) => {
        // Calculate which row this card is in (assuming ~4 cards per row for layout)
        // This creates alternating animation directions for each row
        const cardsPerRow = 4; // Reasonable assumption for most screen sizes
        const rowIndex = Math.floor(index / cardsPerRow);
        const positionInRow = index % cardsPerRow; // Position within the row
        const isEvenRow = rowIndex % 2 === 0;

        // Both rows start at the same time, but cards within each row follow the convoy effect
        const dropDelay = positionInRow * 0.15; // Delay based on position within row, not overall index

        const isOpen = openedCards.has(topic.id);
        const isLightOn = everOpenedCards.has(topic.id); // Light stays on once it's been turned on

        // Alternate animation direction: even rows from left, odd rows from right
        const animationDirection = isEvenRow ? -1 : 1; // -1 for left-to-right, 1 for right-to-left

        return (
          <motion.div
            key={topic.id}
            className="relative h-[22rem] w-full sm:w-80 lg:w-72"
            initial={{
              // Cards stacked with visible layering like fanned cards
              x: animationDirection * (400 - index * 3), // Direction based on row
              y: index * 2, // Small y offset
              rotateY: -animationDirection * 90, // Rotation direction flipped for alternating rows
              zIndex: topics.length - index,
            }}
            animate={{
              // Spring to final flex position
              x: 0,
              y: 0, // Reset y offset
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
              // Add shadow for better depth perception
              filter: `drop-shadow(${index * 2}px ${index * 2}px ${
                index * 4
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
                  {/* Blur effect when door is open to show there's more content */}
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

                  {/* Read button - always show */}
                  {
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
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="shadow-sm transition-shadow hover:shadow-md"
                            onClick={(e) => e.stopPropagation()}
                          >
                            წაკითხვა <ArrowRight className="ml-1 h-3 w-3" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="text-left text-lg font-semibold">
                              {topic.title}
                            </DialogTitle>
                          </DialogHeader>
                          <div
                            className="prose prose-sm mt-4 max-w-none text-gray-700"
                            style={{ whiteSpace: "pre-wrap" }}
                          >
                            <ReactMarkdown>{topic.answer}</ReactMarkdown>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </motion.div>
                  }
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
                transformOrigin: "right center", // Door hinge on the right
              }}
              animate={{
                rotateY: isOpen ? 120 : 0, // Open towards us (positive angle) when hinge is on right
              }}
              transition={{
                duration: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94], // Custom ease for door opening
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
    </div>
  );
}
