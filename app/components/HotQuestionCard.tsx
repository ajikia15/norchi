"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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
import { CornerDownRight, ArrowRight } from "lucide-react";
import ReactMarkdown from "react-markdown";

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
      className="relative w-full h-88"
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
            <div className="flex items-center justify-between gap-2 mb-2">
              {/* Tags with horizontal scroll - show only first tag on front face */}
              {topic.tagData && topic.tagData.length > 0 && (
                <div className="overflow-x-auto overflow-y-hidden scrollbar-hide flex items-center flex-1 min-h-0">
                  <div className="flex gap-1 w-max">
                    {/* Show only first tag on front face */}
                    <Badge
                      key={topic.tagData[0].id}
                      variant="outline"
                      className="text-xs font-medium border-2 flex-shrink-0"
                      style={{
                        borderColor: topic.tagData[0].color,
                        color: topic.tagData[0].color,
                        backgroundColor: `${topic.tagData[0].color}10`, // 10% opacity background
                      }}
                    >
                      {topic.tagData[0].emoji} {topic.tagData[0].label}
                    </Badge>
                  </div>
                </div>
              )}
              <CornerDownRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
            </div>
            <h3 className="text-sm lg:text-base font-semibold text-gray-900 leading-tight mb-6">
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
          <div className="flex-grow overflow-hidden flex flex-col justify-between">
            <div
              className="prose prose-sm max-w-none text-gray-700 relative overflow-hidden"
              style={{
                maxHeight: "16rem", // More space since tags moved to bottom
              }}
            >
              <ReactMarkdown>{topic.answer}</ReactMarkdown>
            </div>

            {/* Gradient fade overlay above bottom section */}
            <div
              className="h-6 -mt-6 relative z-10 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to bottom, transparent 0%, white 100%)",
              }}
            />

            {/* Bottom row: Tags on left, Read button on right */}
            <div className="flex items-center justify-between gap-3 mt-1 flex-shrink-0">
              {/* Tags with horizontal scroll and blur */}
              {topic.tagData && topic.tagData.length > 0 && (
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
                    {topic.tagData.map((tag) => (
                      <Badge
                        key={tag.id}
                        variant="outline"
                        className="text-xs font-medium border-2 flex-shrink-0"
                        style={{
                          borderColor: tag.color,
                          color: tag.color,
                          backgroundColor: `${tag.color}10`, // 10% opacity background
                        }}
                      >
                        {tag.emoji} {tag.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Read button - only show if answer is longer than 400 characters */}
              {topic.answer.length > 400 && (
                <div className="flex-shrink-0">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Read <ArrowRight className="h-3 w-3" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-left text-lg font-semibold">
                          {topic.title}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="prose prose-sm max-w-none text-gray-700 mt-4">
                        <ReactMarkdown>{topic.answer}</ReactMarkdown>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
