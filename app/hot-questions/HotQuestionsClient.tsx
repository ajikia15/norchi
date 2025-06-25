"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HotTopic } from "../types";
import TagFilter, { PREDEFINED_TAGS } from "./TagFilter";
import HotQuestionsGrid from "./HotQuestionsGrid";

interface HotQuestionsClientProps {
  topics: HotTopic[];
}

export default function HotQuestionsClient({
  topics,
}: HotQuestionsClientProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Filter topics based on selected tags
  const filteredTopics = useMemo(() => {
    if (selectedTags.length === 0) {
      return topics;
    }

    return topics.filter((topic) => {
      // Check if topic has at least one of the selected tags
      if (!topic.tagData || topic.tagData.length === 0) {
        return false;
      }

      // Convert predefined tag IDs to actual tag labels for comparison
      const selectedTagLabels = selectedTags
        .map((tagId) => {
          const predefinedTag = PREDEFINED_TAGS.find((t) => t.id === tagId);
          return predefinedTag?.label;
        })
        .filter(Boolean) as string[];

      // Check if any of the topic's tags match any of the selected tags
      return topic.tagData.some((tag) => selectedTagLabels.includes(tag.label));
    });
  }, [topics, selectedTags]);

  const handleTagToggle = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleClearAll = () => {
    setSelectedTags([]);
  };

  return (
    <div>
      {/* Tag Filter */}
      <TagFilter
        selectedTags={selectedTags}
        onTagToggle={handleTagToggle}
        onClearAll={handleClearAll}
      />

      {/* Results Summary */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            {selectedTags.length === 0
              ? `ყველა კითხვა (${topics.length})`
              : `გაფილტრული შედეგები: ${filteredTopics.length} კითხვა`}
          </p>

          <p
            className={`text-amber-600 text-sm transition-opacity duration-300 ${
              selectedTags.length > 0 && filteredTopics.length === 0
                ? "opacity-100"
                : "opacity-0"
            }`}
          >
            არცერთი კითხვა არ მოიძებნა არჩეული კატეგორიებით
          </p>
        </div>
      </div>

      {/* Results Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${selectedTags.join("-")}-${filteredTopics.length}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {filteredTopics.length > 0 ? (
            <HotQuestionsGrid topics={filteredTopics} />
          ) : selectedTags.length > 0 ? (
            // Empty state when no results found
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                კითხვები ვერ მოიძებნა
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                არჩეული კატეგორიებით შესაბამისი კითხვები არ არსებობს. სცადეთ
                სხვა კატეგორიების არჩევა.
              </p>
              <button
                onClick={handleClearAll}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                ყველა ფილტრის გასუფთავება
              </button>
            </motion.div>
          ) : null}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
