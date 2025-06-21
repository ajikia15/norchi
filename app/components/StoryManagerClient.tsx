"use client";

import { useState } from "react";
import { Story, StoriesData } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Plus, Trash2, BookOpen, Calendar, Loader2 } from "lucide-react";

interface StoryManagerClientProps {
  storiesData: StoriesData;
  onStorySelect: (storyId: string) => void;
  onStoryCreate: (name: string, description?: string) => Promise<void>;
  onStoryDelete: (storyId: string) => Promise<void>;
  isLoading: boolean;
}

export default function StoryManagerClient({
  storiesData,
  onStorySelect,
  onStoryCreate,
  onStoryDelete,
  isLoading,
}: StoryManagerClientProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const stories = Object.values(storiesData.stories);

  const handleCreateStory = async () => {
    if (!formData.name.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onStoryCreate(
        formData.name.trim(),
        formData.description.trim() || undefined
      );
      setFormData({ name: "", description: "" });
      setIsCreateDialogOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteStory = async (story: Story) => {
    if (isLoading) return;
    await onStoryDelete(story.id);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getNodeCount = (story: Story) => {
    return Object.keys(story.flowData.nodes).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Story Library</h2>
          <p className="text-muted-foreground">
            Manage your logical challenge flows and switch between different
            stories
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
              New Story
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Story</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="story-name">Story Name</Label>
                <Input
                  id="story-name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Army Service Ethics, Economic Freedom..."
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="story-description">
                  Description (Optional)
                </Label>
                <Textarea
                  id="story-description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Brief description of what this story explores..."
                  rows={3}
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateStory}
                disabled={!formData.name.trim() || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Story"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Story Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories.map((story) => (
          <Card
            key={story.id}
            className={cn(
              "transition-all duration-200 hover:shadow-lg cursor-pointer border-2 border-gray-200/50 hover:border-primary/50",
              isLoading && "opacity-50 pointer-events-none"
            )}
            onClick={() => !isLoading && onStorySelect(story.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg leading-tight line-clamp-2">
                    {story.name}
                  </CardTitle>
                </div>

                <div className="flex gap-1 ml-2">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteStory(story);
                    }}
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
              {story.description && (
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
                  {story.description}
                </p>
              )}

              <div className="space-y-3">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    <span>{getNodeCount(story)} nodes</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(story.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {stories.length === 0 && (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 mb-4">
              <BookOpen className="h-12 w-12 mx-auto mb-4" />
              <p className="text-lg font-medium">No stories yet</p>
              <p className="text-sm">
                Create your first logical challenge story
              </p>
            </div>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              variant="outline"
              disabled={isLoading}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First Story
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
