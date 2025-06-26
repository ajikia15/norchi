"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { HotTopic } from "../types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

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
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();
    setIsMounted(true);

    // Listen for resize events
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!isMounted) return null;

  // Mobile version using Drawer
  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader>
            <DrawerTitle className="text-left text-lg font-semibold">
              {topic.title}
            </DrawerTitle>
          </DrawerHeader>
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            <div className="prose prose-sm max-w-none text-gray-700">
              <ReactMarkdown>{topic.answer}</ReactMarkdown>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  // Desktop version using Dialog
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold pr-6">
            {topic.title}
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">
          <div className="prose prose-lg max-w-none text-gray-700">
            <ReactMarkdown>{topic.answer}</ReactMarkdown>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
