"use client";

import { useState } from "react";
import { VideoPromise } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  ExternalLink,
  Check,
  X,
} from "lucide-react";

interface VideoPromisesManagerClientProps {
  videoPromises: VideoPromise[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  onVideoPromiseCreate: (ytVideoId: string, title: string) => Promise<void>;
  onVideoPromiseUpdate: (
    id: string,
    ytVideoId: string,
    title: string
  ) => Promise<void>;
  onVideoPromiseDelete: (id: string) => Promise<void>;
  onPageChange: (page: number) => void;
  onAlgorithmPointsUpdate?: (
    id: string,
    algorithmPoints: number
  ) => Promise<void>;
  isLoading: boolean;
}

export default function VideoPromisesManagerClient({
  videoPromises,
  pagination,
  onVideoPromiseCreate,
  onVideoPromiseUpdate,
  onVideoPromiseDelete,
  onPageChange,
  onAlgorithmPointsUpdate,
  isLoading,
}: VideoPromisesManagerClientProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingVideoPromise, setEditingVideoPromise] =
    useState<VideoPromise | null>(null);
  const [editingAlgorithmPoints, setEditingAlgorithmPoints] = useState<{
    videoPromiseId: string;
    value: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    ytVideoId: "",
    title: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAlgorithmPointsEdit = (videoPromise: VideoPromise) => {
    if (isLoading) return;

    setEditingAlgorithmPoints({
      videoPromiseId: videoPromise.id,
      value: videoPromise.algorithmPoints.toString(),
    });
  };

  const handleAlgorithmPointsSave = async (videoPromiseId: string) => {
    if (!editingAlgorithmPoints || !onAlgorithmPointsUpdate) return;

    const newValue = parseInt(editingAlgorithmPoints.value);
    if (isNaN(newValue) || newValue < 0) {
      alert("ალგორითმული ქულები უნდა იყოს დადებითი რიცხვი");
      return;
    }

    try {
      await onAlgorithmPointsUpdate(videoPromiseId, newValue);
      setEditingAlgorithmPoints(null);
    } catch (error) {
      console.error("Error updating algorithm points:", error);
      alert("ალგორითმული ქულების განახლება ვერ მოხერხდა");
    }
  };

  const handleAlgorithmPointsCancel = () => {
    setEditingAlgorithmPoints(null);
  };

  const resetForm = () => {
    setFormData({
      ytVideoId: "",
      title: "",
    });
  };

  const handleCreate = async () => {
    if (!formData.ytVideoId.trim() || !formData.title.trim() || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onVideoPromiseCreate(
        formData.ytVideoId.trim(),
        formData.title.trim()
      );
      resetForm();
      setIsCreateDialogOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (videoPromise: VideoPromise) => {
    if (isLoading) return;

    setEditingVideoPromise(videoPromise);
    setFormData({
      ytVideoId: videoPromise.ytVideoId,
      title: videoPromise.title,
    });
    setIsCreateDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (
      !editingVideoPromise ||
      !formData.ytVideoId.trim() ||
      !formData.title.trim() ||
      isSubmitting
    ) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onVideoPromiseUpdate(
        editingVideoPromise.id,
        formData.ytVideoId.trim(),
        formData.title.trim()
      );
      resetForm();
      setEditingVideoPromise(null);
      setIsCreateDialogOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (videoPromise: VideoPromise) => {
    if (isLoading) return;

    if (
      window.confirm(
        `დარწმუნებული ხართ, რომ გსურთ წაშალოთ "${videoPromise.title}"?`
      )
    ) {
      await onVideoPromiseDelete(videoPromise.id);
    }
  };

  const handleDialogClose = () => {
    if (isSubmitting) return;

    setIsCreateDialogOpen(false);
    setEditingVideoPromise(null);
    resetForm();
  };

  const getYouTubeUrl = (ytVideoId: string) => {
    return `https://youtube.com/shorts/${ytVideoId}`;
  };

  const generatePaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    if (pagination.totalPages <= maxVisiblePages) {
      // Show all pages if total pages is small
      for (let i = 1; i <= pagination.totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => onPageChange(i)}
              isActive={pagination.currentPage === i}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Show truncated pagination for large page counts
      const showStartEllipsis = pagination.currentPage > 3;
      const showEndEllipsis =
        pagination.currentPage < pagination.totalPages - 2;

      // Always show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => onPageChange(1)}
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

      // Show pages around current page
      const start = Math.max(2, pagination.currentPage - 1);
      const end = Math.min(
        pagination.totalPages - 1,
        pagination.currentPage + 1
      );

      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => onPageChange(i)}
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

      // Always show last page (if more than 1 page)
      if (pagination.totalPages > 1) {
        items.push(
          <PaginationItem key={pagination.totalPages}>
            <PaginationLink
              onClick={() => onPageChange(pagination.totalPages)}
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
    <Card className="w-full max-w-none">
      <CardHeader>
        <CardTitle>ვიდეო დაპირებების მენეჯერი</CardTitle>
      </CardHeader>
      <CardContent className="px-6">
        <div className="flex justify-between mb-4">
          <div className="text-sm text-gray-600">
            სულ: {pagination.totalItems} ვიდეო დაპირება
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            ახალი ვიდეო დაპირება
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>სათაური</TableHead>
              <TableHead>YouTube Video ID</TableHead>
              <TableHead>რეალური ვოუთები</TableHead>
              <TableHead>ალგორითმული ქულები</TableHead>
              <TableHead>სულ გამოჩენა</TableHead>
              <TableHead>ბმული</TableHead>
              <TableHead className="text-right">მოქმედებები</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  <Loader2 className="h-6 w-6 animate-spin inline-block" />
                </TableCell>
              </TableRow>
            ) : videoPromises.length > 0 ? (
              videoPromises.map((videoPromise) => (
                <TableRow key={videoPromise.id}>
                  <TableCell className="font-medium">
                    {videoPromise.title}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {videoPromise.ytVideoId}
                  </TableCell>
                  <TableCell className="text-center">
                    {videoPromise.upvoteCount}
                  </TableCell>
                  <TableCell className="text-center">
                    {editingAlgorithmPoints?.videoPromiseId ===
                    videoPromise.id ? (
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="0"
                          value={editingAlgorithmPoints.value}
                          onChange={(e) =>
                            setEditingAlgorithmPoints({
                              ...editingAlgorithmPoints,
                              value: e.target.value,
                            })
                          }
                          className="w-20 h-8"
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            handleAlgorithmPointsSave(videoPromise.id)
                          }
                          className="h-8 w-8 p-0"
                        >
                          <Check className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={handleAlgorithmPointsCancel}
                          className="h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    ) : (
                      <div
                        className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                        onClick={() => handleAlgorithmPointsEdit(videoPromise)}
                      >
                        {videoPromise.algorithmPoints}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-center font-semibold">
                    {videoPromise.upvoteCount + videoPromise.algorithmPoints}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" asChild>
                      <a
                        href={getYouTubeUrl(videoPromise.ytVideoId)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4" />
                        YouTube
                      </a>
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(videoPromise)}
                      disabled={isLoading}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(videoPromise)}
                      disabled={isLoading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  ვიდეო დაპირებები არ მოიძებნა.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-4 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => onPageChange(pagination.currentPage - 1)}
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
                    onClick={() => onPageChange(pagination.currentPage + 1)}
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

        {/* Create/Edit Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={handleDialogClose}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingVideoPromise
                  ? "ვიდეო დაპირების რედაქტირება"
                  : "ახალი ვიდეო დაპირება"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">სათაური</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="შეიყვანეთ ვიდეო დაპირების სათაური..."
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ytVideoId">YouTube Video ID</Label>
                <Input
                  id="ytVideoId"
                  value={formData.ytVideoId}
                  onChange={(e) =>
                    setFormData({ ...formData, ytVideoId: e.target.value })
                  }
                  placeholder="მაგ: sfOxCDr4ZoI"
                  disabled={isSubmitting}
                />
                <p className="text-sm text-gray-500">
                  შეიყვანეთ მხოლოდ Video ID (არა სრული URL)
                </p>
              </div>

              {formData.ytVideoId && (
                <div className="space-y-2">
                  <Label>ვიდეოს ბმული:</Label>
                  <p className="text-sm font-mono break-all bg-gray-100 p-2 rounded">
                    {getYouTubeUrl(formData.ytVideoId)}
                  </p>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={handleDialogClose}
                disabled={isSubmitting}
              >
                გაუქმება
              </Button>
              <Button
                onClick={editingVideoPromise ? handleUpdate : handleCreate}
                disabled={
                  isSubmitting ||
                  !formData.title.trim() ||
                  !formData.ytVideoId.trim()
                }
              >
                {isSubmitting && (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                )}
                {editingVideoPromise ? "განახლება" : "შექმნა"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
