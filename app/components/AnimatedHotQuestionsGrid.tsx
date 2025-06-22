"use client";

import { motion } from "framer-motion";
import { HotTopic } from "../types";
import HotQuestionCard from "./HotQuestionCard";

interface AnimatedHotQuestionsGridProps {
  topics: HotTopic[];
}

export default function AnimatedHotQuestionsGrid({
  topics,
}: AnimatedHotQuestionsGridProps) {
  return (
    <div className="flex flex-wrap justify-center gap-4 lg:gap-6">
      {topics.map((topic, index) => {
        const dropDelay = index * 0.15; // When each card drops from convoy

        return (
          <motion.div
            key={topic.id}
            className="w-full sm:w-80 lg:w-72"
            initial={{
              // Cards stacked with visible layering like fanned cards
              x: -400 + index * 3, // Slight x offset to see layering
              y: index * 2, // Small y offset
              rotateY: 20,
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
            }}
          >
            <HotQuestionCard topic={topic} />
          </motion.div>
        );
      })}
    </div>
  );
}
