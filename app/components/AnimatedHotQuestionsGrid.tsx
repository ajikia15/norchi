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
        const dropDelay = index * 0.1; // When each card drops from convoy

        return (
          <motion.div
            key={topic.id}
            className="w-full sm:w-80 lg:w-72"
            initial={{
              // All cards start tightly stacked at the same position
              x: -400, // All start together off-screen
              rotateY: 20,
              scale: 0.95,
              zIndex: topics.length - index,
            }}
            animate={{
              // Spring to final flex position
              x: 0,
              rotateY: 0,
              scale: 1,
            }}
            transition={{
              delay: dropDelay,
              type: "spring",
              stiffness: 120,
              damping: 20,
              mass: 0.8,
            }}
          >
            <HotQuestionCard topic={topic} />
          </motion.div>
        );
      })}
    </div>
  );
}
