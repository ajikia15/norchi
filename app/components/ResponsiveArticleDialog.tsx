"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { HotTopic } from "../types";

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
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    setIsMobile(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };
    mediaQuery.addEventListener("change", handleChange);
    setIsMounted(true); // Set mounted state after initial check

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Prevent body scroll when dialog is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !isMounted) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const dialogContent =
    // Mobile version
    isMobile ? (
      <div className="fixed inset-0 z-50 bg-black/50">
        <div className="fixed bottom-0 left-0 right-0 max-h-[85vh] rounded-t-2xl bg-white">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 p-4">
            <h2 className="flex-1 text-lg font-semibold text-gray-900 pr-4">
              {topic.title}
            </h2>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="max-h-[calc(85vh-80px)] overflow-y-auto p-4">
            <div className="prose prose-sm max-w-none text-gray-700">
              <ReactMarkdown>{topic.answer}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    ) : (
      // Desktop version
      <div
        className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
        onClick={handleBackdropClick}
      >
        <div className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 p-6">
            <h2 className="flex-1 text-2xl font-bold text-gray-900 pr-6">
              {topic.title}
            </h2>
            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="max-h-[calc(90vh-100px)] overflow-y-auto p-6">
            <div className="prose prose-lg max-w-none text-gray-700">
              <ReactMarkdown>{topic.answer}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    );

  return createPortal(dialogContent, document.body);
}
