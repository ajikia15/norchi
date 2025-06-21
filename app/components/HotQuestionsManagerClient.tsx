"use client";

import { useState } from "react";
import {
  HotTopic,
  HotTopicsData,
  HotcardCategory,
  TOPICAL_TAGS,
} from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  ArrowRight,
  Loader2,
  Settings,
} from "lucide-react";

interface HotQuestionsManagerClientProps {
  hotTopicsData: HotTopicsData;
  onTopicCreate: (
    categoryId: string,
    topicalTag: string,
    title: string,
    answer: string,
    link?: string
  ) => Promise<void>;
  onTopicUpdate: (
    topicId: string,
    categoryId: string,
    topicalTag: string,
    title: string,
    answer: string,
    link?: string
  ) => Promise<void>;
  onTopicDelete: (topicId: string) => Promise<void>;
  onCategoryCreate: (id: string, label: string, emoji: string) => Promise<void>;
  onCategoryUpdate: (
    categoryId: string,
    label: string,
    emoji: string
  ) => Promise<void>;
  onCategoryDelete: (categoryId: string) => Promise<void>;
  isLoading: boolean;
}

export default function HotQuestionsManagerClient({
  hotTopicsData,
  onTopicCreate,
  onTopicUpdate,
  onTopicDelete,
  onCategoryCreate,
  onCategoryUpdate,
  onCategoryDelete,
  isLoading,
}: HotQuestionsManagerClientProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<HotTopic | null>(null);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<HotcardCategory | null>(null);

  const [topicFormData, setTopicFormData] = useState({
    categoryId: "",
    topicalTag: "",
    title: "",
    answer: "",
    link: "",
  });

  const [categoryFormData, setCategoryFormData] = useState({
    id: "",
    label: "",
    emoji: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const topics = Object.values(hotTopicsData.topics);
  const categories = Object.values(hotTopicsData.categories);

  const resetTopicForm = () => {
    setTopicFormData({
      categoryId: "",
      topicalTag: "",
      title: "",
      answer: "",
      link: "",
    });
  };

  const resetCategoryForm = () => {
    setCategoryFormData({
      id: "",
      label: "",
      emoji: "",
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
        topicFormData.categoryId.trim(),
        topicFormData.topicalTag.trim(),
        topicFormData.title.trim(),
        topicFormData.answer.trim(),
        topicFormData.link.trim() || undefined
      );
      resetTopicForm();
      setIsCreateDialogOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditTopic = (topic: HotTopic) => {
    if (isLoading) return;

    setEditingTopic(topic);
    setTopicFormData({
      categoryId: topic.categoryId || "",
      topicalTag: topic.topicalTag || "",
      title: topic.title,
      answer: topic.answer,
      link: topic.link || "",
    });
    setIsCreateDialogOpen(true);
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
        topicFormData.categoryId.trim(),
        topicFormData.topicalTag.trim(),
        topicFormData.title.trim(),
        topicFormData.answer.trim(),
        topicFormData.link.trim() || undefined
      );
      resetTopicForm();
      setEditingTopic(null);
      setIsCreateDialogOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTopic = async (topic: HotTopic) => {
    if (isLoading) return;
    await onTopicDelete(topic.id);
  };

  // Category handlers
  const handleCreateCategory = async () => {
    if (
      !categoryFormData.id.trim() ||
      !categoryFormData.label.trim() ||
      !categoryFormData.emoji.trim() ||
      isSubmitting
    ) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onCategoryCreate(
        categoryFormData.id.trim(),
        categoryFormData.label.trim(),
        categoryFormData.emoji.trim()
      );
      resetCategoryForm();
      setIsCategoryDialogOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditCategory = (category: HotcardCategory) => {
    if (isLoading) return;

    setEditingCategory(category);
    setCategoryFormData({
      id: category.id,
      label: category.label,
      emoji: category.emoji,
    });
    setIsCategoryDialogOpen(true);
  };

  const handleUpdateCategory = async () => {
    if (
      !editingCategory ||
      !categoryFormData.label.trim() ||
      !categoryFormData.emoji.trim() ||
      isSubmitting
    ) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onCategoryUpdate(
        editingCategory.id,
        categoryFormData.label.trim(),
        categoryFormData.emoji.trim()
      );
      resetCategoryForm();
      setEditingCategory(null);
      setIsCategoryDialogOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (category: HotcardCategory) => {
    if (isLoading) return;

    const confirmMessage = `Are you sure you want to delete the category "${category.label}" (${category.id})?\n\nThis will unlink it from any hot questions but won't delete the questions themselves.\n\nThis action cannot be undone.`;

    if (window.confirm(confirmMessage)) {
      try {
        await onCategoryDelete(category.id);
      } catch (error) {
        console.error("Failed to delete category:", error);
        alert("Failed to delete category. Please try again.");
      }
    }
  };

  const handleTopicDialogClose = () => {
    if (isSubmitting) return;
    setIsCreateDialogOpen(false);
    setEditingTopic(null);
    resetTopicForm();
  };

  const handleCategoryDialogClose = () => {
    if (isSubmitting) return;
    setIsCategoryDialogOpen(false);
    setEditingCategory(null);
    resetCategoryForm();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Hot Questions</h2>
          <p className="text-muted-foreground">
            Manage provocative questions and their categories
          </p>
        </div>
      </div>

      <Tabs defaultValue="questions" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="questions" className="mt-6">
          <div className="space-y-6">
            {/* Questions Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Hot Questions</h3>
                <p className="text-sm text-muted-foreground">
                  Challenge popular thinking through structured debates
                </p>
              </div>

              <Dialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button className="shadow-sm" disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4 mr-2" />
                    )}
                    New Hot Question
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingTopic
                        ? "Edit Hot Question"
                        : "Create New Hot Question"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="topic-category">
                          Category (Optional)
                        </Label>
                        <Select
                          value={topicFormData.categoryId}
                          onValueChange={(value) =>
                            setTopicFormData({
                              ...topicFormData,
                              categoryId: value,
                            })
                          }
                          disabled={isSubmitting}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">No category</SelectItem>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                <div className="flex items-center gap-2">
                                  <span>{category.emoji}</span>
                                  <Badge variant="secondary">
                                    {category.label}
                                  </Badge>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="topic-topical-tag">
                          Topical Tag (Optional)
                        </Label>
                        <Select
                          value={topicFormData.topicalTag}
                          onValueChange={(value) =>
                            setTopicFormData({
                              ...topicFormData,
                              topicalTag: value,
                            })
                          }
                          disabled={isSubmitting}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select topical style" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">No topical tag</SelectItem>
                            {Object.entries(TOPICAL_TAGS).map(([key, tag]) => (
                              <SelectItem key={key} value={key}>
                                <div className="flex items-center gap-2">
                                  <span>{tag.emoji}</span>
                                  <Badge variant={tag.badgeVariant}>
                                    {tag.label}
                                  </Badge>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="topic-link">Link (Optional)</Label>
                      <Input
                        id="topic-link"
                        value={topicFormData.link}
                        onChange={(e) =>
                          setTopicFormData({
                            ...topicFormData,
                            link: e.target.value,
                          })
                        }
                        placeholder="e.g., /story/wine-weed or https://..."
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="topic-title">Question Title</Label>
                      <Input
                        id="topic-title"
                        value={topicFormData.title}
                        onChange={(e) =>
                          setTopicFormData({
                            ...topicFormData,
                            title: e.target.value,
                          })
                        }
                        placeholder="e.g., Should marijuana be fully legalized?"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="topic-answer">Answer/Response</Label>
                      <Textarea
                        id="topic-answer"
                        value={topicFormData.answer}
                        onChange={(e) =>
                          setTopicFormData({
                            ...topicFormData,
                            answer: e.target.value,
                          })
                        }
                        placeholder="Your libertarian perspective on this question..."
                        rows={4}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  <DialogFooter>
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
                      disabled={
                        !topicFormData.title.trim() ||
                        !topicFormData.answer.trim() ||
                        isSubmitting
                      }
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          {editingTopic ? "Updating..." : "Creating..."}
                        </>
                      ) : editingTopic ? (
                        "Update Question"
                      ) : (
                        "Create Question"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Questions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topics.map((topic) => {
                const topicalTagData = topic.topicalTag
                  ? TOPICAL_TAGS[topic.topicalTag]
                  : null;

                return (
                  <Card
                    key={topic.id}
                    className={`relative transition-all duration-200 hover:shadow-lg border-2 border-gray-200/50 hover:border-primary/50 ${
                      isLoading ? "opacity-50 pointer-events-none" : ""
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col gap-2 mb-2">
                            {/* Category Badge */}
                            {topic.categoryData && (
                              <Badge variant="secondary">
                                {topic.categoryData.label}
                              </Badge>
                            )}
                            {/* Topical Tag Badge */}
                            {topicalTagData && (
                              <Badge variant={topicalTagData.badgeVariant}>
                                {topicalTagData.label}
                              </Badge>
                            )}
                            {/* Fallback to legacy category */}
                            {!topic.categoryData && !topicalTagData && (
                              <Badge variant="secondary">
                                {topic.category}
                              </Badge>
                            )}
                          </div>
                          <CardTitle className="text-lg leading-tight line-clamp-2">
                            {topic.title}
                          </CardTitle>
                        </div>

                        <div className="flex gap-1 ml-2">
                          <Button
                            onClick={() => handleEditTopic(topic)}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Edit className="h-3.5 w-3.5" />
                            )}
                          </Button>
                          <Button
                            onClick={() => handleDeleteTopic(topic)}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="h-3.5 w-3.5" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Topical emoji in bottom-right */}
                      {topicalTagData?.emoji && (
                        <div className="absolute bottom-2 right-2 opacity-50 text-3xl">
                          {topicalTagData.emoji}
                        </div>
                      )}
                    </CardHeader>

                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-4 leading-relaxed">
                        {topic.answer}
                      </p>

                      {topic.link && (
                        <div className="flex items-center justify-between">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            asChild
                            disabled={isLoading}
                          >
                            <a
                              href={topic.link}
                              target={
                                topic.link.startsWith("http")
                                  ? "_blank"
                                  : "_self"
                              }
                              rel={
                                topic.link.startsWith("http")
                                  ? "noopener noreferrer"
                                  : undefined
                              }
                              className="flex items-center gap-1"
                            >
                              {topic.link.startsWith("http") ? (
                                <ExternalLink className="h-3 w-3" />
                              ) : (
                                <ArrowRight className="h-3 w-3" />
                              )}
                              Explore
                            </a>
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}

              {topics.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Plus className="h-12 w-12 mx-auto mb-4" />
                    <p className="text-lg font-medium">No hot questions yet</p>
                    <p className="text-sm">
                      Create your first provocative question
                    </p>
                  </div>
                  <Button
                    onClick={() => setIsCreateDialogOpen(true)}
                    variant="outline"
                    disabled={isLoading}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Question
                  </Button>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="mt-6">
          <div className="space-y-6">
            {/* Categories Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Categories</h3>
                <p className="text-sm text-muted-foreground">
                  Manage broad topic categories (editable by admin)
                </p>
              </div>

              <Dialog
                open={isCategoryDialogOpen}
                onOpenChange={setIsCategoryDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button className="shadow-sm" disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4 mr-2" />
                    )}
                    New Category
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>
                      {editingCategory
                        ? "Edit Category"
                        : "Create New Category"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    {!editingCategory && (
                      <div className="space-y-2">
                        <Label htmlFor="category-id">ID</Label>
                        <Input
                          id="category-id"
                          value={categoryFormData.id}
                          onChange={(e) =>
                            setCategoryFormData({
                              ...categoryFormData,
                              id: e.target.value,
                            })
                          }
                          placeholder="e.g., economics, education"
                          disabled={isSubmitting}
                        />
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="category-label">Label</Label>
                      <Input
                        id="category-label"
                        value={categoryFormData.label}
                        onChange={(e) =>
                          setCategoryFormData({
                            ...categoryFormData,
                            label: e.target.value,
                          })
                        }
                        placeholder="e.g., ეკონომიკა"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category-emoji">Emoji</Label>
                      <Input
                        id="category-emoji"
                        value={categoryFormData.emoji}
                        onChange={(e) =>
                          setCategoryFormData({
                            ...categoryFormData,
                            emoji: e.target.value,
                          })
                        }
                        placeholder="e.g., 💵"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="text-sm text-muted-foreground bg-gray-50 p-3 rounded-md">
                      💡 <strong>Note:</strong> All categories use neutral gray
                      badge styling. Use topical tags for colorful styling.
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={handleCategoryDialogClose}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={
                        editingCategory
                          ? handleUpdateCategory
                          : handleCreateCategory
                      }
                      disabled={
                        (!editingCategory && !categoryFormData.id.trim()) ||
                        !categoryFormData.label.trim() ||
                        !categoryFormData.emoji.trim() ||
                        isSubmitting
                      }
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          {editingCategory ? "Updating..." : "Creating..."}
                        </>
                      ) : editingCategory ? (
                        "Update Category"
                      ) : (
                        "Create Category"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <Card
                  key={category.id}
                  className={`transition-all duration-200 hover:shadow-lg border-2 border-gray-200/50 hover:border-primary/50 ${
                    isLoading ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary">{category.label}</Badge>
                        </div>
                        <CardTitle className="text-sm text-muted-foreground">
                          ID: {category.id}
                        </CardTitle>
                      </div>

                      <div className="flex gap-1 ml-2">
                        <Button
                          onClick={() => handleEditCategory(category)}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                          disabled={isLoading}
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteCategory(category)}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                          disabled={isLoading}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>

                    {/* Category emoji in bottom-right */}
                    <div className="absolute bottom-2 right-2 opacity-50 text-2xl">
                      {category.emoji}
                    </div>
                  </CardHeader>
                </Card>
              ))}

              {categories.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Settings className="h-12 w-12 mx-auto mb-4" />
                    <p className="text-lg font-medium">No categories yet</p>
                    <p className="text-sm">Create your first category</p>
                  </div>
                  <Button
                    onClick={() => setIsCategoryDialogOpen(true)}
                    variant="outline"
                    disabled={isLoading}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Category
                  </Button>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
