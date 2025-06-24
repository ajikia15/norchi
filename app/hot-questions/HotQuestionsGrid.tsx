"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { HotTopic } from "../types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ArrowRight, Lightbulb } from "lucide-react";
import ReactMarkdown from "react-markdown";
import ArticleDialog from "../components/ArticleDialogWithHook";

interface HotQuestionsGridProps {
  topics: HotTopic[];
}

const ITEMS_PER_PAGE = 12;

// Static card component without appearing animations
function StaticHotQuestionCard({ topic }: { topic: HotTopic }) {
  const [openedCards, setOpenedCards] = useState<Set<string>>(new Set());
  const [everOpenedCards, setEverOpenedCards] = useState<Set<string>>(
    new Set()
  );
  const [articleDialogTopic, setArticleDialogTopic] = useState<HotTopic | null>(
    null
  );
  const [isCardHovered, setIsCardHovered] = useState(false);

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
      <motion.div
        className="relative h-[22rem] w-full"
        onMouseEnter={() => setIsCardHovered(true)}
        onMouseLeave={() => setIsCardHovered(false)}
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

            {/* Bottom section with tags and read button */}
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

              {/* Tags */}
              {topic.tagData && topic.tagData.length > 0 && (
                <div
                  className="scrollbar-hide relative flex min-h-0 flex-1 items-center overflow-x-auto overflow-y-hidden"
                  style={{
                    maskImage:
                      "linear-gradient(to right, black 85%, transparent 100%)",
                    WebkitMaskImage:
                      "linear-gradient(to right, black 85%, transparent 100%)",
                  }}
                >
                  <div className="flex w-max gap-1">
                    {topic.tagData.map((tag, tagIndex) => (
                      <motion.div
                        key={tag.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{
                          opacity: isOpen ? 1 : 0,
                          scale: isOpen ? 1 : 0.8,
                        }}
                        transition={{
                          delay: isOpen ? 0.3 + tagIndex * 0.05 : 0,
                          duration: 0.2,
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

              {/* Read button */}
              <motion.div
                className="flex-shrink-0"
                initial={{ opacity: 0, x: 20, scale: 0.8 }}
                animate={{
                  opacity: isOpen ? 1 : 0,
                  x: isOpen ? 0 : 20,
                  scale: isOpen ? 1 : 0.8,
                }}
                transition={{ delay: isOpen ? 0.25 : 0, duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="touch-manipulation shadow-sm transition-shadow hover:shadow-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    setArticleDialogTopic(topic);
                  }}
                  style={{ touchAction: "manipulation" }}
                >
                  წაიკითხე <ArrowRight className="ml-1 h-3 w-3" />
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
          whileHover={
            !isLightOn
              ? {
                  filter: "brightness(1.05)",
                }
              : {}
          }
        >
          {/* Door Panel */}
          <div className="absolute flex h-full w-full flex-col justify-between overflow-hidden rounded-lg border-2 border-gray-300 bg-gradient-to-br from-white to-gray-50 p-4 shadow-lg lg:p-5">
            {/* Door Handle */}
            <motion.div
              className="absolute left-2 top-1/2 z-10 h-8 w-2 -translate-y-1/2 rounded-r-md bg-gradient-to-r from-green-600 to-green-400"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            ></motion.div>

            {/* Question title - centered */}
            <div className="flex flex-grow items-center justify-center text-center">
              <div className="relative">
                {/* Lightbulb */}
                <div className="absolute -top-16 left-1/2 -translate-x-1/2">
                  <Lightbulb
                    size={32}
                    className={isLightOn ? "text-amber-500" : "text-gray-400"}
                    style={{
                      filter: isLightOn
                        ? "drop-shadow(0 0 10px #f59e0b)"
                        : isCardHovered && !isLightOn
                        ? "drop-shadow(0 0 3px rgba(245, 158, 11, 0.4))"
                        : "none",
                      color:
                        isCardHovered && !isLightOn
                          ? "rgba(245, 158, 11, 0.6)"
                          : undefined,
                      transition: "all 0.3s ease",
                    }}
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
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                <Badge
                  variant="outline"
                  style={{
                    borderColor: topic.tagData[0].color,
                    color: topic.tagData[0].color,
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
        <ArticleDialog
          topic={articleDialogTopic}
          isOpen={!!articleDialogTopic}
          onClose={() => setArticleDialogTopic(null)}
        />
      )}
    </>
  );
}

export default function HotQuestionsGrid({ topics }: HotQuestionsGridProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(topics.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentTopics = topics.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {currentTopics.map((topic) => (
          <StaticHotQuestionCard key={topic.id} topic={topic} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Page numbers */}
          {Array.from({ length: totalPages }, (_, index) => {
            const page = index + 1;
            const isCurrentPage = page === currentPage;

            // Show first page, last page, current page, and pages around current
            const showPage =
              page === 1 ||
              page === totalPages ||
              Math.abs(page - currentPage) <= 1;

            if (!showPage) {
              // Show ellipsis for gaps
              if (page === 2 && currentPage > 4) {
                return (
                  <span key={page} className="px-2 text-gray-500">
                    ...
                  </span>
                );
              }
              if (page === totalPages - 1 && currentPage < totalPages - 3) {
                return (
                  <span key={page} className="px-2 text-gray-500">
                    ...
                  </span>
                );
              }
              return null;
            }

            return (
              <Button
                key={page}
                variant={isCurrentPage ? "default" : "outline"}
                size="icon"
                onClick={() => goToPage(page)}
              >
                {page}
              </Button>
            );
          })}

          <Button
            variant="outline"
            size="icon"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </>
  );
}
