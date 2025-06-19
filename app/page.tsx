"use client";

import { useState, useEffect } from "react";
import { StoriesData, Story } from "./types";
import {
  loadStoriesData,
  getDefaultStoriesData,
  migrateLegacyData,
} from "./lib/storage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Play, Settings, BookOpen, Calendar } from "lucide-react";
import HotQuestionsSection from "./components/HotQuestionsSection";

export default function HomePage() {
  const [storiesData, setStoriesData] = useState<StoriesData | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Load stories data with migration support
    const loaded =
      loadStoriesData() || migrateLegacyData() || getDefaultStoriesData();
    console.log("HomePage: Loaded stories data:", loaded);
    console.log("HomePage: Available story IDs:", Object.keys(loaded.stories));
    setStoriesData(loaded);
  }, []);

  const handlePlayStory = (storyId: string) => {
    console.log("HomePage: Playing story with ID:", storyId);
    router.push(`/story/${storyId}`);
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

  if (!storiesData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="text-2xl font-semibold text-gray-600 animate-pulse">
          Loading stories...
        </div>
      </div>
    );
  }

  const stories = Object.values(storiesData.stories);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Header */}
      <div className="bg-white/60 backdrop-blur-sm border-b border-gray-200/30">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 tracking-tight mb-4">
              Logical Challenge Stories
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose a story and embark on your logical journey through
              thought-provoking challenges
            </p>
          </div>
        </div>
      </div>

      {/* Story Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {stories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((story) => (
              <Card
                key={story.id}
                className="transition-all duration-200 hover:shadow-xl hover:scale-[1.02] border-2 border-gray-200/50 hover:border-primary/50 bg-white/80 backdrop-blur-sm"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-xl leading-tight line-clamp-2 mb-3">
                        {story.name}
                      </CardTitle>
                      {story.description && (
                        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                          {story.description}
                        </p>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {/* Stats */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        <span>{getNodeCount(story)} challenges</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(story.updatedAt)}</span>
                      </div>
                    </div>

                    {/* Play Button */}
                    <Button
                      onClick={() => handlePlayStory(story.id)}
                      className="w-full shadow-sm"
                      size="lg"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start Journey
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <BookOpen className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              No stories available
            </h3>
            <p className="text-muted-foreground max-w-md mb-6 text-lg">
              There are no logical challenge stories to explore yet. Visit the
              admin panel to create your first story.
            </p>
            <Button
              onClick={() => router.push("/admin/story")}
              size="lg"
              className="shadow-sm"
            >
              <Settings className="h-4 w-4 mr-2" />
              Create Your First Story
            </Button>
          </div>
        )}
      </div>

      {/* Hot Questions Section */}
      <HotQuestionsSection />
    </div>
  );
}
