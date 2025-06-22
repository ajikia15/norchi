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

  const toggleCard = (topicId: string) => {
    setOpenedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(topicId)) {
        newSet.delete(topicId);
      } else {
        newSet.add(topicId);
      }
      return newSet;
    });
  };

  return (
    <div className="flex flex-wrap justify-center gap-4 lg:gap-6">
      {topics.map((topic, index) => {
        const dropDelay = index * 0.3; // When each card drops from convoy
        const isOpen = openedCards.has(topic.id);
        const isLightOn = isOpen; // Light turns on when door opens

        return (
          <motion.div
            key={topic.id}
            className="w-full sm:w-80 lg:w-72 h-[22rem] relative"
            initial={{
              // Cards stacked with visible layering like fanned cards
              x: -400 + index * 3, // Slight x offset to see layering
              y: index * 2, // Small y offset
              rotateY: -90,
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
              stiffness: 120,
              damping: 20,
              mass: 0.8,
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
                className="absolute inset-0 bg-black rounded-lg pointer-events-none"
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
                className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-black/50 to-transparent rounded-r-lg pointer-events-none"
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
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex-1 overflow-y-auto pr-2 min-h-0">
                  <div className="prose prose-sm max-w-none text-gray-700">
                    <ReactMarkdown>{topic.answer}</ReactMarkdown>
                  </div>
                </div>

                {/* Bottom section with tags and read button */}
                <motion.div
                  className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between gap-2 flex-shrink-0"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : 20 }}
                  transition={{ delay: isOpen ? 0.5 : 0, duration: 0.4 }}
                >
                  {/* Tags */}
                  {topic.tagData && topic.tagData.length > 1 && (
                    <div
                      className="overflow-x-auto overflow-y-hidden scrollbar-hide flex items-center min-h-0 relative flex-1"
                      style={{
                        maskImage:
                          "linear-gradient(to right, black 85%, transparent 100%)",
                        WebkitMaskImage:
                          "linear-gradient(to right, black 85%, transparent 100%)",
                      }}
                    >
                      <div className="flex gap-1 w-max">
                        {topic.tagData.slice(1).map((tag, tagIndex) => (
                          <motion.div
                            key={tag.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{
                              opacity: isOpen ? 1 : 0,
                              scale: isOpen ? 1 : 0.8,
                            }}
                            transition={{
                              delay: isOpen ? 0.6 + tagIndex * 0.1 : 0,
                              duration: 0.3,
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

                  {/* Read button - only show if answer is longer than 400 characters */}
                  {topic.answer.length > 400 && (
                    <motion.div
                      className="flex-shrink-0"
                      initial={{ opacity: 0, x: 20, scale: 0.8 }}
                      animate={{
                        opacity: isOpen ? 1 : 0,
                        x: isOpen ? 0 : 20,
                        scale: isOpen ? 1 : 0.8,
                      }}
                      transition={{ delay: isOpen ? 0.7 : 0, duration: 0.4 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="shadow-sm hover:shadow-md transition-shadow"
                            onClick={(e) => e.stopPropagation()}
                          >
                            წაკითხვა <ArrowRight className="h-3 w-3 ml-1" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="text-left text-lg font-semibold">
                              {topic.title}
                            </DialogTitle>
                          </DialogHeader>
                          <div
                            className="prose prose-sm max-w-none text-gray-700 mt-4"
                            style={{ whiteSpace: "pre-wrap" }}
                          >
                            <ReactMarkdown>{topic.answer}</ReactMarkdown>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </motion.div>
                  )}
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
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94], // Custom ease for door opening
              }}
              onClick={!isOpen ? () => toggleCard(topic.id) : undefined}
            >
              {/* Door Panel */}
              <motion.div
                className="absolute w-full h-full bg-white rounded-lg border-2 p-4 lg:p-5 flex flex-col justify-between overflow-hidden shadow-lg"
                style={{
                  backfaceVisibility: "hidden",
                }}
              >
                {/* Door Handle */}
                <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-2 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-r-md shadow-md z-10"></div>

                {/* Primary tag - positioned absolutely at top */}
                {topic.tagData && topic.tagData.length > 0 && (
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                    <Badge
                      variant="default"
                      style={{
                        backgroundColor: topic.tagData[0].color,
                        borderColor: topic.tagData[0].color,
                        color: "white",
                      }}
                      className="text-xs"
                    >
                      {topic.tagData[0].emoji} {topic.tagData[0].label}
                    </Badge>
                  </div>
                )}

                {/* Question title - perfectly centered */}
                <div className="flex-grow flex items-center justify-center text-center">
                  <div className="relative">
                    {/* Lightbulb above question */}
                    <motion.div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
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
                                className="absolute inset-0 pointer-events-none"
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
                      className="text-lg lg:text-xl font-semibold text-gray-900 leading-tight"
                      animate={{
                        color: isLightOn ? "#1f2937" : "#374151",
                        textShadow: isLightOn
                          ? "0 0 5px rgba(251, 191, 36, 0.3)"
                          : "none",
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {topic.title}
                    </motion.h3>
                  </div>
                </div>

                {/* Primary tag emoji in bottom-right */}
                {topic.tagData?.[0]?.emoji && (
                  <div className="absolute bottom-2 right-2 opacity-50 text-3xl">
                    {topic.tagData[0].emoji}
                  </div>
                )}
              </motion.div>
            </motion.div>

            {/* Wall/Background when door is open */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-b from-stone-200 to-stone-300 rounded-lg -z-10"
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
