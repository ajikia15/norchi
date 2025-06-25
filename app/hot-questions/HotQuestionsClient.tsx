"use client";

import { useMemo, useTransition, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { HotTopic } from "../types";
import TagFilter, { PREDEFINED_TAGS } from "./TagFilter";
import HotQuestionsGrid from "./HotQuestionsGrid";
import { getTagsFromSearchParams, updateTagsInURL } from "../lib/url-utils";

interface HotQuestionsClientProps {
  topics: HotTopic[];
}

export default function HotQuestionsClient({
  topics,
}: HotQuestionsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Get selected tags from URL
  const selectedTags = useMemo(() => {
    return getTagsFromSearchParams(searchParams);
  }, [searchParams]);

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

  // Function to update URL with new tag selection
  const updateURL = useCallback(
    (newTags: string[]) => {
      const queryString = updateTagsInURL(searchParams, newTags);
      const newURL = queryString ? `?${queryString}` : window.location.pathname;

      startTransition(() => {
        router.replace(newURL, { scroll: false });
      });
    },
    [router, searchParams]
  );

  const handleTagToggle = useCallback(
    (tagId: string) => {
      const newSelectedTags = selectedTags.includes(tagId)
        ? selectedTags.filter((id) => id !== tagId)
        : [...selectedTags, tagId];

      updateURL(newSelectedTags);
    },
    [selectedTags, updateURL]
  );

  const handleClearAll = useCallback(() => {
    updateURL([]);
  }, [updateURL]);

  return (
    <div>
      {/* Tag Filter */}
      <div className="relative">
        <TagFilter
          selectedTags={selectedTags}
          onTagToggle={handleTagToggle}
          onClearAll={handleClearAll}
          isLoading={isPending}
        />
      </div>

      {/* Results Grid */}
      <div className="relative">
        {/* Results overlay when loading */}
        {isPending && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-md rounded-xl z-50 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
              <p className="text-sm text-gray-600">კითხვების ძებნა...</p>
            </div>
          </div>
        )}

        <HotQuestionsGrid topics={filteredTopics} />
      </div>
    </div>
  );
}
