"use client";

import { useState } from "react";
import { Video } from "../types";
import VideoCard from "./VideoCard";
import { toggleVideoPromiseUpvote } from "../lib/actions";
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PromisesClientProps {
  videoPromises: Video[];
  upvotedPromises: Record<string, boolean>;
  userId?: string;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export default function PromisesClient({
  videoPromises,
  upvotedPromises,
  userId,
  pagination,
}: PromisesClientProps) {
  // State for tracking which videos are playing
  const [currentlyPlayingVideo, setCurrentlyPlayingVideo] = useState<
    string | null
  >(null);

  // Initialize local state for upvotes and counts - these should reset on each page
  const [localUpvotes, setLocalUpvotes] =
    useState<Record<string, boolean>>(upvotedPromises);
  const [localCounts, setLocalCounts] = useState<Record<string, number>>(() => {
    const counts: Record<string, number> = {};
    videoPromises.forEach((promise) => {
      counts[promise.id] = promise.upvoteCount + promise.algorithmPoints;
    });
    return counts;
  });

  // Handler for when a video starts playing
  const handleVideoPlay = (videoPromiseId: string) => {
    setCurrentlyPlayingVideo(videoPromiseId);
  };

  // Handler for when a video stops playing
  const handleVideoStop = (videoPromiseId: string) => {
    if (currentlyPlayingVideo === videoPromiseId) {
      setCurrentlyPlayingVideo(null);
    }
  };

  const handleUpvote = async (videoPromiseId: string) => {
    if (!userId) {
      toast.error("უნდა იყოთ ავტორიზებული ვოუთის მისაცემად");
      return;
    }

    // Optimistic update
    const wasUpvoted = localUpvotes[videoPromiseId];
    const newUpvoteState = !wasUpvoted;

    setLocalUpvotes((prev) => ({
      ...prev,
      [videoPromiseId]: newUpvoteState,
    }));

    setLocalCounts((prev) => ({
      ...prev,
      [videoPromiseId]: prev[videoPromiseId] + (newUpvoteState ? 1 : -1),
    }));

    try {
      const result = await toggleVideoPromiseUpvote(videoPromiseId, userId);

      if (!result.success) {
        // Revert optimistic update on error
        setLocalUpvotes((prev) => ({
          ...prev,
          [videoPromiseId]: wasUpvoted,
        }));
        setLocalCounts((prev) => ({
          ...prev,
          [videoPromiseId]: prev[videoPromiseId] + (wasUpvoted ? 1 : -1),
        }));

        toast.error("ვოუთის მიცემა ვერ მოხერხდა");
      } else {
        if (result.action === "added") {
          toast.success("ვოუთი მიცემულია!");
        } else {
          toast.success("ვოუთი გაუქმებულია");
        }
      }
    } catch (error) {
      // Revert optimistic update on error
      setLocalUpvotes((prev) => ({
        ...prev,
        [videoPromiseId]: wasUpvoted,
      }));
      setLocalCounts((prev) => ({
        ...prev,
        [videoPromiseId]: prev[videoPromiseId] + (wasUpvoted ? 1 : -1),
      }));

      console.error("Error toggling upvote:", error);
      toast.error("ვოუთის მიცემა ვერ მოხერხდა");
    }
  };

  const generatePaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    if (pagination.totalPages <= maxVisiblePages) {
      for (let i = 1; i <= pagination.totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href={`/promises?page=${i}`}
              isActive={pagination.currentPage === i}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      const showStartEllipsis = pagination.currentPage > 3;
      const showEndEllipsis =
        pagination.currentPage < pagination.totalPages - 2;

      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            href={`/promises?page=1`}
            isActive={pagination.currentPage === 1}
            className="cursor-pointer"
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      if (showStartEllipsis) {
        items.push(
          <PaginationItem key="start-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      const start = Math.max(2, pagination.currentPage - 1);
      const end = Math.min(
        pagination.totalPages - 1,
        pagination.currentPage + 1
      );

      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href={`/promises?page=${i}`}
              isActive={pagination.currentPage === i}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if (showEndEllipsis) {
        items.push(
          <PaginationItem key="end-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      if (pagination.totalPages > 1) {
        items.push(
          <PaginationItem key={pagination.totalPages}>
            <PaginationLink
              href={`/promises?page=${pagination.totalPages}`}
              isActive={pagination.currentPage === pagination.totalPages}
              className="cursor-pointer"
            >
              {pagination.totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
  };

  return (
    <>
      {videoPromises.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {videoPromises.map((videoPromise) => {
              // Create enhanced video promise with local state
              const enhancedVideoPromise = {
                ...videoPromise,
                upvoteCount:
                  localCounts[videoPromise.id] - videoPromise.algorithmPoints,
              };

              return (
                <VideoCard
                  key={videoPromise.id}
                  videoPromise={enhancedVideoPromise}
                  isUpvoted={localUpvotes[videoPromise.id] || false}
                  onUpvote={userId ? handleUpvote : undefined}
                  onVideoPlay={handleVideoPlay}
                  onVideoStop={handleVideoStop}
                  currentlyPlayingVideo={currentlyPlayingVideo}
                />
              );
            })}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href={`/promises?page=${pagination.currentPage - 1}`}
                      className={
                        !pagination.hasPreviousPage
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {generatePaginationItems()}

                  <PaginationItem>
                    <PaginationNext
                      href={`/promises?page=${pagination.currentPage + 1}`}
                      className={
                        !pagination.hasNextPage
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            ვიდეო დაპირებები ჯერ არ არის ატვირთული.
          </p>
        </div>
      )}
    </>
  );
}
