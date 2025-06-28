"use client";

import { useState } from "react";
import { Video } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  WheelPicker,
  WheelPickerWrapper,
  type WheelPickerOption,
} from "@/components/wheel-picker";

interface VideoManagerClientProps {
  videos: Video[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  onVideoCreate: (
    ytVideoId: string,
    title: string,
    type: string,
    status: string,
    startTime?: number,
    endTime?: number
  ) => Promise<void>;
  onVideoUpdate: (
    id: string,
    ytVideoId: string,
    title: string,
    type: string,
    status: string,
    startTime?: number,
    endTime?: number
  ) => Promise<void>;
  onVideoDelete: (id: string) => Promise<void>;
  onPageChange: (page: number) => void;
  onAlgorithmPointsUpdate?: (
    id: string,
    algorithmPoints: number
  ) => Promise<void>;
  isLoading: boolean;
}

const VIDEO_TYPES = [
  { value: "promise", label: "დაპირება" },
  { value: "roast", label: "როასტი" },
  { value: "livestream", label: "ლაივსტრიმი" },
  { value: "best-moment", label: "საუკეთესო მომენტი" },
];

const VIDEO_STATUSES = [
  { value: "pending", label: "განხილვაში" },
  { value: "verified", label: "დამტკიცებული" },
];

export default function VideoManagerClient({
  videos,
  pagination,
  onVideoCreate,
  onVideoUpdate,
  onVideoDelete,
  onPageChange,
  onAlgorithmPointsUpdate,
  isLoading,
}: VideoManagerClientProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [editingAlgorithmPoints, setEditingAlgorithmPoints] = useState<{
    videoId: string;
    value: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    ytVideoId: "",
    title: "",
    type: "promise",
    status: "pending",
    startTimeHours: "0",
    startTimeMinutes: "0",
    startTimeSeconds: "0",
    endTimeHours: "0",
    endTimeMinutes: "0",
    endTimeSeconds: "0",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAlgorithmPointsEdit = (video: Video) => {
    if (isLoading) return;

    setEditingAlgorithmPoints({
      videoId: video.id,
      value: video.algorithmPoints.toString(),
    });
  };

  const handleAlgorithmPointsSave = async (videoId: string) => {
    if (!editingAlgorithmPoints || !onAlgorithmPointsUpdate) return;

    const newValue = parseInt(editingAlgorithmPoints.value);
    if (isNaN(newValue) || newValue < 0) {
      alert("ალგორითმული ქულები უნდა იყოს დადებითი რიცხვი");
      return;
    }

    try {
      await onAlgorithmPointsUpdate(videoId, newValue);
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
      type: "promise",
      status: "pending",
      startTimeHours: "0",
      startTimeMinutes: "0",
      startTimeSeconds: "0",
      endTimeHours: "0",
      endTimeMinutes: "0",
      endTimeSeconds: "0",
    });
  };

  const handleCreate = async () => {
    if (!formData.ytVideoId.trim() || !formData.title.trim() || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    try {
      const startTime =
        (parseInt(formData.startTimeHours) || 0) * 3600 +
        (parseInt(formData.startTimeMinutes) || 0) * 60 +
        (parseInt(formData.startTimeSeconds) || 0);
      const endTime =
        (parseInt(formData.endTimeHours) || 0) * 3600 +
        (parseInt(formData.endTimeMinutes) || 0) * 60 +
        (parseInt(formData.endTimeSeconds) || 0);

      await onVideoCreate(
        formData.ytVideoId.trim(),
        formData.title.trim(),
        formData.type,
        formData.status,
        startTime > 0 ? startTime : undefined,
        endTime > 0 ? endTime : undefined
      );
      resetForm();
      setIsCreateDialogOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (video: Video) => {
    if (isLoading) return;

    setEditingVideo(video);
    setFormData({
      ytVideoId: video.ytVideoId,
      title: video.title,
      type: video.type,
      status: video.status,
      startTimeHours: video.startTime
        ? Math.floor(video.startTime / 3600).toString()
        : "0",
      startTimeMinutes: video.startTime
        ? Math.floor((video.startTime % 3600) / 60).toString()
        : "0",
      startTimeSeconds: video.startTime
        ? (video.startTime % 60).toString()
        : "0",
      endTimeHours: video.endTime
        ? Math.floor(video.endTime / 3600).toString()
        : "0",
      endTimeMinutes: video.endTime
        ? Math.floor((video.endTime % 3600) / 60).toString()
        : "0",
      endTimeSeconds: video.endTime ? (video.endTime % 60).toString() : "0",
    });
    setIsCreateDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (
      !editingVideo ||
      !formData.ytVideoId.trim() ||
      !formData.title.trim() ||
      isSubmitting
    ) {
      return;
    }

    setIsSubmitting(true);
    try {
      const startTime =
        (parseInt(formData.startTimeHours) || 0) * 3600 +
        (parseInt(formData.startTimeMinutes) || 0) * 60 +
        (parseInt(formData.startTimeSeconds) || 0);
      const endTime =
        (parseInt(formData.endTimeHours) || 0) * 3600 +
        (parseInt(formData.endTimeMinutes) || 0) * 60 +
        (parseInt(formData.endTimeSeconds) || 0);

      await onVideoUpdate(
        editingVideo.id,
        formData.ytVideoId.trim(),
        formData.title.trim(),
        formData.type,
        formData.status,
        startTime > 0 ? startTime : undefined,
        endTime > 0 ? endTime : undefined
      );
      resetForm();
      setEditingVideo(null);
      setIsCreateDialogOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (video: Video) => {
    if (isLoading) return;

    if (
      window.confirm(`დარწმუნებული ხართ, რომ გსურთ წაშალოთ "${video.title}"?`)
    ) {
      await onVideoDelete(video.id);
    }
    setEditingVideo(null);
    resetForm();
  };

  const handleDialogClose = () => {
    if (isSubmitting) return;

    setIsCreateDialogOpen(false);
    setEditingVideo(null);
    resetForm();
  };

  const minuteOptions: WheelPickerOption[] = Array.from(
    { length: 60 },
    (_, i) => ({
      label: i.toString().padStart(2, "0"),
      value: i.toString(),
    })
  );

  const secondOptions: WheelPickerOption[] = Array.from(
    { length: 60 },
    (_, i) => ({
      label: i.toString().padStart(2, "0"),
      value: i.toString(),
    })
  );

  const hourOptions: WheelPickerOption[] = Array.from(
    { length: 24 },
    (_, i) => ({
      label: i.toString().padStart(2, "0"),
      value: i.toString(),
    })
  );

  const getYouTubeUrl = (ytVideoId: string) => {
    return `https://www.youtube.com/watch?v=${ytVideoId}`;
  };

  const getTypeLabel = (type: string) => {
    return VIDEO_TYPES.find((t) => t.value === type)?.label || type;
  };

  const getStatusLabel = (status: string) => {
    return VIDEO_STATUSES.find((s) => s.value === status)?.label || status;
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "verified":
        return "text-green-600 bg-green-50";
      case "pending":
        return "text-yellow-600 bg-yellow-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  if (videos.length === 0 && !isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            ვიდეოების მართვა
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4" />
              ახალი ვიდეო
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500">ვიდეოები არ მოიძებნა.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>ვიდეოების მართვა</CardTitle>
      </CardHeader>
      <CardContent className="px-6">
        <div className="flex justify-between mb-4">
          <div className="text-sm text-gray-600">
            სულ: {pagination.totalItems} ვიდეო
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            ახალი ვიდეო
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>სათაური</TableHead>
              <TableHead>YouTube Video ID</TableHead>
              <TableHead>ტიპი</TableHead>
              <TableHead>სტატუსი</TableHead>
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
                <TableCell colSpan={9} className="text-center">
                  <Loader2 className="h-6 w-6 animate-spin inline-block" />
                </TableCell>
              </TableRow>
            ) : videos.length > 0 ? (
              videos.map((video) => (
                <TableRow key={video.id}>
                  <TableCell className="font-medium">{video.title}</TableCell>
                  <TableCell className="font-mono text-sm">
                    {video.ytVideoId}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm px-2 py-1 rounded bg-blue-50 text-blue-600">
                      {getTypeLabel(video.type)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`text-sm px-2 py-1 rounded ${getStatusBadgeColor(
                        video.status
                      )}`}
                    >
                      {getStatusLabel(video.status)}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    {video.upvoteCount}
                  </TableCell>
                  <TableCell className="text-center">
                    {editingAlgorithmPoints?.videoId === video.id ? (
                      <div className="flex items-center gap-1">
                        <Input
                          type="number"
                          min="0"
                          value={editingAlgorithmPoints.value}
                          onChange={(e) =>
                            setEditingAlgorithmPoints({
                              videoId: video.id,
                              value: e.target.value,
                            })
                          }
                          className="w-20 h-8 text-sm"
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => handleAlgorithmPointsSave(video.id)}
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={handleAlgorithmPointsCancel}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <button
                        className="text-blue-600 hover:underline cursor-pointer"
                        onClick={() => handleAlgorithmPointsEdit(video)}
                        disabled={isLoading}
                      >
                        {video.algorithmPoints}
                      </button>
                    )}
                  </TableCell>
                  <TableCell className="text-center font-semibold">
                    {video.upvoteCount + video.algorithmPoints}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" asChild>
                      <a
                        href={getYouTubeUrl(video.ytVideoId)}
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
                      onClick={() => handleEdit(video)}
                      disabled={isLoading}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(video)}
                      disabled={isLoading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center">
                  ვიდეოები არ მოიძებნა.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <Pagination>
              <PaginationContent>
                {pagination.hasPreviousPage && (
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => onPageChange(pagination.currentPage - 1)}
                    />
                  </PaginationItem>
                )}

                {Array.from(
                  { length: pagination.totalPages },
                  (_, i) => i + 1
                ).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => onPageChange(page)}
                      isActive={page === pagination.currentPage}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                {pagination.hasNextPage && (
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => onPageChange(pagination.currentPage + 1)}
                    />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          </div>
        )}

        {/* Create/Edit Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={handleDialogClose}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingVideo ? "ვიდეოს რედაქტირება" : "ახალი ვიდეო"}
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
                  placeholder="შეიყვანეთ ვიდეოს სათაური..."
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">ტიპი</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) =>
                      setFormData({ ...formData, type: value })
                    }
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="აირჩიეთ ტიპი" />
                    </SelectTrigger>
                    <SelectContent>
                      {VIDEO_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">სტატუსი</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData({ ...formData, status: value })
                    }
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="აირჩიეთ სტატუსი" />
                    </SelectTrigger>
                    <SelectContent>
                      {VIDEO_STATUSES.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {/* Start Time */}
                <div className="space-y-2">
                  <Label>დაწყების დრო (საათი:წუთი:წამი)</Label>
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        min="0"
                        max="23"
                        value={formData.startTimeHours}
                        onChange={(e) => {
                          if (
                            e.target.value === "" ||
                            (+e.target.value >= 0 && +e.target.value < 24)
                          ) {
                            setFormData((p) => ({
                              ...p,
                              startTimeHours: e.target.value,
                            }));
                          }
                        }}
                        onBlur={(e) => {
                          if (e.target.value === "")
                            setFormData((p) => ({
                              ...p,
                              startTimeHours: "0",
                            }));
                        }}
                        className="w-14 text-center"
                      />
                      <span className="font-bold">:</span>
                      <Input
                        type="number"
                        min="0"
                        max="59"
                        value={formData.startTimeMinutes}
                        onChange={(e) => {
                          if (
                            e.target.value === "" ||
                            (+e.target.value >= 0 && +e.target.value < 60)
                          ) {
                            setFormData((p) => ({
                              ...p,
                              startTimeMinutes: e.target.value,
                            }));
                          }
                        }}
                        onBlur={(e) => {
                          if (e.target.value === "")
                            setFormData((p) => ({
                              ...p,
                              startTimeMinutes: "0",
                            }));
                        }}
                        className="w-14 text-center"
                      />
                      <span className="font-bold">:</span>
                      <Input
                        type="number"
                        min="0"
                        max="59"
                        value={formData.startTimeSeconds}
                        onChange={(e) => {
                          if (
                            e.target.value === "" ||
                            (+e.target.value >= 0 && +e.target.value < 60)
                          ) {
                            setFormData((p) => ({
                              ...p,
                              startTimeSeconds: e.target.value,
                            }));
                          }
                        }}
                        onBlur={(e) => {
                          if (e.target.value === "")
                            setFormData((p) => ({
                              ...p,
                              startTimeSeconds: "0",
                            }));
                        }}
                        className="w-14 text-center"
                      />
                    </div>
                    <WheelPickerWrapper>
                      <WheelPicker
                        options={hourOptions}
                        value={formData.startTimeHours}
                        onValueChange={(val) =>
                          setFormData((p) => ({ ...p, startTimeHours: val }))
                        }
                      />
                      <WheelPicker
                        options={minuteOptions}
                        value={formData.startTimeMinutes}
                        onValueChange={(val) =>
                          setFormData((p) => ({ ...p, startTimeMinutes: val }))
                        }
                      />
                      <WheelPicker
                        options={secondOptions}
                        value={formData.startTimeSeconds}
                        onValueChange={(val) =>
                          setFormData((p) => ({ ...p, startTimeSeconds: val }))
                        }
                      />
                    </WheelPickerWrapper>
                  </div>
                </div>

                {/* End Time */}
                <div className="space-y-2">
                  <Label>დასრულების დრო (საათი:წუთი:წამი)</Label>
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        min="0"
                        max="23"
                        value={formData.endTimeHours}
                        onChange={(e) => {
                          if (
                            e.target.value === "" ||
                            (+e.target.value >= 0 && +e.target.value < 24)
                          ) {
                            setFormData((p) => ({
                              ...p,
                              endTimeHours: e.target.value,
                            }));
                          }
                        }}
                        onBlur={(e) => {
                          if (e.target.value === "")
                            setFormData((p) => ({ ...p, endTimeHours: "0" }));
                        }}
                        className="w-14 text-center"
                      />
                      <span className="font-bold">:</span>
                      <Input
                        type="number"
                        min="0"
                        max="59"
                        value={formData.endTimeMinutes}
                        onChange={(e) => {
                          if (
                            e.target.value === "" ||
                            (+e.target.value >= 0 && +e.target.value < 60)
                          ) {
                            setFormData((p) => ({
                              ...p,
                              endTimeMinutes: e.target.value,
                            }));
                          }
                        }}
                        onBlur={(e) => {
                          if (e.target.value === "")
                            setFormData((p) => ({ ...p, endTimeMinutes: "0" }));
                        }}
                        className="w-14 text-center"
                      />
                      <span className="font-bold">:</span>
                      <Input
                        type="number"
                        min="0"
                        max="59"
                        value={formData.endTimeSeconds}
                        onChange={(e) => {
                          if (
                            e.target.value === "" ||
                            (+e.target.value >= 0 && +e.target.value < 60)
                          ) {
                            setFormData((p) => ({
                              ...p,
                              endTimeSeconds: e.target.value,
                            }));
                          }
                        }}
                        onBlur={(e) => {
                          if (e.target.value === "")
                            setFormData((p) => ({ ...p, endTimeSeconds: "0" }));
                        }}
                        className="w-14 text-center"
                      />
                    </div>
                    <WheelPickerWrapper>
                      <WheelPicker
                        options={hourOptions}
                        value={formData.endTimeHours}
                        onValueChange={(val) =>
                          setFormData((p) => ({ ...p, endTimeHours: val }))
                        }
                      />
                      <WheelPicker
                        options={minuteOptions}
                        value={formData.endTimeMinutes}
                        onValueChange={(val) =>
                          setFormData((p) => ({ ...p, endTimeMinutes: val }))
                        }
                      />
                      <WheelPicker
                        options={secondOptions}
                        value={formData.endTimeSeconds}
                        onValueChange={(val) =>
                          setFormData((p) => ({ ...p, endTimeSeconds: val }))
                        }
                      />
                    </WheelPickerWrapper>
                  </div>
                </div>
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
                onClick={editingVideo ? handleUpdate : handleCreate}
                disabled={
                  isSubmitting ||
                  !formData.title.trim() ||
                  !formData.ytVideoId.trim()
                }
              >
                {isSubmitting && (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                )}
                {editingVideo ? "განახლება" : "შექმნა"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
