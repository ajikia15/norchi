"use client";

import { useRef, useEffect } from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import { RemoveScroll } from "react-remove-scroll";
import { HotTopic } from "../types";

interface ArticleDialogProps {
  topic: HotTopic;
  isOpen: boolean;
  onClose: () => void;
}

export default function ArticleDialog({
  topic,
  isOpen,
  onClose,
}: ArticleDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Simple dialog management
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    const handleBackdropClick = (e: MouseEvent | TouchEvent) => {
      // Check if click/touch is on the dialog backdrop (not on the content)
      const isClickOnDialog = e.target === dialog;

      // For mobile: also check if click is outside the content area
      const contentArea = dialog.querySelector(
        ".dialog-content-area"
      ) as HTMLElement;
      if (contentArea) {
        const contentRect = contentArea.getBoundingClientRect();
        const clientX =
          "clientX" in e ? e.clientX : (e as TouchEvent).touches[0]?.clientX;
        const clientY =
          "clientY" in e ? e.clientY : (e as TouchEvent).touches[0]?.clientY;

        if (clientX && clientY) {
          const isClickOutsideContent =
            clientX < contentRect.left ||
            clientX > contentRect.right ||
            clientY < contentRect.top ||
            clientY > contentRect.bottom;

          if (isClickOutsideContent || isClickOnDialog) {
            onClose();
          }
          return;
        }
      }

      // Fallback to original logic
      if (isClickOnDialog) {
        onClose();
      }
    };

    const handleClose = () => {
      onClose();
    };

    dialog.addEventListener("click", handleBackdropClick);
    dialog.addEventListener("touchend", handleBackdropClick);
    dialog.addEventListener("close", handleClose);
    document.addEventListener("keydown", handleEscape);

    return () => {
      dialog.removeEventListener("click", handleBackdropClick);
      dialog.removeEventListener("touchend", handleBackdropClick);
      dialog.removeEventListener("close", handleClose);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose, isOpen]);

  return (
    <dialog
      ref={dialogRef}
      className="open:animate-in open:fade-in-0 m-0 h-full max-h-none w-full max-w-none bg-transparent p-0 backdrop:bg-black/80 open:duration-300"
      style={{ overflow: "hidden" }}
    >
      <RemoveScroll enabled={isOpen}>
        {/* Main container with responsive width */}
        <div className="flex min-h-screen items-center justify-center p-4 md:p-6 lg:p-8">
          <div className="dialog-content-area relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* Fixed header with close button and title */}
            <div className="flex-shrink-0 border-b border-gray-100 bg-white">
              <div className="flex items-start justify-between p-6 pb-4">
                <div className="flex-1 pr-4">
                  <h1 className="text-xl font-bold leading-tight text-gray-900 md:text-2xl lg:text-3xl">
                    {topic.title}
                  </h1>
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
            <div className="flex-1 overflow-y-auto" data-dialog-content>
              <div className="px-6 py-6 md:px-8 md:py-8 lg:px-12 lg:py-12">
                {/* Article content with simple clean styling */}
                <div
                  className="text-gray-800"
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

            {/* Footer with tags */}
            {topic.tagData && topic.tagData.length > 0 && (
              <div className="flex-shrink-0 border-t border-gray-100 bg-gray-50 px-6 py-4 md:px-8 lg:px-12">
                <div className="flex flex-wrap gap-2">
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
              </div>
            )}
          </div>
        </div>
      </RemoveScroll>
    </dialog>
  );
}
