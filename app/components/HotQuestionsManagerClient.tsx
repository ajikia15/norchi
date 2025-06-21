"use client";

import { useState } from "react";
import { HotTopic, HotTopicsData } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  ArrowRight,
  Loader2,
} from "lucide-react";

interface HotQuestionsManagerClientProps {
  hotTopicsData: HotTopicsData;
  onTopicCreate: (
    category: string,
    title: string,
    answer: string,
    link?: string
  ) => Promise<void>;
  onTopicUpdate: (
    topicId: string,
    category: string,
    title: string,
    answer: string,
    link?: string
  ) => Promise<void>;
  onTopicDelete: (topicId: string) => Promise<void>;
  isLoading: boolean;
}

export default function HotQuestionsManagerClient({
  hotTopicsData,
  onTopicCreate,
  onTopicUpdate,
  onTopicDelete,
  isLoading,
}: HotQuestionsManagerClientProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<HotTopic | null>(null);
  const [formData, setFormData] = useState({
    category: "",
    title: "",
    answer: "",
    link: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const topics = Object.values(hotTopicsData.topics);

  const resetForm = () => {
    setFormData({
      category: "",
      title: "",
      answer: "",
      link: "",
    });
  };

  const handleCreateTopic = async () => {
    if (
      !formData.category.trim() ||
      !formData.title.trim() ||
      !formData.answer.trim() ||
      isSubmitting
    ) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onTopicCreate(
        formData.category.trim(),
        formData.title.trim(),
        formData.answer.trim(),
        formData.link.trim() || undefined
      );
      resetForm();
      setIsCreateDialogOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditTopic = (topic: HotTopic) => {
    if (isLoading) return;

    setEditingTopic(topic);
    setFormData({
      category: topic.category,
      title: topic.title,
      answer: topic.answer,
      link: topic.link || "",
    });
    setIsCreateDialogOpen(true);
  };

  const handleUpdateTopic = async () => {
    if (
      !editingTopic ||
      !formData.category.trim() ||
      !formData.title.trim() ||
      !formData.answer.trim() ||
      isSubmitting
    ) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onTopicUpdate(
        editingTopic.id,
        formData.category.trim(),
        formData.title.trim(),
        formData.answer.trim(),
        formData.link.trim() || undefined
      );
      resetForm();
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

  const handleDialogClose = () => {
    if (isSubmitting) return;
    setIsCreateDialogOpen(false);
    setEditingTopic(null);
    resetForm();
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      drugs: "bg-purple-100 text-purple-800",
      property: "bg-green-100 text-green-800",
      military: "bg-red-100 text-red-800",
      economics: "bg-blue-100 text-blue-800",
      freedom: "bg-yellow-100 text-yellow-800",
    };
    return (
      colors[category.toLowerCase() as keyof typeof colors] ||
      "bg-gray-100 text-gray-800"
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Hot Questions</h2>
          <p className="text-muted-foreground">
            Manage provocative questions that challenge popular thinking and
            explore libertarian principles
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
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
                {editingTopic ? "Edit Hot Question" : "Create New Hot Question"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="topic-category">Category</Label>
                  <Input
                    id="topic-category"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    placeholder="e.g., Drugs, Property, Military..."
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="topic-link">Link (Optional)</Label>
                  <Input
                    id="topic-link"
                    value={formData.link}
                    onChange={(e) =>
                      setFormData({ ...formData, link: e.target.value })
                    }
                    placeholder="e.g., /story/wine-weed or https://..."
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="topic-title">Question Title</Label>
                <Input
                  id="topic-title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g., Should marijuana be fully legalized?"
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="topic-answer">Answer/Response</Label>
                <Textarea
                  id="topic-answer"
                  value={formData.answer}
                  onChange={(e) =>
                    setFormData({ ...formData, answer: e.target.value })
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
                onClick={handleDialogClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={editingTopic ? handleUpdateTopic : handleCreateTopic}
                disabled={
                  !formData.category.trim() ||
                  !formData.title.trim() ||
                  !formData.answer.trim() ||
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

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic) => (
          <Card
            key={topic.id}
            className={`transition-all duration-200 hover:shadow-lg border-2 border-gray-200/50 hover:border-primary/50 ${
              isLoading ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getCategoryColor(topic.category)}>
                      {topic.category}
                    </Badge>
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
                        topic.link.startsWith("http") ? "_blank" : "_self"
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
        ))}

        {topics.length === 0 && (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 mb-4">
              <Plus className="h-12 w-12 mx-auto mb-4" />
              <p className="text-lg font-medium">No hot questions yet</p>
              <p className="text-sm">Create your first provocative question</p>
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
  );
}
