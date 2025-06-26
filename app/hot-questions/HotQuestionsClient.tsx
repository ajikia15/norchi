"use client";

import { useMemo, useTransition, useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { HotTopic } from "../types";
import TagFilter, { PREDEFINED_TAGS } from "./TagFilter";
import HotQuestionsGrid from "./HotQuestionsGrid";
import HotQuestionsGridSkeleton from "./HotQuestionsGridSkeleton";
import { getTagsFromSearchParams, updateTagsInURL } from "../lib/url-utils";

interface HotQuestionsClientProps {
  topics: HotTopic[];
  user?: { id: string } | null;
}

export default function HotQuestionsClient({
  topics,
  user,
}: HotQuestionsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Track optimistic updates during transitions
  const [pendingTags, setPendingTags] = useState<string[] | null>(null);

  // Get selected tags from URL
  const urlSelectedTags = useMemo(() => {
    return getTagsFromSearchParams(searchParams);
  }, [searchParams]);

  // Use pending tags during transition, otherwise use URL tags
  const selectedTags =
    isPending && pendingTags !== null ? pendingTags : urlSelectedTags;

  // Filter topics based on actual URL selected tags (not optimistic)
  const filteredTopics = useMemo(() => {
    if (urlSelectedTags.length === 0) {
      return topics;
    }

    return topics.filter((topic) => {
      // Check if topic has at least one of the selected tags
      if (!topic.tagData || topic.tagData.length === 0) {
        return false;
      }

      // Convert predefined tag IDs to actual tag labels for comparison
      const selectedTagLabels = urlSelectedTags
        .map((tagId) => {
          const predefinedTag = PREDEFINED_TAGS.find((t) => t.id === tagId);
          return predefinedTag?.label;
        })
        .filter(Boolean) as string[];

      // Check if any of the topic's tags match any of the selected tags
      return topic.tagData.some((tag) => selectedTagLabels.includes(tag.label));
    });
  }, [topics, urlSelectedTags]);

  // Function to update URL with new tag selection
  const updateURL = useCallback(
    (newTags: string[]) => {
      const queryString = updateTagsInURL(searchParams, newTags);
      const newURL = queryString ? `?${queryString}` : window.location.pathname;

      // Set optimistic state
      setPendingTags(newTags);

      startTransition(() => {
        router.replace(newURL, { scroll: false });
        // Clear pending state after transition
        setPendingTags(null);
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
        {isPending ? (
          <HotQuestionsGridSkeleton />
        ) : (
          <HotQuestionsGrid topics={filteredTopics} user={user} />
        )}
      </div>
    </div>
  );
}
