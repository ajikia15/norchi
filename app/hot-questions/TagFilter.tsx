"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, Loader2 } from "lucide-react";

// Static predefined tags - these can't be retrieved from DB as per requirements
export const PREDEFINED_TAGS = [
  { id: "economics", emoji: "💰", label: "ეკონომიკა", color: "#10b981" },
  { id: "education", emoji: "📚", label: "განათლება", color: "#3b82f6" },
  { id: "healthcare", emoji: "🏥", label: "ჯანდაცვა", color: "#ef4444" },
  { id: "politics", emoji: "🏛️", label: "პოლიტიკა", color: "#8b5cf6" },
  { id: "environment", emoji: "🌱", label: "გარემო", color: "#22c55e" },
  { id: "technology", emoji: "💻", label: "ტექნოლოგია", color: "#06b6d4" },
  { id: "culture", emoji: "🎭", label: "კულტურა", color: "#f59e0b" },
  { id: "society", emoji: "👥", label: "საზოგადოება", color: "#64748b" },
  { id: "law", emoji: "⚖️", label: "იურიდიული", color: "#dc2626" },
  { id: "business", emoji: "🏢", label: "ბიზნესი", color: "#0891b2" },
  { id: "media", emoji: "📺", label: "მედია", color: "#9333ea" },
  { id: "rights", emoji: "✊", label: "უფლებები", color: "#ea580c" },
] as const;

interface TagFilterProps {
  selectedTags: string[];
  onTagToggle: (tagId: string) => void;
  onClearAll: () => void;
  isLoading?: boolean;
}

export default function TagFilter({
  selectedTags,
  onTagToggle,
  onClearAll,
  isLoading = false,
}: TagFilterProps) {
  const hasSelectedTags = selectedTags.length > 0;

  return (
    <motion.div
      className="bg-white rounded-xl border border-gray-200 p-6 mb-8 shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            ფილტრი კატეგორიებით
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            აირჩიე კატეგორიები საინტერესო თემების სანახავად
          </p>
        </div>

        {/* Conditional Button: Clear or Loading */}
        <div
          className={`transition-opacity duration-300 ${
            hasSelectedTags || isLoading ? "opacity-100" : "opacity-0"
          }`}
        >
          <Button
            variant="outline"
            size="sm"
            onClick={onClearAll}
            disabled={!hasSelectedTags || isLoading}
            className="text-gray-600 hover:text-gray-900 min-w-[120px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                განახლება...
              </>
            ) : (
              <>
                <X className="h-4 w-4 mr-1" />
                გასუფთავება
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Tags Row */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="grid grid-cols-12 gap-3 pb-2 min-w-max">
          {PREDEFINED_TAGS.map((tag, index) => {
            const isSelected = selectedTags.includes(tag.id);

            return (
              <motion.button
                key={tag.id}
                className={`
                  relative p-4 rounded-lg border-2 transition-all duration-200 min-w-0
                  ${isSelected ? "shadow-md" : "border-gray-200 bg-white"}
                  ${isLoading ? "pointer-events-none opacity-70" : ""}
                `}
                style={
                  {
                    borderColor: isSelected ? tag.color : undefined,
                    backgroundColor: isSelected ? tag.color : undefined,
                    "--hover-border-color": tag.color,
                  } as React.CSSProperties & { "--hover-border-color": string }
                }
                onMouseEnter={(e) => {
                  if (!isSelected && !isLoading) {
                    e.currentTarget.style.borderColor = tag.color;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected && !isLoading) {
                    e.currentTarget.style.borderColor = "#e5e7eb"; // gray-200
                  }
                }}
                onClick={() => onTagToggle(tag.id)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.02,
                  type: "spring",
                  stiffness: 400,
                  damping: 25,
                }}
                whileTap={!isLoading ? { scale: 0.98 } : {}}
                disabled={isLoading}
              >
                {/* Subtle pulse animation for selected tags */}
                {isSelected && (
                  <motion.div
                    className="absolute inset-0 rounded-lg"
                    style={{ backgroundColor: tag.color }}
                    animate={{ opacity: [0.8, 1, 0.8] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                )}

                {/* Tag content */}
                <div className="relative text-center z-10">
                  <div className="text-2xl mb-2">{tag.emoji}</div>
                  <div
                    className={`text-sm font-medium leading-tight transition-colors duration-200 break-words ${
                      isSelected ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {tag.label}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Scroll hint for mobile */}
      <div className="mt-2 text-center sm:hidden">
        <span className="text-xs text-gray-400">
          ← გასრიალეთ მეტი კატეგორიებისთვის →
        </span>
      </div>
    </motion.div>
  );
}
