"use client";

import { useState } from "react";
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

  return (
    <div className="relative w-full h-[22rem]">
      <div
        className="relative w-full h-full cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Front Face */}
        {!isFlipped && (
          <div className="absolute w-full h-full bg-white rounded-lg border-2 p-4 lg:p-5 flex flex-col justify-between overflow-hidden">
            <div className="flex-grow flex flex-col justify-center items-center text-center">
              {/* Single tag, centered above title */}
              {topic.tagData && topic.tagData.length > 0 && (
                <div className="mb-4">
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
                </div>
              )}
              <h3 className="text-lg lg:text-xl font-semibold text-gray-900 leading-tight">
                {topic.title}
              </h3>
            </div>

            {/* Primary tag emoji in bottom-right */}
            {primaryTag?.emoji && (
              <div className="absolute bottom-2 right-2 opacity-50 text-3xl">
                {primaryTag.emoji}
              </div>
            )}

            <p className="text-xs text-gray-400 mt-4">
              დააკლიკეთ ამოსაბრუნებლად
            </p>
          </div>
        )}

        {/* Back Face */}
        {isFlipped && (
          <div className="absolute w-full h-full bg-white rounded-lg border-2 p-4 lg:p-5 flex flex-col overflow-hidden">
            <div className="flex-grow overflow-hidden flex flex-col justify-between">
              <div
                className="prose prose-sm max-w-none text-gray-700 relative overflow-hidden"
                style={{
                  maxHeight: "16rem",
                  whiteSpace: "pre-wrap",
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
              <div className="flex items-center justify-between gap-3 mt-4 flex-shrink-0">
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
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
