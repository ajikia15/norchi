"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { HotTopic } from "../types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, ArrowRight, CornerDownRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface HotQuestionCardProps {
  topic: HotTopic;
  index: number;
}

export default function HotQuestionCard({
  topic,
  index,
}: HotQuestionCardProps) {
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

  // Get primary tag emoji for decoration (first tag with emoji)
  const primaryTag = topic.tagData?.find((tag) => tag.emoji);

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
              background: "linear-gradient(315deg, #ffffff 0%, #d1d5dc 100%)",
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
              <div className="flex flex-wrap gap-1">
                {/* Tags as Badges */}
                {topic.tagData && topic.tagData.length > 0 ? (
                  topic.tagData.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant="outline"
                      className="text-xs font-medium border-2"
                      style={{
                        borderColor: tag.color,
                        color: tag.color,
                        backgroundColor: `${tag.color}10`, // 10% opacity background
                      }}
                    >
                      {tag.emoji} {tag.label}
                    </Badge>
                  ))
                ) : (
                  <Badge variant="secondary" className="text-xs font-medium">
                    No tags
                  </Badge>
                )}
              </div>
              <CornerDownRight className="h-4 w-4 text-gray-400" />
            </div>
            <h3 className="text-sm lg:text-base font-semibold text-gray-900 leading-tight">
              {topic.title}
            </h3>
          </div>

          {/* Primary tag emoji in bottom-right */}
          {primaryTag?.emoji && (
            <div className="absolute bottom-2 right-2 opacity-50 text-3xl">
              {primaryTag.emoji}
            </div>
          )}

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

          {/* Primary tag emoji in bottom-right on back face too */}
          {primaryTag?.emoji && (
            <div className="absolute bottom-2 right-2 opacity-50 text-3xl">
              {primaryTag.emoji}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
