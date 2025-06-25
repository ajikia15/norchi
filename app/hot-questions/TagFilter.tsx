"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

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
}

export default function TagFilter({
  selectedTags,
  onTagToggle,
  onClearAll,
}: TagFilterProps) {
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

        {selectedTags.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearAll}
            className="text-gray-600 hover:text-gray-900"
          >
            <X className="h-4 w-4 mr-1" />
            გასუფთავება
          </Button>
        )}
      </div>

      {/* Tags Row */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-3 pb-2" style={{ width: "max-content" }}>
          {PREDEFINED_TAGS.map((tag, index) => {
            const isSelected = selectedTags.includes(tag.id);

            return (
              <motion.button
                key={tag.id}
                className={`
                  relative p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 flex-shrink-0
                  ${
                    isSelected
                      ? "shadow-md"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                  }
                `}
                style={{
                  borderColor: isSelected ? tag.color : undefined,
                  backgroundColor: isSelected ? tag.color : undefined,
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
                whileTap={{ scale: 0.95 }}
              >
                {/* Tag content */}
                <div className="text-center">
                  <div className="text-2xl mb-2">{tag.emoji}</div>
                  <div
                    className={`text-sm font-medium leading-tight ${
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
    </motion.div>
  );
}
