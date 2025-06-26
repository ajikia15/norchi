"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HotTopic } from "../types";
import BaseHotQuestionCard from "./BaseHotQuestionCard";

interface AnimatedHotQuestionCardProps {
  topic: HotTopic;
  index: number;
  user?: { id: string } | null;
}

export default function AnimatedHotQuestionCard({
  topic,
  index,
  user,
}: AnimatedHotQuestionCardProps) {
  const [isVisible, setIsVisible] = useState(false);
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

  return (
    <motion.div
      ref={cardRef}
      className="w-full"
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
    >
      <BaseHotQuestionCard topic={topic} user={user} />
    </motion.div>
  );
}
