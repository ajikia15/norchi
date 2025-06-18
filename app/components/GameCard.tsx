"use client";

import { useState } from "react";
import { motion, PanInfo, useMotionValue, useTransform } from "framer-motion";
import { Node } from "../types";
import { Button } from "./ui/button";
import {
  ArrowLeft,
  ArrowRight,
  ArrowDown,
  CheckCircle,
  AlertTriangle,
  Info,
} from "lucide-react";

interface GameCardProps {
  node: Node;
  onAnswer: (nextNodeId: string, isChallenge?: boolean) => void;
  isTransitioning: boolean;
}

export default function GameCard({
  node,
  onAnswer,
  isTransitioning,
}: GameCardProps) {
  const [isShaking, setIsShaking] = useState(false);

  // Framer Motion values for smooth animations
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Transform values for rotation and opacity based on drag
  const rotate = useTransform(x, [-300, 0, 300], [-30, 0, 30]);
  const opacity = useTransform(
    x,
    [-300, -150, 0, 150, 300],
    [0.5, 0.8, 1, 0.8, 0.5]
  );

  // Background overlay colors for feedback
  const leftOverlay = useTransform(x, [-300, -50], [0.8, 0]);
  const rightOverlay = useTransform(x, [50, 300], [0, 0.8]);

  const handleDragEnd = (_event: unknown, info: PanInfo) => {
    const threshold = 200; // Increased threshold for more intentional swipes
    const velocity = Math.abs(info.velocity.x);
    const offset = info.offset.x;

    if (node.type !== "question") return;

    // Higher velocity threshold for quick swipes
    const quickSwipe = velocity > 1000;
    const significantDrag = Math.abs(offset) > threshold;

    if ((quickSwipe && Math.abs(offset) > 50) || significantDrag) {
      if (offset > 0) {
        // Right swipe - select right option
        if (node.options[1]?.nextNodeId) {
          onAnswer(node.options[1].nextNodeId);
        }
      } else {
        // Left swipe - select left option
        if (node.options[0]?.nextNodeId) {
          onAnswer(node.options[0].nextNodeId);
        }
      }
    }
    // The card will automatically spring back due to dragSnapToOrigin
  };

  const handleOptionClick = (optionIndex: number) => {
    if (isTransitioning || node.type !== "question") return;

    const option = node.options[optionIndex];
    if (!option?.nextNodeId) return;

    // Check if this is a third option (challenge) that returns to same node
    const isChallenge = optionIndex === 2 && option.nextNodeId === node.id;

    if (isChallenge) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      onAnswer(option.nextNodeId, true);
    } else {
      onAnswer(option.nextNodeId);
    }
  };

  const handleContinue = () => {
    if (isTransitioning) return;

    if (node.type === "infocard" && node.nextNodeId) {
      onAnswer(node.nextNodeId);
    } else if (node.type === "callout" && node.returnToNodeId) {
      onAnswer(node.returnToNodeId, true);
    }
  };

  const getNodeIcon = () => {
    switch (node.type) {
      case "question":
        return <AlertTriangle className="h-8 w-8 text-slate-600" />;
      case "end":
        return <CheckCircle className="h-8 w-8 text-emerald-600" />;
      case "callout":
        return <AlertTriangle className="h-8 w-8 text-amber-600" />;
      case "infocard":
        return <Info className="h-8 w-8 text-violet-600" />;
      default:
        return null;
    }
  };

  const getCardColor = () => {
    switch (node.type) {
      case "question":
        return "from-slate-50 to-white border-slate-200";
      case "end":
        return "from-emerald-50 to-white border-emerald-200";
      case "callout":
        return "from-amber-50 to-white border-amber-200";
      case "infocard":
        return "from-violet-50 to-white border-violet-200";
      default:
        return "from-gray-50 to-white border-gray-200";
    }
  };

  if (node.type === "question") {
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100">
        {/* TEST TEXT - DELETE ME */}
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-red-500 text-white p-4 rounded text-2xl font-bold">
          🚨 MODIFIED GAMECARD IS WORKING! 🚨
        </div>

        {/* Background overlays for swipe feedback */}
        <motion.div
          className="fixed inset-0 bg-rose-100 flex items-center justify-start pl-20"
          style={{ opacity: leftOverlay }}
        >
          <div className="flex flex-col items-center text-rose-600">
            <ArrowLeft className="h-16 w-16 mb-2" />
            <span className="text-2xl font-bold">
              {node.options[0]?.label || "Left"}
            </span>
          </div>
        </motion.div>

        <motion.div
          className="fixed inset-0 bg-emerald-100 flex items-center justify-end pr-20"
          style={{ opacity: rightOverlay }}
        >
          <div className="flex flex-col items-center text-emerald-600">
            <ArrowRight className="h-16 w-16 mb-2" />
            <span className="text-2xl font-bold">
              {node.options[1]?.label || "Right"}
            </span>
          </div>
        </motion.div>

        {/* Main Tinder-style Card */}
        <motion.div
          className={`relative w-full max-w-sm h-[600px] bg-gradient-to-br ${getCardColor()} rounded-3xl shadow-2xl border-2 overflow-hidden cursor-grab active:cursor-grabbing`}
          style={{ x, y, rotate, opacity }}
          drag
          dragSnapToOrigin
          dragElastic={0.2}
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          onDragEnd={handleDragEnd}
          animate={
            isShaking
              ? {
                  x: [-10, 10, -10, 10, 0],
                }
              : {}
          }
          transition={
            isShaking
              ? { duration: 0.5 }
              : { type: "spring", stiffness: 300, damping: 30 }
          }
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          whileDrag={{ scale: 1.05 }}
        >
          <div className="flex flex-col h-full">
            {/* Card Content */}
            <div className="flex-1 flex flex-col items-center justify-center p-8">
              <div className="bg-white rounded-full p-6 shadow-lg mb-8">
                {getNodeIcon()}
              </div>
              <h2 className="text-2xl font-bold text-slate-800 text-center leading-relaxed">
                {node.text}
              </h2>
            </div>
          </div>
        </motion.div>

        {/* Combined Controls Outside Card */}
        <div className="mt-8 w-full max-w-md space-y-4">
          <div className="flex items-center justify-between gap-4">
            {/* Left Option */}
            {node.options[0] && (
              <motion.button
                onClick={() => {
                  console.log("Left button clicked", node.options[0]);
                  handleOptionClick(0);
                }}
                disabled={isTransitioning || !node.options[0].nextNodeId}
                className="flex-1 flex items-center justify-center gap-3 h-16 bg-gradient-to-r from-white to-slate-50 rounded-2xl shadow-lg border-2 border-slate-200 hover:shadow-xl hover:from-rose-50 hover:to-rose-100 hover:border-rose-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                <ArrowLeft className="h-5 w-5 text-slate-500 group-hover:text-rose-600 transition-colors" />
                <span className="font-semibold text-slate-700 group-hover:text-rose-700 text-sm text-center transition-colors">
                  {node.options[0].label}
                </span>
              </motion.button>
            )}

            {/* Challenge Button (if exists) */}
            {node.options[2] && (
              <motion.button
                onClick={() => {
                  console.log("Challenge button clicked", node.options[2]);
                  handleOptionClick(2);
                }}
                disabled={isTransitioning}
                className="flex items-center justify-center gap-2 h-16 px-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl shadow-lg border-2 border-amber-200 hover:shadow-xl hover:from-amber-100 hover:to-yellow-100 hover:border-amber-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowDown className="h-4 w-4 text-amber-600 group-hover:text-amber-700 transition-colors" />
                <span className="font-semibold text-amber-700 group-hover:text-amber-800 text-xs text-center transition-colors">
                  {node.options[2].label}
                </span>
              </motion.button>
            )}

            {/* Right Option */}
            {node.options[1] && (
              <motion.button
                onClick={() => {
                  console.log("Right button clicked", node.options[1]);
                  handleOptionClick(1);
                }}
                disabled={isTransitioning || !node.options[1].nextNodeId}
                className="flex-1 flex items-center justify-center gap-3 h-16 bg-gradient-to-r from-white to-slate-50 rounded-2xl shadow-lg border-2 border-slate-200 hover:shadow-xl hover:from-emerald-50 hover:to-emerald-100 hover:border-emerald-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="font-semibold text-slate-700 group-hover:text-emerald-700 text-sm text-center transition-colors">
                  {node.options[1].label}
                </span>
                <ArrowRight className="h-5 w-5 text-slate-500 group-hover:text-emerald-600 transition-colors" />
              </motion.button>
            )}
          </div>

          {/* Enhanced instruction text */}
          <div className="text-center space-y-2">
            <p className="text-sm text-slate-500 font-medium">
              Make your choice
            </p>
            <p className="text-xs text-slate-400">
              Swipe the card or tap a button
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Non-question nodes (end, callout, infocard)
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100">
      <motion.div
        className={`w-full max-w-lg h-auto bg-gradient-to-br ${getCardColor()} rounded-3xl shadow-2xl border-2 overflow-hidden`}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-white rounded-full p-6 shadow-lg">
              {getNodeIcon()}
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 leading-relaxed mb-8">
            {node.text}
          </h2>

          {node.type !== "end" && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleContinue}
                disabled={isTransitioning}
                className="w-full h-14 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-semibold rounded-2xl shadow-lg border-0"
              >
                {node.type === "callout"
                  ? node.buttonLabel || "Try Again"
                  : node.buttonLabel || "Continue"}
              </Button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
