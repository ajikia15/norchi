"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
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

interface GameCardAnimatedProps {
  node: Node;
  onAnswer: (nextNodeId: string, isChallenge?: boolean) => void;
  isTransitioning: boolean;
  nodeHistory: string[];
}

const backgroundCardVariants = {
  hidden: { scale: 0.85, opacity: 0.3, y: 20 },
  visible: { scale: 0.9, opacity: 0.6, y: 10 },
};

export default function GameCardAnimated({
  node,
  onAnswer,
  isTransitioning,
}: GameCardAnimatedProps) {
  const [isShaking, setIsShaking] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(0);
  const [cardKey, setCardKey] = useState(Date.now());

  // Update card key when node changes to trigger animations
  useEffect(() => {
    setCardKey(Date.now());
  }, [node.id]);

  const handleDragEnd = (_event: unknown, info: PanInfo) => {
    const threshold = 100;
    const velocity = info.velocity.x;
    const offset = info.offset.x;

    if (node.type !== "question") return;

    // Determine swipe direction
    if (offset > threshold || velocity > 500) {
      // Right swipe - select right option
      if (node.options[1]?.nextNodeId) {
        setSwipeDirection(1);
        setTimeout(() => onAnswer(node.options[1].nextNodeId), 100);
      }
    } else if (offset < -threshold || velocity < -500) {
      // Left swipe - select left option
      if (node.options[0]?.nextNodeId) {
        setSwipeDirection(-1);
        setTimeout(() => onAnswer(node.options[0].nextNodeId), 100);
      }
    }
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
      setSwipeDirection(optionIndex === 0 ? -1 : 1);
      setTimeout(() => onAnswer(option.nextNodeId), 100);
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
        return <AlertTriangle className="h-8 w-8 text-blue-600" />;
      case "end":
        return <CheckCircle className="h-8 w-8 text-green-600" />;
      case "callout":
        return <AlertTriangle className="h-8 w-8 text-orange-600" />;
      case "infocard":
        return <Info className="h-8 w-8 text-purple-600" />;
      default:
        return null;
    }
  };

  const getCardColor = () => {
    switch (node.type) {
      case "question":
        return "from-blue-50 via-blue-100 to-blue-50 border-blue-200/50";
      case "end":
        return "from-green-50 via-green-100 to-green-50 border-green-200/50";
      case "callout":
        return "from-orange-50 via-orange-100 to-orange-50 border-orange-200/50";
      case "infocard":
        return "from-purple-50 via-purple-100 to-purple-50 border-purple-200/50";
      default:
        return "from-gray-50 via-gray-100 to-gray-50 border-gray-200/50";
    }
  };

  const getBackgroundGradient = () => {
    switch (node.type) {
      case "question":
        return "from-blue-500/10 to-indigo-500/10";
      case "end":
        return "from-green-500/10 to-emerald-500/10";
      case "callout":
        return "from-orange-500/10 to-red-500/10";
      case "infocard":
        return "from-purple-500/10 to-pink-500/10";
      default:
        return "from-gray-500/10 to-slate-500/10";
    }
  };

  if (node.type === "question") {
    return (
      <div
        className={`relative min-h-screen bg-gradient-to-br ${getBackgroundGradient()}`}
      >
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/3 rounded-full blur-3xl" />
        </div>

        <div className="relative flex flex-col items-center justify-center min-h-screen p-6 space-y-12">
          {/* Card Stack Container */}
          <div className="relative">
            {/* Background Cards (for stacking effect) */}
            <motion.div
              className={`absolute inset-0 w-80 h-96 bg-gradient-to-br ${getCardColor()} rounded-3xl shadow-lg border backdrop-blur-sm`}
              variants={backgroundCardVariants}
              initial="hidden"
              animate="visible"
              style={{ zIndex: 1 }}
            />

            {/* Main Card */}
            <AnimatePresence mode="wait" custom={swipeDirection}>
              <motion.div
                key={cardKey}
                className={`relative w-80 h-96 bg-gradient-to-br ${getCardColor()} rounded-3xl shadow-2xl border backdrop-blur-sm overflow-hidden`}
                custom={swipeDirection}
                initial={{
                  x: swipeDirection > 0 ? 1000 : -1000,
                  opacity: 0,
                  scale: 0.8,
                  rotateY: swipeDirection > 0 ? -15 : 15,
                }}
                animate={
                  isShaking
                    ? {
                        x: [-10, 10, -10, 10, 0],
                        rotate: [-1, 1, -1, 1, 0],
                        opacity: 1,
                        scale: 1,
                        rotateY: 0,
                      }
                    : {
                        x: 0,
                        opacity: 1,
                        scale: 1,
                        rotateY: 0,
                      }
                }
                exit={{
                  x: swipeDirection < 0 ? 1000 : -1000,
                  opacity: 0,
                  scale: 0.8,
                  rotateY: swipeDirection < 0 ? 15 : -15,
                }}
                transition={
                  isShaking
                    ? { duration: 0.5 }
                    : { duration: 0.4, ease: "easeOut" }
                }
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                }}
                whileTap={{ scale: 0.95 }}
                style={{
                  cursor: "grab",
                  zIndex: 10,
                }}
              >
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/5" />

                <div className="relative h-full flex flex-col justify-between p-8">
                  <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      className="p-4 bg-white/80 rounded-full shadow-lg"
                    >
                      {getNodeIcon()}
                    </motion.div>
                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="text-xl font-bold text-gray-800 leading-relaxed"
                    >
                      {node.text}
                    </motion.h2>
                  </div>

                  {/* Swipe indicators */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="bg-white/60 backdrop-blur-sm rounded-2xl p-4"
                  >
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="font-medium">Swipe left</span>
                      </div>
                      <div className="w-px h-6 bg-gray-300" />
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Swipe right</span>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Answer Options */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="w-full max-w-2xl space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Option */}
              {node.options[0] && (
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="group"
                >
                  <Button
                    onClick={() => handleOptionClick(0)}
                    disabled={isTransitioning || !node.options[0].nextNodeId}
                    className="w-full h-16 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-2xl shadow-lg border-0 transition-all duration-200 group-hover:shadow-2xl"
                  >
                    <ArrowLeft className="h-5 w-5 mr-3 transition-transform group-hover:-translate-x-1" />
                    {node.options[0].label}
                  </Button>
                </motion.div>
              )}

              {/* Right Option */}
              {node.options[1] && (
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="group"
                >
                  <Button
                    onClick={() => handleOptionClick(1)}
                    disabled={isTransitioning || !node.options[1].nextNodeId}
                    className="w-full h-16 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-2xl shadow-lg border-0 transition-all duration-200 group-hover:shadow-2xl"
                  >
                    {node.options[1].label}
                    <ArrowRight className="h-5 w-5 ml-3 transition-transform group-hover:translate-x-1" />
                  </Button>
                </motion.div>
              )}
            </div>

            {/* Challenge Option (if exists) */}
            {node.options[2] && (
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex justify-center group"
              >
                <Button
                  onClick={() => handleOptionClick(2)}
                  disabled={isTransitioning}
                  variant="outline"
                  className="h-14 px-8 bg-gradient-to-r from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-200 border-yellow-300 text-yellow-800 font-semibold rounded-2xl shadow-lg transition-all duration-200 group-hover:shadow-2xl"
                >
                  <ArrowDown className="h-5 w-5 mr-3 transition-transform group-hover:translate-y-1" />
                  {node.options[2].label}
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  // Non-question nodes (end, callout, infocard)
  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${getBackgroundGradient()}`}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/3 rounded-full blur-3xl" />
      </div>

      <div className="relative flex flex-col items-center justify-center min-h-screen p-6">
        <motion.div
          className={`w-full max-w-lg bg-gradient-to-br ${getCardColor()} rounded-3xl shadow-2xl border backdrop-blur-sm overflow-hidden`}
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.645, 0.045, 0.355, 1.0] }}
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/5" />

          <div className="relative p-8 text-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex items-center justify-center mb-6 p-4 bg-white/80 rounded-full shadow-lg mx-auto w-fit"
            >
              {getNodeIcon()}
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-xl font-bold text-gray-800 leading-relaxed mb-8"
            >
              {node.text}
            </motion.h2>

            {node.type !== "end" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handleContinue}
                  disabled={isTransitioning}
                  className="w-full h-14 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-2xl shadow-lg border-0"
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
    </div>
  );
}
