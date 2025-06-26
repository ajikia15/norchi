"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { HotTopic } from "../types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Lightbulb, Save } from "lucide-react";
import ReactMarkdown from "react-markdown";
import ResponsiveArticleDialog from "./ResponsiveArticleDialog";
import DoorHandleIcon from "./DoorHandleIcon";

interface BaseHotQuestionCardProps {
  topic: HotTopic;
}

export default function BaseHotQuestionCard({
  topic,
}: BaseHotQuestionCardProps) {
  const [openedCards, setOpenedCards] = useState<Set<string>>(new Set());
  const [everOpenedCards, setEverOpenedCards] = useState<Set<string>>(
    new Set()
  );
  const [articleDialogTopic, setArticleDialogTopic] = useState<HotTopic | null>(
    null
  );

  const isOpen = openedCards.has(topic.id);
  const isLightOn = everOpenedCards.has(topic.id);

  const toggleCard = useCallback((topicId: string) => {
    setOpenedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(topicId)) {
        newSet.delete(topicId);
      } else {
        newSet.add(topicId);
        setEverOpenedCards((everPrev) => new Set(everPrev).add(topicId));
      }
      return newSet;
    });
  }, []);

  return (
    <>
      <motion.div className="relative h-[22rem] w-full">
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
            <div className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 relative min-h-0 flex-1 overflow-y-auto">
              <div className="prose prose-sm max-w-none pr-2 text-gray-700">
                <ReactMarkdown>{topic.answer}</ReactMarkdown>
              </div>
            </div>

            {/* Bottom section with save icon and full-width read button */}
            <motion.div
              className="relative mt-3 flex flex-shrink-0 items-center justify-between gap-2 border-t border-gray-200 pt-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : 20 }}
              transition={{ delay: isOpen ? 0.2 : 0, duration: 0.3 }}
            >
              {/* Blur effect */}
              {isOpen && (
                <motion.div
                  className="pointer-events-none absolute -top-8 left-0 right-0 h-8 bg-gradient-to-t from-gray-100 to-transparent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                />
              )}

              {/* Save Button */}
              <motion.div
                className="flex-shrink-0"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: isOpen ? 1 : 0,
                }}
                transition={{
                  delay: isOpen ? 0.3 : 0,
                  duration: 0.2,
                }}
              >
                <Button variant="ghost" size="icon" aria-label="Save answer">
                  <Save className="h-5 w-5 text-gray-500" />
                </Button>
              </motion.div>

              {/* Read to end button */}
              <motion.div
                className="flex-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{
                  opacity: isOpen ? 1 : 0,
                  x: isOpen ? 0 : 20,
                }}
                transition={{ delay: isOpen ? 0.25 : 0, duration: 0.3 }}
              >
                <Button
                  variant="outline"
                  className="w-full touch-manipulation shadow-sm transition-shadow hover:shadow-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    setArticleDialogTopic(topic);
                  }}
                  style={{ touchAction: "manipulation" }}
                >
                  წაიკითხე ბოლომდე <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Door */}
        <motion.div
          className={`absolute inset-0 z-20 ${
            isOpen ? "pointer-events-none" : "cursor-pointer"
          }`}
          animate={{
            rotateY: isOpen ? 90 : 0,
          }}
          transition={{
            duration: 0.4,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          style={{
            transformOrigin: "right center",
            backfaceVisibility: "hidden",
            perspective: "1000px",
          }}
          onClick={!isOpen ? () => toggleCard(topic.id) : undefined}
        >
          {/* Door Panel */}
          <div className="absolute flex h-full w-full flex-col justify-between overflow-hidden rounded-lg border-2 border-gray-300 bg-gradient-to-br from-white to-gray-50 p-4 shadow-lg lg:p-5">
            {/* Door Handle */}
            <motion.div
              className="absolute bottom-[30%] left-2 z-10 text-gray-400"
              whileHover={{ color: "rgb(34 197 94)" }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <DoorHandleIcon width={20} height={20} />
            </motion.div>

            {/* Question title - centered */}
            <div className="flex flex-grow items-center justify-center text-center">
              <div className="relative">
                {/* Lightbulb */}
                <div className="absolute -top-16 left-1/2 -translate-x-1/2">
                  <Lightbulb
                    className={`h-6 w-6 transition-colors duration-500 ${
                      isLightOn
                        ? "text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.7)]"
                        : "text-gray-400 group-hover:text-gray-500"
                    }`}
                  />
                </div>

                <h3 className="text-lg font-semibold leading-tight text-gray-900">
                  {topic.title}
                </h3>
              </div>
            </div>

            {/* Primary tag */}
            {topic.tagData && topic.tagData.length > 0 && topic.tagData[0] && (
              <motion.div
                className="absolute bottom-4 left-1/2 -translate-x-1/2"
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                <Badge
                  variant="outline"
                  style={{
                    borderColor: "rgb(156 163 175)", // gray-400
                  }}
                  className="bg-white/80 text-xs shadow-sm backdrop-blur-sm"
                >
                  {topic.tagData[0].emoji} {topic.tagData[0].label}
                </Badge>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Dialog */}
      {articleDialogTopic && (
        <ResponsiveArticleDialog
          topic={articleDialogTopic}
          isOpen={!!articleDialogTopic}
          onClose={() => setArticleDialogTopic(null)}
        />
      )}
    </>
  );
}
