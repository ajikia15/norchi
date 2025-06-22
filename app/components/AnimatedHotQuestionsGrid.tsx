"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HotTopic } from "../types";
import { Badge } from "@/components/ui/badge";
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
              className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-gray-300 p-4 lg:p-5 flex flex-col overflow-hidden shadow-inner"
              initial={{ opacity: 0 }}
              animate={{ opacity: isOpen ? 1 : 0 }}
              transition={{ duration: 0.3, delay: isOpen ? 0.4 : 0 }}
            >
              <div className="flex-grow overflow-hidden flex flex-col">
                <div className="flex-grow overflow-y-auto pr-2">
                  <div className="prose prose-sm max-w-none text-gray-700">
                    <ReactMarkdown>{topic.answer}</ReactMarkdown>
                  </div>
                </div>

                {/* Bottom section with tags */}
                {topic.tagData && topic.tagData.length > 1 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex flex-wrap gap-1">
                      {topic.tagData.slice(1).map((tag) => (
                        <Badge
                          key={tag.id}
                          variant="outline"
                          style={{
                            borderColor: tag.color,
                            color: tag.color,
                          }}
                          className="text-xs"
                        >
                          {tag.emoji} {tag.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <p className="text-xs text-gray-400 mt-4 text-center">
                დააკლიკეთ კარის დასახურად
              </p>
            </motion.div>

            {/* Door */}
            <motion.div
              className="absolute inset-0 cursor-pointer"
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
              onClick={() => toggleCard(topic.id)}
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

                <div className="flex-grow flex flex-col justify-center items-center text-center ml-4">
                  {/* Primary tag */}
                  {topic.tagData && topic.tagData.length > 0 && (
                    <div className="mb-4">
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

                  <h3 className="text-lg lg:text-xl font-semibold text-gray-900 leading-tight">
                    {topic.title}
                  </h3>
                </div>

                {/* Primary tag emoji in bottom-right */}
                {topic.tagData?.[0]?.emoji && (
                  <div className="absolute bottom-2 right-2 opacity-50 text-3xl">
                    {topic.tagData[0].emoji}
                  </div>
                )}

                <p className="text-xs text-gray-400 mt-4 text-center">
                  დააკლიკეთ კარის გასახსნელად
                </p>
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
