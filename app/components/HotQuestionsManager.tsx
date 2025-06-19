"use client";

import { useState } from "react";
import { HotTopic, HotTopicsData } from "../types";
import { createNewHotTopic } from "../lib/storage";
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
import { Plus, Edit, Trash2, ExternalLink, ArrowRight } from "lucide-react";

interface HotQuestionsManagerProps {
  hotTopicsData: HotTopicsData;
  onTopicCreate: (topic: HotTopic) => void;
  onTopicUpdate: (
    topicId: string,
    updates: Partial<Omit<HotTopic, "id">>
  ) => void;
  onTopicDelete: (topicId: string) => void;
}

export default function HotQuestionsManager({
  hotTopicsData,
  onTopicCreate,
  onTopicUpdate,
  onTopicDelete,
}: HotQuestionsManagerProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<HotTopic | null>(null);
  const [formData, setFormData] = useState({
    category: "",
    title: "",
    answer: "",
    link: "",
  });

  const topics = Object.values(hotTopicsData.topics);

  const resetForm = () => {
    setFormData({
      category: "",
      title: "",
      answer: "",
      link: "",
    });
  };

  const handleCreateTopic = () => {
    if (
      !formData.category.trim() ||
      !formData.title.trim() ||
      !formData.answer.trim()
    ) {
      return;
    }

    const newTopic = createNewHotTopic(
      formData.category.trim(),
      formData.title.trim(),
      formData.answer.trim(),
      formData.link.trim() || undefined
    );
    onTopicCreate(newTopic);
    resetForm();
    setIsCreateDialogOpen(false);
  };

  const handleEditTopic = (topic: HotTopic) => {
    setEditingTopic(topic);
    setFormData({
      category: topic.category,
      title: topic.title,
      answer: topic.answer,
      link: topic.link || "",
    });
    setIsCreateDialogOpen(true);
  };

  const handleUpdateTopic = () => {
    if (
      !editingTopic ||
      !formData.category.trim() ||
      !formData.title.trim() ||
      !formData.answer.trim()
    ) {
      return;
    }

    onTopicUpdate(editingTopic.id, {
      category: formData.category.trim(),
      title: formData.title.trim(),
      answer: formData.answer.trim(),
      link: formData.link.trim() || undefined,
    });
    resetForm();
    setEditingTopic(null);
    setIsCreateDialogOpen(false);
  };

  const handleDeleteTopic = (topic: HotTopic) => {
    if (
      confirm(
        `Are you sure you want to delete the hot question about "${topic.title}"? This action cannot be undone.`
      )
    ) {
      onTopicDelete(topic.id);
    }
  };

  const handleDialogClose = () => {
    setIsCreateDialogOpen(false);
    setEditingTopic(null);
    resetForm();
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
            <Button className="shadow-sm">
              <Plus className="h-4 w-4 mr-2" />
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
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleDialogClose}>
                Cancel
              </Button>
              <Button
                onClick={editingTopic ? handleUpdateTopic : handleCreateTopic}
                disabled={
                  !formData.category.trim() ||
                  !formData.title.trim() ||
                  !formData.answer.trim()
                }
              >
                {editingTopic ? "Update Question" : "Create Question"}
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
            className="transition-all duration-200 hover:shadow-lg border-2 border-gray-200/50 hover:border-primary/50"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      variant="secondary"
                      className="text-xs font-medium bg-primary/10 text-primary border-primary/20"
                    >
                      {topic.category}
                    </Badge>
                    {topic.link && (
                      <div className="text-xs text-muted-foreground">
                        {topic.link.startsWith("/") ? (
                          <ArrowRight className="h-3 w-3" />
                        ) : (
                          <ExternalLink className="h-3 w-3" />
                        )}
                      </div>
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
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    onClick={() => handleDeleteTopic(topic)}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground line-clamp-4 leading-relaxed">
                {topic.answer}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {topics.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">🔥</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No hot questions yet
          </h3>
          <p className="text-muted-foreground max-w-sm mb-4">
            Create your first hot question to start challenging popular thinking
          </p>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create First Hot Question
          </Button>
        </div>
      )}
    </div>
  );
}
