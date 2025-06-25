"use client";

import { useRef, useEffect, useState } from "react";
import { X, ArrowRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import ReactMarkdown from "react-markdown";
import { Node } from "../types";
import { useScrollLock } from "../lib/useScrollLock";

interface InfoCardDialogProps {
  node: Node;
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
}

export default function InfoCardDialog({
  node,
  isOpen,
  onClose,
  onContinue,
}: InfoCardDialogProps) {
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
            <div className="flex items-center gap-3">
              <div className="bg-violet-100 rounded-full p-2">
                <Info className="h-5 w-5 text-violet-600" />
              </div>
              <SheetTitle className="text-lg">საინფორმაციო მასალა</SheetTitle>
            </div>
          </SheetHeader>

          {/* Scrollable content area with proper spacing */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 min-h-0 py-2">
            <div className="prose prose-sm max-w-none text-gray-800 leading-relaxed px-1">
              <ReactMarkdown>{node.text}</ReactMarkdown>
            </div>
          </div>

          {/* Fixed footer */}
          <SheetFooter className="flex-shrink-0 pt-6 border-t border-gray-200 mt-4">
            <div className="flex gap-3 w-full">
              <Button variant="outline" onClick={onClose} className="flex-1">
                უკან დაბრუნება
              </Button>
              <Button
                onClick={onContinue}
                className="flex-1 flex items-center justify-center gap-2"
              >
                გაგრძელება
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </SheetFooter>
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
          {/* Header */}
          <div className="sticky top-0 z-20 border-b border-gray-100 bg-white/95 backdrop-blur-md">
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center gap-3">
                <div className="bg-violet-100 rounded-full p-2">
                  <Info className="h-5 w-5 text-violet-600" />
                </div>
                <h1 className="text-xl font-bold text-gray-900 md:text-2xl">
                  საინფორმაციო მასალა
                </h1>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-10 w-10 flex-shrink-0 rounded-full p-0"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="max-h-[calc(90vh-180px)] overflow-y-auto">
            <div className="px-6 py-8 md:px-8 lg:px-12">
              <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
                <ReactMarkdown>{node.text}</ReactMarkdown>
              </div>
            </div>
          </div>

          {/* Footer with Continue Button */}
          <div className="sticky bottom-0 border-t border-gray-100 bg-white p-6">
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={onClose}>
                უკან დაბრუნება
              </Button>
              <Button onClick={onContinue} className="flex items-center gap-2">
                გაგრძელება
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
}
