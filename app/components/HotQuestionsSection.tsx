"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HotTopic, HotTopicsData } from "../types";
import { loadHotTopicsData, getDefaultHotTopicsData } from "../lib/storage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, ArrowRight, CornerDownRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface HotQuestionCardProps {
  topic: HotTopic;
  index: number;
}

const HotQuestionCard = ({ topic, index }: HotQuestionCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (topic.link) {
      if (topic.link.startsWith("/")) {
        router.push(topic.link);
      } else {
        window.open(topic.link, "_blank", "noopener,noreferrer");
      }
    }
  };

  const cardFlipTransition = {
    rotateY: { type: "spring" as const, stiffness: 120, damping: 15 },
    rotateX: {
      type: "tween" as const,
      ease: "easeInOut" as const,
      duration: 0.5,
      times: [0, 0.2, 0.5, 0.8, 1],
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="relative w-full h-full"
      style={{ perspective: "1200px" }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div
        className="relative w-full h-full cursor-pointer"
        style={{ transformStyle: "preserve-3d" }}
        animate={{
          rotateY: isFlipped ? 180 : 0,
          rotateX: isFlipped ? [0, 25, -15, 5, 0] : 0,
          scale: isHovered && !isFlipped ? 1.02 : 1,
        }}
        transition={cardFlipTransition}
        onClick={() => setIsFlipped(!isFlipped)}
        whileHover={
          !isFlipped
            ? {
                rotateZ: "-1deg",
                z: 20,
                boxShadow: "0px 15px 35px rgba(0,0,0,0.15)",
              }
            : {}
        }
      >
        {/* Front Face */}
        <div
          className="absolute w-full h-full bg-white rounded-lg border-2 p-4 lg:p-5 flex flex-col justify-between overflow-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* Corner Shadow - cast by the lifted corner */}

          {/* Corner Mask - hides original corner border */}

          {/* Lifted Corner - slides diagonally into position */}
          <motion.div
            className="absolute pointer-events-none"
            animate={{
              x: isHovered && !isFlipped ? 0 : -60,
              y: isHovered && !isFlipped ? 0 : -60,
              rotateX: isHovered && !isFlipped ? -35 : -15,
              rotateY: isHovered && !isFlipped ? 25 : 10,
              rotateZ: isHovered && !isFlipped ? 12 : 5,
              z: isHovered && !isFlipped ? 15 : 0,
              opacity: isHovered && !isFlipped ? 1 : 0,
            }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
            }}
            style={{
              top: "-2px",
              left: "-2px",
              width: "48px",
              height: "48px",
              background:
                "linear-gradient(135deg, #ffffff 0%, #f8f9fa 30%, #e9ecef 70%, #dee2e6 100%)",
              border: "2px solid #d1d5db",
              borderRadius: "8px 0 0 0",
              transformOrigin: "0% 0%",
              transformStyle: "preserve-3d",
              boxShadow:
                isHovered && !isFlipped
                  ? "4px 8px 16px rgba(0,0,0,0.15)"
                  : "none",
            }}
          />

          <div>
            <div className="flex items-start justify-between gap-2 mb-3">
              <Badge
                variant="secondary"
                className="text-xs font-medium bg-primary/10 text-primary border-primary/20"
              >
                {topic.category}
              </Badge>
              <CornerDownRight className="h-4 w-4 text-gray-400" />
            </div>
            <h3 className="text-sm lg:text-base font-semibold text-gray-900 leading-tight">
              {topic.title}
            </h3>
          </div>
          <p className="text-xs text-gray-400 mt-4">Click to flip</p>
        </div>

        {/* Back Face */}
        <div
          className="absolute w-full h-full bg-white rounded-lg border-2 p-4 lg:p-5 flex flex-col overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="flex-grow overflow-auto">
            <p className="text-sm text-gray-700 leading-relaxed">
              {topic.answer}
            </p>
          </div>
          {topic.link && (
            <Button
              onClick={handleLinkClick}
              variant="outline"
              size="sm"
              className="w-full mt-4 flex-shrink-0"
            >
              <span className="flex items-center gap-2">
                Read more
                {topic.link.startsWith("/") ? (
                  <ArrowRight className="h-3 w-3" />
                ) : (
                  <ExternalLink className="h-3 w-3" />
                )}
              </span>
            </Button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function HotQuestionsSection() {
  const [hotTopicsData, setHotTopicsData] = useState<HotTopicsData | null>(
    null
  );

  useEffect(() => {
    const loaded = loadHotTopicsData() || getDefaultHotTopicsData();
    setHotTopicsData(loaded);
  }, []);

  if (!hotTopicsData) {
    return (
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-primary"></div>
          <p className="mt-4 text-gray-600">Loading hot questions...</p>
        </div>
      </section>
    );
  }

  const topics = Object.values(hotTopicsData.topics);

  return (
    <section className="py-12 lg:py-16 bg-gradient-to-br from-gray-50/50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium mb-4">
            🔥 Hot Questions
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Challenge Your Beliefs
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Provocative questions that challenge popular thinking and explore
            libertarian principles. Click to reveal our perspective.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 lg:gap-6">
          {topics.slice(0, 12).map((topic, index) => (
            <div
              key={topic.id}
              className={cn(
                "h-64", // Fixed height for consistent card size
                index >= 9 && "hidden md:block", // Show 9 on mobile/tablet
                index >= 8 && "hidden md:hidden lg:block", // Show 8 on tablet
                index >= 4 && "hidden sm:hidden md:block" // show 4 on mobile
              )}
            >
              <HotQuestionCard topic={topic} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
