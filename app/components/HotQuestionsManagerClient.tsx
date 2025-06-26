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
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  Tag as TagIcon,
  Download,
  Upload,
} from "lucide-react";

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
  onExportTopics: () => Promise<void>;
  onImportTopic: (jsonData: string) => Promise<void>;
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
  onExportTopics,
  onImportTopic,
  isLoading,
}: HotQuestionsManagerClientProps) {
  const [isCreateTopicDialogOpen, setIsCreateTopicDialogOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<HotTopic | null>(null);
  const [isCreateTagDialogOpen, setIsCreateTagDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [importJsonData, setImportJsonData] = useState("");

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
    if (!topicFormData.title.trim() || !topicFormData.answer || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onTopicCreate(
        topicFormData.selectedTags,
        topicFormData.title.trim(),
        topicFormData.answer
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
      !topicFormData.answer ||
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
        topicFormData.answer
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

    if (
      window.confirm(`დარწმუნებული ხართ, რომ გსურთ წაშალოთ "${topic.title}"?`)
    ) {
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
        ? `თეგი "${tag.label}" გამოიყენება ${topicsUsingTag.length} კითხვაში. დარწმუნებული ხართ, რომ გსურთ მისი წაშლა? ეს ასევე წაშლის თეგს ყველა დაკავშირებული კითხვიდან.`
        : `დარწმუნებული ხართ, რომ გსურთ წაშალოთ თეგი "${tag.label}"?`;

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

  // Import handlers
  const handleImportDialogClose = () => {
    if (isSubmitting) return;
    setIsImportDialogOpen(false);
    setImportJsonData("");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setImportJsonData(content);
      };
      reader.readAsText(file);
    }
  };

  const handleImportSubmit = async () => {
    if (!importJsonData.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onImportTopic(importJsonData);
      handleImportDialogClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-none">
      <CardHeader>
        <CardTitle>აქტუალური კითხვების მენეჯერი</CardTitle>
      </CardHeader>
      <CardContent className="px-6">
        <Tabs defaultValue="topics">
          <TabsList>
            <TabsTrigger value="topics">კითხვები</TabsTrigger>
            <TabsTrigger value="tags">თეგები</TabsTrigger>
          </TabsList>

          {/* Topics Tab */}
          <TabsContent value="topics" className="mt-4">
            <div className="flex justify-between mb-4">
              <div className="flex gap-2">
                <Button
                  onClick={onExportTopics}
                  variant="outline"
                  disabled={isLoading || topics.length === 0}
                >
                  <Download className="h-4 w-4" />
                  ექსპორტი JSON-ად
                </Button>
                <Button
                  onClick={() => setIsImportDialogOpen(true)}
                  variant="outline"
                  disabled={isLoading}
                >
                  <Upload className="h-4 w-4" />
                  იმპორტი JSON-იდან
                </Button>
              </div>
              <Button onClick={() => setIsCreateTopicDialogOpen(true)}>
                <Plus className=" h-4 w-4" />
                ახალი კითხვა
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>სათაური</TableHead>
                  <TableHead>თეგები</TableHead>
                  <TableHead className="text-right">მოქმედებები</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      <Loader2 className="h-6 w-6 animate-spin inline-block" />
                    </TableCell>
                  </TableRow>
                ) : topics.length > 0 ? (
                  topics.map((topic) => (
                    <TableRow key={topic.id}>
                      <TableCell className="font-medium">
                        {topic.title}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {topic.tagData?.map((tag) => (
                            <Badge
                              key={tag.id}
                              style={{
                                backgroundColor: tag.color,
                                borderColor: "rgb(156 163 175)", // gray-400
                                color: "white",
                              }}
                            >
                              {tag.emoji} {tag.label}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditTopic(topic)}
                          disabled={isLoading}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteTopic(topic)}
                          disabled={isLoading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      კითხვები არ მოიძებნა.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TabsContent>

          {/* Tags Tab */}
          <TabsContent value="tags" className="mt-4">
            <div className="flex justify-end mb-4">
              <Button onClick={() => setIsCreateTagDialogOpen(true)}>
                <TagIcon className=" h-4 w-4" />
                ახალი თეგი
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ნიმუში</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>დასახელება</TableHead>
                  <TableHead className="text-right">მოქმედებები</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      <Loader2 className="h-6 w-6 animate-spin inline-block" />
                    </TableCell>
                  </TableRow>
                ) : allTags.length > 0 ? (
                  allTags.map((tag) => (
                    <TableRow key={tag.id}>
                      <TableCell>
                        <Badge
                          style={{
                            backgroundColor: tag.color,
                            borderColor: "rgb(156 163 175)", // gray-400
                          }}
                        >
                          {tag.emoji} {tag.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono">{tag.id}</TableCell>
                      <TableCell>{tag.label}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditTag(tag)}
                          disabled={isLoading}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteTag(tag)}
                          disabled={isLoading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      თეგები არ მოიძებნა.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </CardContent>

      {/* Topic Create/Edit Dialog */}
      <Dialog
        open={isCreateTopicDialogOpen}
        onOpenChange={handleTopicDialogClose}
      >
        <DialogContent className="w-[80vw]! max-w-[1800px]!  flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {editingTopic ? "კითხვის რედაქტირება" : "ახალი კითხვის შექმნა"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4 flex-grow overflow-y-auto pr-6">
            <div className="space-y-2">
              <Label htmlFor="tags" className="text-sm font-medium">
                აირჩიეთ თეგები
              </Label>
              <div>
                {allTags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {allTags.map((tag) => (
                      <Badge
                        key={tag.id}
                        variant={
                          topicFormData.selectedTags.includes(tag.id)
                            ? "default"
                            : "outline"
                        }
                        onClick={() => toggleTagSelection(tag.id)}
                        className="cursor-pointer"
                        style={
                          topicFormData.selectedTags.includes(tag.id)
                            ? {
                                backgroundColor: tag.color,
                                borderColor: "rgb(156 163 175)", // gray-400
                                color: "white",
                              }
                            : {}
                        }
                      >
                        {tag.emoji} {tag.label}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    თეგები არ არის ხელმისაწვდომი. გთხოვთ, ჯერ შექმენით თეგი.
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                სათაური
              </Label>
              <Input
                id="title"
                value={topicFormData.title}
                onChange={(e) =>
                  setTopicFormData({ ...topicFormData, title: e.target.value })
                }
                placeholder="მაგ., მინიმალური ხელფასი"
                className="w-full"
              />
            </div>
            <div className="space-y-2 flex-grow">
              <Label htmlFor="answer" className="text-sm font-medium">
                პასუხი
              </Label>
              <div className="min-h-[300px]">
                <MarkdownEditor
                  value={topicFormData.answer}
                  onChange={(value) =>
                    setTopicFormData({ ...topicFormData, answer: value || "" })
                  }
                  placeholder="აკრიფეთ პასუხი აქ..."
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateTopicDialogOpen(false)}
            >
              გაუქმება
            </Button>
            <Button
              onClick={editingTopic ? handleUpdateTopic : handleCreateTopic}
              disabled={
                isSubmitting ||
                !topicFormData.title.trim() ||
                !topicFormData.answer
              }
            >
              {isSubmitting ? (
                <Loader2 className=" h-4 w-4 animate-spin" />
              ) : null}
              {editingTopic ? "ცვლილებების შენახვა" : "კითხვის შექმნა"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tag Create/Edit Dialog */}
      <Dialog open={isCreateTagDialogOpen} onOpenChange={handleTagDialogClose}>
        <DialogContent className="w-[80vw]! max-w-[1800px]! ">
          <DialogHeader>
            <DialogTitle>
              {editingTag ? "თეგის რედაქტირება" : "ახალი თეგის შექმნა"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tag-id" className="text-right">
                თეგის ID
              </Label>
              <Input
                id="tag-id"
                value={tagFormData.id}
                onChange={(e) =>
                  setTagFormData({ ...tagFormData, id: e.target.value })
                }
                className="col-span-3 font-mono"
                placeholder="მაგ., ekonomika"
                disabled={!!editingTag}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tag-label" className="text-right">
                თეგის დასახელება
              </Label>
              <Input
                id="tag-label"
                value={tagFormData.label}
                onChange={(e) =>
                  setTagFormData({ ...tagFormData, label: e.target.value })
                }
                className="col-span-3"
                placeholder="მაგ., ეკონომიკა"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tag-emoji" className="text-right">
                თეგის ემოჯი
              </Label>
              <Input
                id="tag-emoji"
                value={tagFormData.emoji}
                onChange={(e) =>
                  setTagFormData({ ...tagFormData, emoji: e.target.value })
                }
                className="col-span-3"
                maxLength={2}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tag-color" className="text-right">
                თეგის ფერი
              </Label>
              <Input
                id="tag-color"
                type="color"
                value={tagFormData.color}
                onChange={(e) =>
                  setTagFormData({ ...tagFormData, color: e.target.value })
                }
                className="col-span-3 p-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateTagDialogOpen(false)}
            >
              გაუქმება
            </Button>
            <Button
              onClick={editingTag ? handleUpdateTag : handleCreateTag}
              disabled={
                isSubmitting ||
                !tagFormData.id.trim() ||
                !tagFormData.label.trim() ||
                !tagFormData.emoji.trim() ||
                !tagFormData.color.trim()
              }
            >
              {isSubmitting ? (
                <Loader2 className=" h-4 w-4 animate-spin" />
              ) : null}
              {editingTag ? "ცვლილებების შენახვა" : "თეგის შექმნა"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={handleImportDialogClose}>
        <DialogContent className="w-[80vw] max-w-[800px]">
          <DialogHeader>
            <DialogTitle>ცხელი კითხვის იმპორტი JSON-იდან</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="json-file" className="text-sm font-medium">
                აირჩიეთ JSON ფაილი
              </Label>
              <Input
                id="json-file"
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="json-content" className="text-sm font-medium">
                ან ჩაწერეთ JSON შინაარსი
              </Label>
              <textarea
                id="json-content"
                value={importJsonData}
                onChange={(e) => setImportJsonData(e.target.value)}
                placeholder={`{
  "title": "კითხვის სათაური",
  "answer": "კითხვის პასუხი markdown ფორმატში",
  "tags": ["tag1", "tag2"]
}`}
                className="w-full h-40 p-3 border border-gray-300 rounded-md font-mono text-sm"
                disabled={isSubmitting}
              />
            </div>
            <div className="text-sm text-gray-600">
              <p>JSON უნდა შეიცავდეს:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>
                  <strong>title:</strong> კითხვის სათაური
                </li>
                <li>
                  <strong>answer:</strong> კითხვის პასუხი (Markdown ფორმატში)
                </li>
                <li>
                  <strong>tags:</strong> თეგების ID-ების სია (არასავალდებულო)
                </li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleImportDialogClose}
              disabled={isSubmitting}
            >
              გაუქმება
            </Button>
            <Button
              onClick={handleImportSubmit}
              disabled={isSubmitting || !importJsonData.trim()}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : null}
              იმპორტი
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
