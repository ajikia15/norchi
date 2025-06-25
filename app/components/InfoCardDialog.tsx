"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Info } from "lucide-react";
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
  const [isMobile, setIsMobile] = useState<boolean>(false);

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

  // Mobile version with drawer
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent
          side="bottom"
          className="flex max-h-[85vh] flex-col overflow-hidden"
        >
          <SheetHeader className="flex-shrink-0 pb-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-violet-100 p-2">
                <Info className="h-5 w-5 text-violet-600" />
              </div>
              <SheetTitle className="text-lg">საინფორმაციო მასალა</SheetTitle>
            </div>
          </SheetHeader>

          {/* Scrollable content area with proper spacing */}
          <div className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 min-h-0 flex-1 overflow-y-auto py-2">
            <div className="prose prose-sm max-w-none px-1 leading-relaxed text-gray-800">
              <ReactMarkdown>{node.text}</ReactMarkdown>
            </div>
          </div>

          {/* Fixed footer */}
          <SheetFooter className="mt-4 flex-shrink-0 border-t border-gray-200 pt-6">
            <div className="flex w-full gap-3">
              <Button variant="outline" onClick={onClose} className="flex-1">
                უკან დაბრუნება
              </Button>
              <Button
                onClick={onContinue}
                className="flex flex-1 items-center justify-center gap-2"
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

  // Desktop version with dialog
  return (
    <div className="animate-in fade-in-0 fixed inset-0 z-50 flex min-h-screen items-center justify-center bg-black/80 p-4 backdrop-blur-sm duration-300 md:p-6 lg:p-8">
      <div className="animate-in zoom-in-95 relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl duration-300">
        {/* Header */}
        <div className="sticky top-0 z-20 border-b border-gray-100 bg-white/95 backdrop-blur-md">
          <div className="flex items-center p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-violet-100 p-2">
                <Info className="h-5 w-5 text-violet-600" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 md:text-2xl">
                საინფორმაციო მასალა
              </h1>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[calc(90vh-180px)] overflow-y-auto">
          <div className="px-6 py-8 md:px-8 lg:px-12">
            <div className="prose prose-lg max-w-none leading-relaxed text-gray-800">
              <ReactMarkdown>{node.text}</ReactMarkdown>
            </div>
          </div>
        </div>

        {/* Footer with Continue Button */}
        <div className="sticky bottom-0 border-t border-gray-100 bg-white p-6">
          <div className="flex justify-end gap-3">
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
  );
}
