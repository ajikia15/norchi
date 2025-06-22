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
import { ArrowRight } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface HotQuestionCardProps {
  topic: HotTopic;
}

export default function HotQuestionCard({ topic }: HotQuestionCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  // Get primary tag emoji for decoration (first tag with emoji)
  const primaryTag = topic.tagData?.find((tag) => tag.emoji);

  const contentVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, delay: 0.3 },
    },
  };

  return (
    <motion.div
      className="relative w-full h-[22rem]"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="relative w-full h-full cursor-pointer"
        style={{
          transformStyle: "preserve-3d",
          perspective: "1000px",
        }}
        animate={{
          rotateY: isFlipped ? 180 : 0,
        }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Front Face */}
        <AnimatePresence mode="wait">
          {!isFlipped && (
            <motion.div
              key="front"
              className="absolute w-full h-full bg-white rounded-lg border-2 p-4 lg:p-5 flex flex-col justify-between overflow-hidden shadow-lg"
              style={{ backfaceVisibility: "hidden" }}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <div className="flex-grow flex flex-col justify-center items-center text-center">
                {/* Single tag, centered above title */}
                {topic.tagData && topic.tagData.length > 0 && (
                  <motion.div
                    className="mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                  >
                    <Badge
                      key={topic.tagData[0].id}
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
                  </motion.div>
                )}
                <motion.h3
                  className="text-lg lg:text-xl font-semibold text-gray-900 leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                >
                  {topic.title}
                </motion.h3>
              </div>

              {/* Primary tag emoji in bottom-right */}
              {primaryTag?.emoji && (
                <motion.div
                  className="absolute bottom-2 right-2 opacity-50 text-3xl"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 0.5, scale: 1 }}
                  transition={{ delay: 0.6, duration: 0.4, type: "spring" }}
                >
                  {primaryTag.emoji}
                </motion.div>
              )}

              <motion.p
                className="text-xs text-gray-400 mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.3 }}
              >
                დააკლიკეთ ამოსაბრუნებლად
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Back Face */}
        <AnimatePresence mode="wait">
          {isFlipped && (
            <motion.div
              key="back"
              className="absolute w-full h-full bg-white rounded-lg border-2 p-4 lg:p-5 flex flex-col overflow-hidden shadow-lg"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <div className="flex-grow overflow-hidden flex flex-col justify-between">
                <motion.div
                  className="prose prose-sm max-w-none text-gray-700 relative overflow-hidden"
                  style={{
                    maxHeight: "16rem",
                    whiteSpace: "pre-wrap",
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                >
                  <ReactMarkdown>{topic.answer}</ReactMarkdown>
                </motion.div>

                {/* Gradient fade overlay above bottom section */}
                <div
                  className="h-6 -mt-6 relative z-10 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(to bottom, transparent 0%, white 100%)",
                  }}
                />

                {/* Bottom row: Tags on left, Read button on right */}
                <motion.div
                  className="flex items-center justify-between gap-3 mt-4 flex-shrink-0"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                >
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
                        {topic.tagData.map((tag, index) => (
                          <motion.div
                            key={tag.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                              delay: 0.6 + index * 0.1,
                              duration: 0.3,
                            }}
                          >
                            <Badge
                              variant="default"
                              style={{
                                backgroundColor: tag.color,
                                borderColor: tag.color,
                                color: "white",
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
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7, duration: 0.4 }}
                    >
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            წაკითხვა <ArrowRight className="h-3 w-3" />
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
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
