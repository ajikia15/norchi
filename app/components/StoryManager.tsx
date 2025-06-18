"use client";

import { useState } from "react";
import { Story, StoriesData } from "../types";
import { createNewStory } from "../lib/storage";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "./ui/dialog";
import { cn } from "../lib/utils";
import { Plus, Edit, Trash2, BookOpen, Calendar } from "lucide-react";

interface StoryManagerProps {
  storiesData: StoriesData;
  onStorySelect: (storyId: string) => void;
  onStoryCreate: (story: Story) => void;
  onStoryDelete: (storyId: string) => void;
}

export default function StoryManager({
  storiesData,
  onStorySelect,
  onStoryCreate,
  onStoryDelete,
}: StoryManagerProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });

  const stories = Object.values(storiesData.stories);

  const handleCreateStory = () => {
    if (!formData.name.trim()) return;

    const newStory = createNewStory(
      formData.name.trim(),
      formData.description.trim() || undefined
    );
    onStoryCreate(newStory);
    setFormData({ name: "", description: "" });
    setIsCreateDialogOpen(false);
  };

  const handleDeleteStory = (story: Story) => {
    if (
      confirm(
        `Are you sure you want to delete "${story.name}"? This action cannot be undone.`
      )
    ) {
      onStoryDelete(story.id);
    }
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
            <Button className="shadow-sm">
              <Plus className="h-4 w-4 mr-2" />
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
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateStory}
                disabled={!formData.name.trim()}
              >
                Create Story
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
              "transition-all duration-200 hover:shadow-lg cursor-pointer border-2",
              story.id === storiesData.currentStoryId
                ? "border-primary bg-primary/5"
                : "border-gray-200/50 hover:border-primary/50"
            )}
            onClick={() => onStorySelect(story.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg leading-tight line-clamp-2">
                    {story.name}
                  </CardTitle>
                  {story.id === storiesData.currentStoryId && (
                    <Badge variant="default" className="mt-2 text-xs">
                      Active
                    </Badge>
                  )}
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
                  >
                    <Trash2 className="h-3.5 w-3.5" />
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

                <div className="pt-2 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Edit className="h-3 w-3" />
                      Click to edit story
                    </div>
                    {story.id === storiesData.currentStoryId && (
                      <div className="flex items-center gap-1 text-xs text-primary font-medium">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        Active
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {stories.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <BookOpen className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No stories yet
          </h3>
          <p className="text-muted-foreground max-w-sm mb-4">
            Create your first story to start building logical challenge flows
          </p>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create First Story
          </Button>
        </div>
      )}
    </div>
  );
}
