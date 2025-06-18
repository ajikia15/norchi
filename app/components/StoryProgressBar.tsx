import React from "react";
import { motion } from "framer-motion";
import { Node } from "../types";

interface StoryProgressBarProps {
  currentStep: number;
  totalSteps: number;
  currentNodeType: Node["type"];
}

const getNodeColor = (nodeType: Node["type"]) => {
  switch (nodeType) {
    case "question":
      return {
        bg: "from-green-400 to-green-600",
        glow: "shadow-green-400/50",
        shine: "from-green-200/90 to-transparent",
        stripeColor: "rgba(34, 197, 94, 0.4)", // green-500 with opacity
        secondaryStripe: "rgba(255, 255, 255, 0.3)",
      };
    case "callout":
      return {
        bg: "from-yellow-400 to-orange-500",
        glow: "shadow-yellow-400/50",
        shine: "from-yellow-200/90 to-transparent",
        stripeColor: "rgba(245, 158, 11, 0.5)", // amber-500 with opacity
        secondaryStripe: "rgba(255, 255, 255, 0.35)",
      };
    case "infocard":
      return {
        bg: "from-blue-400 to-blue-600",
        glow: "shadow-blue-400/50",
        shine: "from-blue-200/90 to-transparent",
        stripeColor: "rgba(59, 130, 246, 0.4)", // blue-500 with opacity
        secondaryStripe: "rgba(255, 255, 255, 0.3)",
      };
    case "end":
      return {
        bg: "from-purple-400 to-purple-600",
        glow: "shadow-purple-400/50",
        shine: "from-purple-200/90 to-transparent",
        stripeColor: "rgba(168, 85, 247, 0.4)", // purple-500 with opacity
        secondaryStripe: "rgba(255, 255, 255, 0.3)",
      };
    default:
      return {
        bg: "from-gray-400 to-gray-600",
        glow: "shadow-gray-400/50",
        shine: "from-gray-200/90 to-transparent",
        stripeColor: "rgba(107, 114, 128, 0.4)", // gray-500 with opacity
        secondaryStripe: "rgba(255, 255, 255, 0.3)",
      };
  }
};

const StoryProgressBar: React.FC<StoryProgressBarProps> = ({
  currentStep,
  totalSteps,
  currentNodeType,
}) => {
  const progress = Math.min((currentStep / Math.max(totalSteps, 1)) * 100, 100);
  const colors = getNodeColor(currentNodeType);

  return (
    <div className="w-full max-w-2xl mx-auto px-6 py-4">
      {/* Candy Bar Container */}
      <div className="relative h-6 bg-gray-200/60 rounded-full overflow-hidden border-2 border-white/80 shadow-lg backdrop-blur-sm">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-100/50 to-gray-200/50" />

        {/* Progress Fill */}
        <motion.div
          className={`absolute inset-y-0 left-0 bg-gradient-to-r ${colors.bg} shadow-lg ${colors.glow} overflow-hidden`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{
            duration: 0.8,
            ease: [0.4, 0, 0.2, 1],
          }}
        >
          {/* Animated Candy Stripes */}
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                ${colors.stripeColor} 0px,
                ${colors.stripeColor} 10px,
                transparent 10px,
                transparent 20px
              )`,
              backgroundSize: "28px 28px",
            }}
            animate={{
              x: [0, 28],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* Secondary Candy Stripes (opposite direction) */}
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundImage: `repeating-linear-gradient(
                -45deg,
                ${colors.secondaryStripe} 0px,
                ${colors.secondaryStripe} 8px,
                transparent 8px,
                transparent 16px
              )`,
              backgroundSize: "22px 22px",
            }}
            animate={{
              x: [0, -22],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* Candy Shine Effect */}
          <motion.div
            className={`absolute inset-0 bg-gradient-to-r ${colors.shine}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.6, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1,
              ease: "easeInOut",
            }}
          />

          {/* Candy Wrapper Highlights */}
          <div className="absolute inset-0">
            <motion.div
              className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-white/80 to-transparent"
              animate={{
                opacity: [0.4, 0.9, 0.4],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/60 to-transparent"
              animate={{
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: 1.25,
                ease: "easeInOut",
              }}
            />

            {/* Additional contrast edge */}
            <motion.div
              className="absolute top-1 left-0 right-0 h-px"
              style={{
                background: `linear-gradient(to right, transparent, ${colors.stripeColor}, transparent)`,
              }}
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </motion.div>

        {/* Candy Bar Segments/Notches */}
        <div className="absolute inset-0 flex">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="flex-1 border-r border-white/20 last:border-r-0"
              style={{ height: "100%" }}
            />
          ))}
        </div>

        {/* Top Highlight */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      </div>

      {/* Fun Progress Indicator */}
      <motion.div
        className="flex justify-center mt-2"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex gap-1">
          {[...Array(Math.min(totalSteps, 10))].map((_, i) => {
            const isActive = i < currentStep;
            return (
              <motion.div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  isActive ? `bg-gradient-to-r ${colors.bg}` : "bg-gray-300/60"
                }`}
                animate={{
                  scale: isActive ? [1, 1.3, 1] : 1,
                }}
                transition={{
                  duration: 0.3,
                  delay: i * 0.1,
                }}
              />
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default StoryProgressBar;
