"use client";

import { useState, useCallback, useEffect } from "react";
import {
  motion,
  PanInfo,
  useMotionValue,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { Node } from "../types";
import {
  ArrowLeft,
  ArrowRight,
  ArrowDown,
  CheckCircle,
  AlertTriangle,
  Info,
  Sparkles,
} from "lucide-react";
import StoryProgressBar from "./StoryProgressBar";
import Logo from "./Logo";

interface GameCardProps {
  node: Node;
  onAnswer: (nextNodeId: string, isChallenge?: boolean) => void;
  isTransitioning: boolean;
  currentStep?: number;
  totalSteps?: number;
}

export default function GameCard({
  node,
  onAnswer,
  isTransitioning,
  currentStep = 1,
  totalSteps = 10,
}: GameCardProps) {
  const [isShaking, setIsShaking] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [hasReachedThreshold, setHasReachedThreshold] = useState(false);

  // Prevent scrolling when component mounts and restore when unmounts
  useEffect(() => {
    // Add classes to prevent scrolling
    document.documentElement.classList.add("game-active");
    document.body.classList.add("game-active");

    // Cleanup function to restore scrolling
    return () => {
      // Delay removal to prevent flashing during transitions
      setTimeout(() => {
        document.documentElement.classList.remove("game-active");
        document.body.classList.remove("game-active");
      }, 100);
    };
  }, []);

  // Enhanced Framer Motion values for smooth animations
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Improved thresholds based on dating app best practices
  const SWIPE_CONFIDENCE_THRESHOLD = 300; // Increased from 150px - requires more deliberate action
  const VISUAL_FEEDBACK_THRESHOLD = 120; // Visual feedback starts here
  const QUICK_SWIPE_VELOCITY = 1200; // Increased from 800 - faster swipes need more intention
  const QUICK_SWIPE_MIN_DISTANCE = 100; // Increased from 50px for quick swipes

  // Enhanced transform values with better curves
  const rotate = useTransform(x, [-400, 0, 400], [-25, 0, 25]);
  const opacity = useTransform(
    x,
    [-400, -VISUAL_FEEDBACK_THRESHOLD, 0, VISUAL_FEEDBACK_THRESHOLD, 400],
    [0.4, 0.9, 1, 0.9, 0.4]
  );

  // Improved overlay gradients with better visual feedback
  const leftOverlay = useTransform(
    x,
    [-400, -VISUAL_FEEDBACK_THRESHOLD, 0],
    [1, 0.7, 0]
  );
  const rightOverlay = useTransform(
    x,
    [0, VISUAL_FEEDBACK_THRESHOLD, 400],
    [0, 0.7, 1]
  );

  // Dynamic card scaling with threshold-based feedback
  const scale = useTransform(
    x,
    [-400, -VISUAL_FEEDBACK_THRESHOLD, 0, VISUAL_FEEDBACK_THRESHOLD, 400],
    [0.85, 0.95, 1, 0.95, 0.85]
  );

  // Enhanced glow effect with threshold awareness
  const glowOpacity = useTransform(
    x,
    [-VISUAL_FEEDBACK_THRESHOLD, 0, VISUAL_FEEDBACK_THRESHOLD],
    [0.4, 0, 0.4]
  );

  // Threshold-based visual feedback
  const leftThresholdOpacity = useTransform(
    x,
    [-SWIPE_CONFIDENCE_THRESHOLD, -VISUAL_FEEDBACK_THRESHOLD, 0],
    [1, 0.3, 0]
  );
  const rightThresholdOpacity = useTransform(
    x,
    [0, VISUAL_FEEDBACK_THRESHOLD, SWIPE_CONFIDENCE_THRESHOLD],
    [0, 0.3, 1]
  );

  // Track threshold crossing for haptic feedback simulation
  const handleDrag = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const currentX = info.offset.x;
      const reachedThreshold = Math.abs(currentX) >= SWIPE_CONFIDENCE_THRESHOLD;

      if (reachedThreshold !== hasReachedThreshold) {
        setHasReachedThreshold(reachedThreshold);
        // In a real app, you'd trigger haptic feedback here
        // navigator.vibrate?.(50);
      }
    },
    [hasReachedThreshold, SWIPE_CONFIDENCE_THRESHOLD]
  );

  const handleDragEnd = useCallback(
    (_event: unknown, info: PanInfo) => {
      const offset = info.offset.x;
      const velocity = Math.abs(info.velocity.x);

      if (node.type !== "question") return;

      // Reset threshold state
      setHasReachedThreshold(false);

      // Improved decision logic based on dating app best practices
      let shouldSwipe = false;

      // High confidence swipe: large distance
      if (Math.abs(offset) >= SWIPE_CONFIDENCE_THRESHOLD) {
        shouldSwipe = true;
      }
      // Quick flick: high velocity with reasonable distance
      else if (
        velocity >= QUICK_SWIPE_VELOCITY &&
        Math.abs(offset) >= QUICK_SWIPE_MIN_DISTANCE
      ) {
        shouldSwipe = true;
      }

      if (shouldSwipe) {
        // Set exiting state immediately to prevent snapping
        setIsExiting(true);

        // Consistent exit timing
        const exitDelay = 250;

        if (offset > 0) {
          // Right swipe - select right option
          if (node.options[1]?.nextNodeId) {
            setTimeout(() => onAnswer(node.options[1].nextNodeId), exitDelay);
          }
        } else {
          // Left swipe - select left option
          if (node.options[0]?.nextNodeId) {
            setTimeout(() => onAnswer(node.options[0].nextNodeId), exitDelay);
          }
        }
      } else {
        // Smoothly return to center without snapping
        x.set(0);
        y.set(0);
      }
    },
    [
      node,
      onAnswer,
      SWIPE_CONFIDENCE_THRESHOLD,
      QUICK_SWIPE_VELOCITY,
      QUICK_SWIPE_MIN_DISTANCE,
      x,
      y,
    ]
  );

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
      setIsExiting(true);
      setTimeout(() => onAnswer(option.nextNodeId), 200);
    }
  };

  const handleContinue = () => {
    if (isTransitioning) return;

    setIsExiting(true);
    setTimeout(() => {
      if (node.type === "infocard" && node.nextNodeId) {
        onAnswer(node.nextNodeId);
      } else if (node.type === "callout" && node.returnToNodeId) {
        onAnswer(node.returnToNodeId, true);
      }
    }, 200);
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
      <div className="fixed inset-0 w-full h-full overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 z-50">
        {/* Header with Logo and Progress Bar - Fixed at top */}
        <div className="absolute top-0 left-0 right-0 z-60 bg-gradient-to-b from-black/10 to-transparent pt-2 pb-4">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Logo
                href="/"
                size="sm"
                showSubtitle={false}
                className="text-white/90 drop-shadow-lg"
              />

              {/* Progress Bar */}
              <div className="flex-1 mx-4">
                <StoryProgressBar
                  currentStep={currentStep}
                  totalSteps={totalSteps}
                  currentNodeType={node.type}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced background overlays with neutral feedback */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-start pl-8 md:pl-20"
          style={{ opacity: leftOverlay }}
        >
          <motion.div
            className="flex flex-col items-center text-white drop-shadow-lg"
            animate={{
              scale:
                hasReachedThreshold && x.get() < -VISUAL_FEEDBACK_THRESHOLD
                  ? [1, 1.2, 1]
                  : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            <ArrowLeft className="h-12 w-12 md:h-20 md:w-20 mb-2 md:mb-4" />
            <span className="text-xl md:text-3xl font-bold">
              {node.options[0]?.label || "Left"}
            </span>
            <span className="text-sm md:text-lg opacity-90 mt-1 md:mt-2">
              Swipe Left
            </span>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute inset-0 bg-gradient-to-l from-purple-400 to-purple-600 flex items-center justify-end pr-8 md:pr-20"
          style={{ opacity: rightOverlay }}
        >
          <motion.div
            className="flex flex-col items-center text-white drop-shadow-lg"
            animate={{
              scale:
                hasReachedThreshold && x.get() > VISUAL_FEEDBACK_THRESHOLD
                  ? [1, 1.2, 1]
                  : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            <ArrowRight className="h-12 w-12 md:h-20 md:w-20 mb-2 md:mb-4" />
            <span className="text-xl md:text-3xl font-bold">
              {node.options[1]?.label || "Right"}
            </span>
            <span className="text-sm md:text-lg opacity-90 mt-1 md:mt-2">
              Swipe Right
            </span>
          </motion.div>
        </motion.div>

        {/* Threshold indicators for better UX feedback */}
        <motion.div
          className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 w-1 md:w-2 h-16 md:h-24 bg-white/30 rounded-full"
          style={{ opacity: leftThresholdOpacity }}
        />
        <motion.div
          className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 w-1 md:w-2 h-16 md:h-24 bg-white/30 rounded-full"
          style={{ opacity: rightThresholdOpacity }}
        />

        {/* Main Content Container */}
        <div className="relative w-full h-full flex flex-col items-center justify-center p-4 md:p-6 pt-20 md:pt-24">
          {/* Main Card with Enhanced Animations */}
          <AnimatePresence mode="wait">
            <motion.div
              key={node.id}
              className={`relative w-full max-w-xs md:max-w-sm h-[50vh] md:h-[60vh] max-h-[500px] bg-gradient-to-br ${getCardColor()} rounded-3xl shadow-2xl border-2 overflow-hidden cursor-grab active:cursor-grabbing touch-none`}
              style={{ x, y, rotate, opacity, scale }}
              drag
              dragSnapToOrigin
              dragElastic={0.3}
              dragMomentum={false}
              dragTransition={{
                bounceStiffness: 200,
                bounceDamping: 20,
                min: 0,
                max: 0,
              }}
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              onDrag={handleDrag}
              onDragEnd={handleDragEnd}
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={
                isShaking
                  ? {
                      x: [-10, 10, -10, 10, 0],
                      scale: 1,
                      opacity: 1,
                      y: 0,
                    }
                  : isExiting
                  ? {
                      scale: 0.8,
                      opacity: 0,
                      y: 50,
                    }
                  : {
                      scale: 1,
                      opacity: 1,
                      y: 0,
                    }
              }
              exit={{
                scale: 0.8,
                opacity: 0,
                y: 50,
                transition: { duration: 0.3 },
              }}
              transition={
                isShaking
                  ? { duration: 0.5 }
                  : { type: "spring", stiffness: 200, damping: 25 }
              }
              whileDrag={{ zIndex: 10 }}
            >
              {/* Enhanced glow effect with threshold awareness */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl"
                style={{
                  opacity: glowOpacity,
                }}
              />

              {/* Threshold reached indicator */}
              <motion.div
                className="absolute inset-0 rounded-3xl border-4 border-white/50"
                animate={{
                  opacity: hasReachedThreshold ? [0, 1, 0] : 0,
                }}
                transition={{
                  duration: 0.4,
                  repeat: hasReachedThreshold ? Infinity : 0,
                }}
              />

              <div className="flex flex-col h-full relative z-10">
                {/* Card Content */}
                <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
                  <motion.div
                    className="bg-white rounded-full p-4 md:p-6 shadow-lg mb-4 md:mb-8"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    {getNodeIcon()}
                  </motion.div>
                  <h2 className="text-lg md:text-2xl font-bold text-slate-800 text-center leading-relaxed px-2">
                    {node.text}
                  </h2>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Elegant Pill-Style Choice Buttons */}
          <motion.div
            className="mt-4 md:mt-8 w-full max-w-xs md:max-w-2xl px-2 md:px-4 space-y-4 md:space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-center gap-3 md:gap-6">
              {/* Left Option - Elegant Pill Button */}
              {node.options[0] && (
                <motion.button
                  onClick={() => {
                    handleOptionClick(0);
                  }}
                  disabled={isTransitioning || !node.options[0].nextNodeId}
                  className="flex-1 relative group cursor-pointer touch-manipulation"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <div className="relative bg-white hover:bg-gray-50 border border-gray-300 hover:border-gray-400 rounded-full px-4 py-3 md:px-6 md:py-4 transition-all duration-200">
                    <div className="flex items-center justify-center gap-2 md:gap-3">
                      <div className="bg-gray-100 group-hover:bg-gray-200 rounded-full p-1.5 md:p-2 transition-colors duration-200">
                        <ArrowLeft className="h-4 w-4 md:h-5 md:w-5 text-gray-600" />
                      </div>
                      <span className="font-medium text-gray-700 text-sm md:text-base">
                        {node.options[0].label}
                      </span>
                    </div>
                  </div>
                </motion.button>
              )}

              {/* Challenge Button - Smaller Elegant Button */}
              {node.options[2] && (
                <motion.button
                  onClick={() => {
                    handleOptionClick(2);
                  }}
                  disabled={isTransitioning}
                  className="relative group cursor-pointer touch-manipulation"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <div className="relative bg-amber-50 hover:bg-amber-100 border border-amber-300 hover:border-amber-400 rounded-full px-3 py-2.5 md:px-4 md:py-3 transition-all duration-200">
                    <div className="flex items-center justify-center gap-1.5 md:gap-2">
                      <div className="bg-amber-100 group-hover:bg-amber-200 rounded-full p-1 md:p-1.5 transition-colors duration-200">
                        <ArrowDown className="h-3 w-3 md:h-4 md:w-4 text-amber-600" />
                      </div>
                      <span className="font-medium text-amber-700 text-xs md:text-sm">
                        {node.options[2].label}
                      </span>
                    </div>
                  </div>
                </motion.button>
              )}

              {/* Right Option - Elegant Pill Button */}
              {node.options[1] && (
                <motion.button
                  onClick={() => {
                    handleOptionClick(1);
                  }}
                  disabled={isTransitioning || !node.options[1].nextNodeId}
                  className="flex-1 relative group cursor-pointer touch-manipulation"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <div className="relative bg-white hover:bg-gray-50 border border-gray-300 hover:border-gray-400 rounded-full px-4 py-3 md:px-6 md:py-4 transition-all duration-200">
                    <div className="flex items-center justify-center gap-2 md:gap-3">
                      <span className="font-medium text-gray-700 text-sm md:text-base">
                        {node.options[1].label}
                      </span>
                      <div className="bg-gray-100 group-hover:bg-gray-200 rounded-full p-1.5 md:p-2 transition-colors duration-200">
                        <ArrowRight className="h-4 w-4 md:h-5 md:w-5 text-gray-600" />
                      </div>
                    </div>
                  </div>
                </motion.button>
              )}
            </div>

            {/* Enhanced instruction text with pulsing animation */}
            <motion.div
              className="text-center space-y-1 md:space-y-2"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <p className="text-xs md:text-sm text-slate-600 font-medium">
                Make your choice
              </p>
              <p className="text-xs text-slate-400">
                Swipe firmly to choose, or tap a button
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Non-question nodes (end, callout, infocard) - Enhanced
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 z-50">
      {/* Header with Logo and Progress Bar - Fixed at top */}
      <div className="absolute top-0 left-0 right-0 z-60 bg-gradient-to-b from-black/10 to-transparent pt-2 pb-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Logo
              href="/"
              size="sm"
              showSubtitle={false}
              className="text-white/90 drop-shadow-lg"
            />

            {/* Progress Bar */}
            <div className="flex-1 mx-4">
              <StoryProgressBar
                currentStep={currentStep}
                totalSteps={totalSteps}
                currentNodeType={node.type}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="relative w-full h-full flex items-center justify-center p-4 md:p-6 pt-20 md:pt-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={node.id}
            className={`w-full max-w-lg h-auto bg-gradient-to-br ${getCardColor()} rounded-3xl shadow-2xl border-2 overflow-hidden`}
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={
              isExiting
                ? { scale: 0.8, opacity: 0, y: 50 }
                : { scale: 1, opacity: 1, y: 0 }
            }
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{
              duration: 0.5,
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
          >
            <div className="p-8 text-center">
              <motion.div
                className="flex items-center justify-center mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
              >
                <div className="bg-white rounded-full p-6 shadow-lg">
                  {getNodeIcon()}
                </div>
              </motion.div>
              <motion.h2
                className="text-2xl font-bold text-slate-800 leading-relaxed mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {node.text}
              </motion.h2>

              {node.type !== "end" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <motion.button
                    onClick={handleContinue}
                    disabled={isTransitioning}
                    className="relative overflow-hidden group w-full h-14 rounded-2xl shadow-lg border-0"
                    whileHover={{ y: -2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-600 to-slate-700 group-hover:from-slate-700 group-hover:to-slate-800 transition-all duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative z-10 text-white font-semibold">
                      {node.type === "callout"
                        ? node.buttonLabel || "Try Again"
                        : node.buttonLabel || "Continue"}
                    </span>
                    <motion.div
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100"
                      initial={false}
                      animate={{ rotate: [0, 360] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Sparkles className="h-4 w-4 text-white" />
                    </motion.div>
                  </motion.button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
