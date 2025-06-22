"use client";

import { useState } from "react";
import { HotTopic, HotTopicsData, Tag } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import MarkdownEditor from "./MarkdownEditor";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash2, Loader2, Tag as TagIcon } from "lucide-react";

interface HotQuestionsManagerClientProps {
  hotTopicsData: HotTopicsData;
  onTopicCreate: (
    selectedTags: string[],
    title: string,
    answer: string
  ) => Promise<void>;
  onTopicUpdate: (
    topicId: string,
    selectedTags: string[],
    title: string,
    answer: string
  ) => Promise<void>;
  onTopicDelete: (topicId: string) => Promise<void>;
  onTagCreate: (
    id: string,
    label: string,
    emoji: string,
    color: string
  ) => Promise<void>;
  onTagUpdate: (
    tagId: string,
    label: string,
    emoji: string,
    color: string
  ) => Promise<void>;
  onTagDelete: (tagId: string) => Promise<void>;
  isLoading: boolean;
}

export default function HotQuestionsManagerClient({
  hotTopicsData,
  onTopicCreate,
  onTopicUpdate,
  onTopicDelete,
  onTagCreate,
  onTagUpdate,
  onTagDelete,
  isLoading,
}: HotQuestionsManagerClientProps) {
  const [isCreateTopicDialogOpen, setIsCreateTopicDialogOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<HotTopic | null>(null);
  const [isCreateTagDialogOpen, setIsCreateTagDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);

  const [topicFormData, setTopicFormData] = useState({
    selectedTags: [] as string[],
    title: "",
    answer: "",
  });

  const [tagFormData, setTagFormData] = useState({
    id: "",
    label: "",
    emoji: "",
    color: "#3b82f6",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const topics = Object.values(hotTopicsData.topics);
  const allTags = Object.values(hotTopicsData.tags);

  const resetTopicForm = () => {
    setTopicFormData({
      selectedTags: [],
      title: "",
      answer: "",
    });
  };

  const resetTagForm = () => {
    setTagFormData({
      id: "",
      label: "",
      emoji: "",
      color: "#3b82f6",
    });
  };

  // Topic handlers
  const handleCreateTopic = async () => {
    if (
      !topicFormData.title.trim() ||
      !topicFormData.answer.trim() ||
      isSubmitting
    ) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onTopicCreate(
        topicFormData.selectedTags,
        topicFormData.title.trim(),
        topicFormData.answer.trim()
      );
      resetTopicForm();
      setIsCreateTopicDialogOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditTopic = (topic: HotTopic) => {
    if (isLoading) return;

    setEditingTopic(topic);
    setTopicFormData({
      selectedTags: [...topic.tags],
      title: topic.title,
      answer: topic.answer,
    });
    setIsCreateTopicDialogOpen(true);
  };

  const handleUpdateTopic = async () => {
    if (
      !editingTopic ||
      !topicFormData.title.trim() ||
      !topicFormData.answer.trim() ||
      isSubmitting
    ) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onTopicUpdate(
        editingTopic.id,
        topicFormData.selectedTags,
        topicFormData.title.trim(),
        topicFormData.answer.trim()
      );
      resetTopicForm();
      setEditingTopic(null);
      setIsCreateTopicDialogOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTopic = async (topic: HotTopic) => {
    if (isLoading) return;

    if (window.confirm(`Are you sure you want to delete "${topic.title}"?`)) {
      await onTopicDelete(topic.id);
    }
  };

  // Tag handlers
  const handleCreateTag = async () => {
    if (
      !tagFormData.id.trim() ||
      !tagFormData.label.trim() ||
      !tagFormData.emoji.trim() ||
      !tagFormData.color.trim() ||
      isSubmitting
    ) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onTagCreate(
        tagFormData.id.trim(),
        tagFormData.label.trim(),
        tagFormData.emoji.trim(),
        tagFormData.color.trim()
      );
      resetTagForm();
      setIsCreateTagDialogOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditTag = (tag: Tag) => {
    if (isLoading) return;

    setEditingTag(tag);
    setTagFormData({
      id: tag.id,
      label: tag.label,
      emoji: tag.emoji,
      color: tag.color,
    });
    setIsCreateTagDialogOpen(true);
  };

  const handleUpdateTag = async () => {
    if (
      !editingTag ||
      !tagFormData.label.trim() ||
      !tagFormData.emoji.trim() ||
      !tagFormData.color.trim() ||
      isSubmitting
    ) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onTagUpdate(
        editingTag.id,
        tagFormData.label.trim(),
        tagFormData.emoji.trim(),
        tagFormData.color.trim()
      );
      resetTagForm();
      setEditingTag(null);
      setIsCreateTagDialogOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTag = async (tag: Tag) => {
    if (isLoading) return;

    const topicsUsingTag = topics.filter((topic) =>
      topic.tags.includes(tag.id)
    );
    const confirmMessage =
      topicsUsingTag.length > 0
        ? `Are you sure you want to delete tag "${tag.label}"? This will remove it from ${topicsUsingTag.length} hot question(s).`
        : `Are you sure you want to delete tag "${tag.label}"?`;

    if (window.confirm(confirmMessage)) {
      await onTagDelete(tag.id);
    }
  };

  const handleTopicDialogClose = () => {
    if (isSubmitting) return;
    setIsCreateTopicDialogOpen(false);
    setEditingTopic(null);
    resetTopicForm();
  };

  const handleTagDialogClose = () => {
    if (isSubmitting) return;
    setIsCreateTagDialogOpen(false);
    setEditingTag(null);
    resetTagForm();
  };

  const toggleTagSelection = (tagId: string) => {
    setTopicFormData((prev) => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tagId)
        ? prev.selectedTags.filter((id) => id !== tagId)
        : [...prev.selectedTags, tagId],
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Hot Questions</h2>
          <p className="text-muted-foreground">
            Manage provocative questions and their tags
          </p>
        </div>
      </div>

      <Tabs defaultValue="questions" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="tags">Tags</TabsTrigger>
        </TabsList>

        <TabsContent value="questions" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Hot Questions</CardTitle>
                <Dialog
                  open={isCreateTopicDialogOpen}
                  onOpenChange={setIsCreateTopicDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button disabled={isLoading}>
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Plus className="h-4 w-4 mr-2" />
                      )}
                      New Question
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="!max-w-[90vw] !w-[90vw] max-h-[85vh] overflow-y-auto p-0">
                    <div className="p-6">
                      <DialogHeader>
                        <DialogTitle>
                          {editingTopic
                            ? "Edit Hot Question"
                            : "Create New Hot Question"}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Tags</Label>
                          <div className="flex flex-wrap gap-2 p-3 border rounded-md ">
                            {allTags.map((tag) => (
                              <Badge
                                key={tag.id}
                                variant={
                                  topicFormData.selectedTags.includes(tag.id)
                                    ? "default"
                                    : "outline"
                                }
                                className="cursor-pointer"
                                style={{
                                  backgroundColor:
                                    topicFormData.selectedTags.includes(tag.id)
                                      ? tag.color
                                      : undefined,
                                  borderColor: tag.color,
                                }}
                                onClick={() => toggleTagSelection(tag.id)}
                              >
                                {tag.emoji} {tag.label}
                              </Badge>
                            ))}
                            {allTags.length === 0 && (
                              <p className="text-sm text-muted-foreground">
                                No tags available. Create some tags first.
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="topic-title">Title*</Label>
                          <Input
                            id="topic-title"
                            value={topicFormData.title}
                            onChange={(e) =>
                              setTopicFormData({
                                ...topicFormData,
                                title: e.target.value,
                              })
                            }
                            disabled={isSubmitting}
                            placeholder="Enter question title"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="topic-answer">Answer*</Label>
                          <MarkdownEditor
                            value={topicFormData.answer}
                            onChange={(value) =>
                              setTopicFormData({
                                ...topicFormData,
                                answer: value,
                              })
                            }
                            disabled={isSubmitting}
                            placeholder="Enter the answer/response with markdown formatting"
                          />
                        </div>
                      </div>
                      <DialogFooter className="p-6 pt-0">
                        <Button
                          variant="outline"
                          onClick={handleTopicDialogClose}
                          disabled={isSubmitting}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={
                            editingTopic ? handleUpdateTopic : handleCreateTopic
                          }
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : null}
                          {editingTopic ? "Update" : "Create"}
                        </Button>
                      </DialogFooter>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Answer Preview</TableHead>

                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topics.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center text-muted-foreground"
                      >
                        No hot questions found. Create one to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    topics.map((topic) => (
                      <TableRow key={topic.id}>
                        <TableCell className="font-medium">
                          {topic.title}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {topic.tagData?.map((tag) => (
                              <Badge
                                key={tag.id}
                                variant="outline"
                                style={{ borderColor: tag.color }}
                                className="text-xs"
                              >
                                {tag.emoji} {tag.label}
                              </Badge>
                            )) || (
                              <span className="text-sm text-muted-foreground">
                                No tags
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[200px]">
                          <p className="truncate text-sm text-muted-foreground">
                            {topic.answer}
                          </p>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditTopic(topic)}
                              disabled={isLoading}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteTopic(topic)}
                              disabled={isLoading}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tags" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Tags</CardTitle>
                <Dialog
                  open={isCreateTagDialogOpen}
                  onOpenChange={setIsCreateTagDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button disabled={isLoading}>
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <TagIcon className="h-4 w-4 mr-2" />
                      )}
                      New Tag
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingTag ? "Edit Tag" : "Create New Tag"}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="tag-id">ID*</Label>
                        <Input
                          id="tag-id"
                          value={tagFormData.id}
                          onChange={(e) =>
                            setTagFormData({
                              ...tagFormData,
                              id: e.target.value,
                            })
                          }
                          disabled={isSubmitting || !!editingTag}
                          placeholder="tag-id (lowercase, no spaces)"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tag-label">Label*</Label>
                        <Input
                          id="tag-label"
                          value={tagFormData.label}
                          onChange={(e) =>
                            setTagFormData({
                              ...tagFormData,
                              label: e.target.value,
                            })
                          }
                          disabled={isSubmitting}
                          placeholder="Tag display name"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tag-emoji">Emoji*</Label>
                        <Input
                          id="tag-emoji"
                          value={tagFormData.emoji}
                          onChange={(e) =>
                            setTagFormData({
                              ...tagFormData,
                              emoji: e.target.value,
                            })
                          }
                          disabled={isSubmitting}
                          placeholder="🏷️"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tag-color">Color*</Label>
                        <div className="flex gap-2">
                          <Input
                            id="tag-color"
                            type="color"
                            value={tagFormData.color}
                            onChange={(e) =>
                              setTagFormData({
                                ...tagFormData,
                                color: e.target.value,
                              })
                            }
                            disabled={isSubmitting}
                            className="w-16"
                          />
                          <Input
                            value={tagFormData.color}
                            onChange={(e) =>
                              setTagFormData({
                                ...tagFormData,
                                color: e.target.value,
                              })
                            }
                            disabled={isSubmitting}
                            placeholder="#3b82f6"
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={handleTagDialogClose}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={editingTag ? handleUpdateTag : handleCreateTag}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : null}
                        {editingTag ? "Update" : "Create"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Preview</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Label</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allTags.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center text-muted-foreground"
                      >
                        No tags found. Create one to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    allTags.map((tag) => {
                      const usageCount = topics.filter((topic) =>
                        topic.tags.includes(tag.id)
                      ).length;
                      return (
                        <TableRow key={tag.id}>
                          <TableCell>
                            <Badge
                              style={{
                                backgroundColor: tag.color,
                                color: "white",
                              }}
                            >
                              {tag.emoji} {tag.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {tag.id}
                          </TableCell>
                          <TableCell>{tag.label}</TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {usageCount} question{usageCount !== 1 ? "s" : ""}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditTag(tag)}
                                disabled={isLoading}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteTag(tag)}
                                disabled={isLoading}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
