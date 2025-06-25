"use client";

import { useRef, useEffect, useState } from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import ReactMarkdown from "react-markdown";
import { HotTopic } from "../types";
import { useScrollLock } from "../lib/useScrollLock";

interface ResponsiveArticleDialogProps {
  topic: HotTopic;
  isOpen: boolean;
  onClose: () => void;
}

export default function ResponsiveArticleDialog({
  topic,
  isOpen,
  onClose,
}: ResponsiveArticleDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  // Use scroll lock for custom dialog
  useScrollLock(isOpen && !isMobile);

  // Detect mobile device
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    setIsMobile(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Handle custom dialog for desktop
  useEffect(() => {
    if (isMobile === false) {
      const dialog = dialogRef.current;
      if (!dialog) return;

      if (isOpen && !dialog.open) {
        dialog.showModal();
      } else if (!isOpen && dialog.open) {
        dialog.close();
      }
    }
  }, [isOpen, isMobile]);

  useEffect(() => {
    if (isMobile === false) {
      const dialog = dialogRef.current;
      if (!dialog) return;

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        }
      };

      const handleBackdropClick = (e: MouseEvent) => {
        if (e.target === dialog) {
          onClose();
        }
      };

      dialog.addEventListener("click", handleBackdropClick);
      document.addEventListener("keydown", handleEscape);

      return () => {
        dialog.removeEventListener("click", handleBackdropClick);
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [onClose, isMobile]);

  // Show skeleton while detecting device
  if (isMobile === null) {
    return null;
  }

  // Mobile version with drawer
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent
          side="bottom"
          className="flex flex-col max-h-[85vh] overflow-hidden"
        >
          <SheetHeader className="flex-shrink-0 pb-4">
            <SheetTitle className="text-lg font-bold leading-tight">
              {topic.title}
            </SheetTitle>

            {/* Tags */}
            {topic.tagData && topic.tagData.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {topic.tagData.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant="secondary"
                    style={{
                      backgroundColor: `${tag.color}15`,
                      borderColor: tag.color,
                      color: tag.color,
                    }}
                    className="border text-sm font-medium"
                  >
                    <span className="mr-1.5">{tag.emoji}</span>
                    {tag.label}
                  </Badge>
                ))}
              </div>
            )}
          </SheetHeader>

          {/* Scrollable content area with proper spacing */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 min-h-0 py-2">
            <div className="prose prose-sm max-w-none text-gray-800 leading-relaxed px-1">
              <ReactMarkdown>{topic.answer}</ReactMarkdown>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop version with custom dialog
  return (
    <dialog
      ref={dialogRef}
      className="open:animate-in open:fade-in-0 m-0 h-full max-h-none w-full max-w-none bg-transparent p-0 backdrop:bg-black/80 backdrop:backdrop-blur-sm open:duration-300"
    >
      <div className="flex min-h-screen items-center justify-center p-4 md:p-6 lg:p-8">
        <div className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">
          {/* Fixed header with close button and title */}
          <div className="sticky top-0 z-20 border-b border-gray-100 bg-white/95 backdrop-blur-md">
            <div className="flex items-start justify-between p-6 pb-4">
              <div className="flex-1 pr-4">
                <h1 className="text-xl font-bold leading-tight text-gray-900 md:text-2xl lg:text-3xl">
                  {topic.title}
                </h1>

                {/* Tags */}
                {topic.tagData && topic.tagData.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {topic.tagData.map((tag) => (
                      <Badge
                        key={tag.id}
                        variant="secondary"
                        style={{
                          backgroundColor: `${tag.color}15`,
                          borderColor: tag.color,
                          color: tag.color,
                        }}
                        className="border text-sm font-medium"
                      >
                        <span className="mr-1.5">{tag.emoji}</span>
                        {tag.label}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Close button - always visible */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-10 w-10 flex-shrink-0 rounded-full p-0 transition-colors hover:bg-gray-100"
                aria-label="Close article"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Scrollable content area */}
          <div className="max-h-[calc(90vh-120px)] overflow-y-auto">
            <div className="px-6 pb-8 md:px-8 md:pb-12 lg:px-12 lg:pb-16">
              {/* Article content with optimal reading typography */}
              <div
                className="prose prose-lg md:prose-xl prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6 prose-strong:text-gray-900 prose-strong:font-semibold prose-em:text-gray-800 prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:pl-6 prose-blockquote:py-4 prose-blockquote:my-8 prose-blockquote:rounded-r-lg prose-ul:space-y-2 prose-ol:space-y-2 prose-li:text-gray-700 prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-lg prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline max-w-none"
                style={{
                  fontSize: "1.125rem",
                  lineHeight: "1.8",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                }}
              >
                <ReactMarkdown>{topic.answer}</ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
}
