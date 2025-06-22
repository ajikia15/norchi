"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Story, FlowData, Node } from "@/app/types";
import { updateStory } from "@/app/lib/actions";
import NodeList from "@/app/components/NodeList";
import NodeEditor from "@/app/components/NodeEditor";
import FlowGraph from "@/app/components/FlowGraph";
import VisualEditor from "@/app/components/VisualEditor";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Save,
  FileText,
  Workflow,
  Settings,
  Plus,
  Download,
  Upload,
  Loader2,
} from "lucide-react";

interface StoryEditClientProps {
  storyId: string;
  initialStory: Story;
}

export default function StoryEditClient({
  storyId,
  initialStory,
}: StoryEditClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [currentStory, setCurrentStory] = useState<Story>(initialStory);
  const [flowData, setFlowData] = useState<FlowData>(initialStory.flowData);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [editingNode, setEditingNode] = useState<Node | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleSave = async () => {
    if (!currentStory || !flowData) return;

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("name", currentStory.name);
        if (currentStory.description) {
          formData.append("description", currentStory.description);
        }
        formData.append("flowData", JSON.stringify(flowData));

        await updateStory(storyId, formData);
        setHasUnsavedChanges(false);
        // Optionally refresh the page to get updated data
        router.refresh();
      } catch (error) {
        console.error("StoryEditClient: Error saving story:", error);
        alert("Failed to save story");
      }
    });
  };

  const handleFlowDataChange = (newFlowData: FlowData) => {
    setFlowData(newFlowData);
    setCurrentStory((current: Story) => ({
      ...current,
      flowData: newFlowData,
    }));
    setHasUnsavedChanges(true);
  };

  const handleCreateNode = (
    nodeType: "question" | "end" | "callout" | "infocard" = "question"
  ) => {
    if (!flowData) return;

    let newNode: Node;
    const nodeId = `node_${Date.now()}`;

    if (nodeType === "question") {
      newNode = {
        id: nodeId,
        type: "question",
        text: "New question",
        options: [
          { label: "Option 1", nextNodeId: "" },
          { label: "Option 2", nextNodeId: "" },
        ],
      };
    } else if (nodeType === "end") {
      newNode = {
        id: nodeId,
        type: "end",
        text: "New ending message",
      };
    } else if (nodeType === "callout") {
      newNode = {
        id: nodeId,
        type: "callout",
        text: "New callout message",
        returnToNodeId: "",
        buttonLabel: "Try Again",
      };
    } else {
      newNode = {
        id: nodeId,
        type: "infocard",
        text: "New information",
        nextNodeId: "",
        buttonLabel: "Continue",
      };
    }

    setEditingNode(newNode);
    setSelectedNodeId(nodeId);
    setIsCreating(true);
  };

  const handleEditNode = (node: Node) => {
    setEditingNode(node);
    setSelectedNodeId(node.id);
    setIsCreating(false);
  };

  const handleDeleteNode = (nodeId: string) => {
    if (!flowData) return;

    if (confirm("Are you sure you want to delete this node?")) {
      const newNodes = { ...flowData.nodes };
      delete newNodes[nodeId];

      const updatedFlowData: FlowData = {
        ...flowData,
        nodes: newNodes,
        startNodeId:
          nodeId === flowData.startNodeId ? "" : flowData.startNodeId,
      };

      handleFlowDataChange(updatedFlowData);

      if (selectedNodeId === nodeId) {
        setSelectedNodeId(null);
        setEditingNode(null);
      }
    }
  };

  const handleSaveNode = (node: Node) => {
    if (!flowData) return;

    const updatedFlowData: FlowData = {
      ...flowData,
      nodes: {
        ...flowData.nodes,
        [node.id]: node,
      },
      startNodeId: flowData.startNodeId || node.id,
    };

    handleFlowDataChange(updatedFlowData);
    setEditingNode(node);
  };

  const handleCancelEdit = () => {
    setEditingNode(null);
    setSelectedNodeId(null);
    setIsCreating(false);
  };

  const handleNodeHover = (nodeId: string | null) => {
    setHoveredNodeId(nodeId);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isFullscreen]);

  const handleCreateAndConnect = (
    nodeType: string,
    nodeName: string,
    currentField: string
  ) => {
    if (!flowData || !editingNode) return;

    const currentNodeWithChanges = editingNode;
    const updatedFlowData = {
      ...flowData,
      nodes: {
        ...flowData.nodes,
        [currentNodeWithChanges.id]: currentNodeWithChanges,
      },
      startNodeId: flowData.startNodeId || currentNodeWithChanges.id,
    };

    const newNodeId = `node_${Date.now()}`;
    let newNode: Node;

    if (nodeType === "question") {
      newNode = {
        id: newNodeId,
        type: "question",
        text: nodeName,
        options: [
          { label: "Option 1", nextNodeId: "" },
          { label: "Option 2", nextNodeId: "" },
        ],
      };
    } else if (nodeType === "end") {
      newNode = {
        id: newNodeId,
        type: "end",
        text: nodeName,
      };
    } else if (nodeType === "callout") {
      newNode = {
        id: newNodeId,
        type: "callout",
        text: nodeName,
        returnToNodeId: "",
        buttonLabel: "Try Again",
      };
    } else if (nodeType === "infocard") {
      newNode = {
        id: newNodeId,
        type: "infocard",
        text: nodeName,
        nextNodeId: "",
        buttonLabel: "Continue",
      };
    } else {
      return;
    }

    const updatedCurrentNode = { ...currentNodeWithChanges };

    if (currentField.startsWith("question_option_")) {
      const optionIndex = parseInt(currentField.split("_")[2]);
      if (
        updatedCurrentNode.type === "question" &&
        updatedCurrentNode.options[optionIndex]
      ) {
        updatedCurrentNode.options[optionIndex].nextNodeId = newNodeId;
      }
    } else if (currentField === "callout_return") {
      if (updatedCurrentNode.type === "callout") {
        updatedCurrentNode.returnToNodeId = newNodeId;
      }
    } else if (currentField === "infocard_next") {
      if (updatedCurrentNode.type === "infocard") {
        updatedCurrentNode.nextNodeId = newNodeId;
      }
    }

    const finalFlowData: FlowData = {
      ...updatedFlowData,
      nodes: {
        ...updatedFlowData.nodes,
        [updatedCurrentNode.id]: updatedCurrentNode,
        [newNodeId]: newNode,
      },
    };

    handleFlowDataChange(finalFlowData);
    setEditingNode(newNode);
    setSelectedNodeId(newNodeId);
    setIsCreating(true);
  };

  const handleExportJSON = () => {
    if (!currentStory || !flowData) return;

    try {
      const storyToExport = {
        ...currentStory,
        flowData: flowData,
      };

      const exportData = {
        story: storyToExport,
        exportedAt: new Date().toISOString(),
        exportVersion: "1.0",
        metadata: {
          totalNodes: Object.keys(flowData.nodes).length,
          nodeTypes: {
            question: Object.values(flowData.nodes).filter(
              (n) => n.type === "question"
            ).length,
            end: Object.values(flowData.nodes).filter((n) => n.type === "end")
              .length,
            callout: Object.values(flowData.nodes).filter(
              (n) => n.type === "callout"
            ).length,
            infocard: Object.values(flowData.nodes).filter(
              (n) => n.type === "infocard"
            ).length,
          },
        },
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });

      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${currentStory.name
        .replace(/[^a-z0-9]/gi, "_")
        .toLowerCase()}_story.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting story:", error);
      alert("Error exporting story. Please try again.");
    }
  };

  const handleImportJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const jsonContent = JSON.parse(content);
        const importedStory = jsonContent.story;

        const confirmMessage = `Import story "${
          importedStory.name
        }"?\n\nNodes found: ${
          Object.keys(importedStory.flowData?.nodes || {}).length
        }\n\nThis will replace the current story data. Make sure you've saved any changes you want to keep.`;

        if (confirm(confirmMessage)) {
          const updatedStory = {
            ...importedStory,
            id: storyId,
            updatedAt: new Date().toISOString(),
          };

          setCurrentStory(updatedStory);
          setFlowData(importedStory.flowData);
          setHasUnsavedChanges(true);
        }
      } catch (error) {
        console.error("Error importing story:", error);
        alert(
          "Error reading the story file. Please check that the file is a valid JSON story export."
        );
      }
    };

    reader.readAsText(file);
    event.target.value = "";
  };

  const nodeCount = Object.keys(flowData.nodes).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Quick Actions Bar */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold text-gray-900">
                {currentStory.name}
              </h2>
              <Badge variant="outline" className="text-xs">
                {nodeCount} node{nodeCount !== 1 ? "s" : ""}
              </Badge>
              {hasUnsavedChanges && (
                <Badge variant="destructive" className="text-xs">
                  Unsaved changes
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => router.push(`/story/${storyId}`)}
                variant="outline"
                size="sm"
                className="shadow-sm"
                disabled={isPending}
              >
                <Play className="h-4 w-4 " />
                Test Flow
              </Button>
              <Button
                onClick={handleSave}
                disabled={!hasUnsavedChanges || isPending}
                size="sm"
                className="shadow-sm"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4  animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 " />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="editor" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger
              value="settings"
              className="flex items-center gap-2"
              disabled={isPending}
            >
              <Settings className="h-4 w-4" />
              Story Settings
            </TabsTrigger>
            <TabsTrigger
              value="editor"
              className="flex items-center gap-2"
              disabled={isPending}
            >
              <FileText className="h-4 w-4" />
              Nodes & Editor
            </TabsTrigger>
            <TabsTrigger
              value="flowgraph"
              className="flex items-center gap-2"
              disabled={isPending}
            >
              <Workflow className="h-4 w-4" />
              Flow Graph
            </TabsTrigger>
            <TabsTrigger
              value="visual"
              className="flex items-center gap-2"
              disabled={isPending}
            >
              <Play className="h-4 w-4" />
              ვიზუალური რედაქტორი
            </TabsTrigger>
          </TabsList>

          <TabsContent value="settings">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      ისტორიის ინფორმაცია
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label
                          htmlFor="story-name"
                          className="text-sm font-medium"
                        >
                          ისტორიის სახელი
                        </label>
                        <input
                          id="story-name"
                          type="text"
                          value={currentStory.name}
                          onChange={(e) => {
                            setCurrentStory({
                              ...currentStory,
                              name: e.target.value,
                            });
                            setHasUnsavedChanges(true);
                          }}
                          disabled={isPending}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
                          placeholder="შეიყვანეთ ისტორიის სახელი..."
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="story-description"
                          className="text-sm font-medium"
                        >
                          აღწერა (სურვილისამებრ)
                        </label>
                        <textarea
                          id="story-description"
                          value={currentStory.description || ""}
                          onChange={(e) => {
                            setCurrentStory({
                              ...currentStory,
                              description: e.target.value,
                            });
                            setHasUnsavedChanges(true);
                          }}
                          disabled={isPending}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
                          placeholder="მოკლე აღწერა, თუ რას იკვლევს ეს გზა..."
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4">
                      ისტორიის სტატისტიკა
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-primary">
                          {nodeCount}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          სულ კვანძები
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {
                            Object.values(flowData.nodes).filter(
                              (n) => n.type === "question"
                            ).length
                          }
                        </div>
                        <div className="text-sm text-muted-foreground">
                          კითხვები
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {
                            Object.values(flowData.nodes).filter(
                              (n) => n.type === "end"
                            ).length
                          }
                        </div>
                        <div className="text-sm text-muted-foreground">
                          დასასრულები
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">
                          {Object.values(flowData.nodes).filter(
                            (n) => n.type === "callout"
                          ).length +
                            Object.values(flowData.nodes).filter(
                              (n) => n.type === "infocard"
                            ).length}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          საინფორმაციო ბარათები
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4">
                      იმპორტი და ექსპორტი
                    </h3>
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                          <Button
                            onClick={handleExportJSON}
                            variant="outline"
                            className="w-full justify-center"
                            disabled={isPending}
                          >
                            <Download className="h-4 w-4 " />
                            ექსპორტი JSON ფორმატში
                          </Button>
                          <p className="text-xs text-muted-foreground mt-2">
                            ჩამოტვირთეთ თქვენი გზა JSON ფაილის სახით სარეზერვო
                            ასლისთვის ან გასაზიარებლად
                          </p>
                        </div>

                        <div className="flex-1">
                          <div className="relative">
                            <input
                              type="file"
                              accept=".json"
                              onChange={handleImportJSON}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              id="import-json"
                              disabled={isPending}
                            />
                            <Button
                              variant="outline"
                              className="w-full justify-center"
                              disabled={isPending}
                              asChild
                            >
                              <label
                                htmlFor="import-json"
                                className="cursor-pointer"
                              >
                                <Upload className="h-4 w-4 " />
                                იმპორტი JSON-დან
                              </label>
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            ჩატვირთეთ გზა ადრე ექსპორტირებული JSON ფაილიდან
                          </p>
                        </div>
                      </div>

                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <div className="flex items-start gap-2">
                          <div className="text-amber-600 mt-0.5">⚠️</div>
                          <div className="text-sm">
                            <div className="font-medium text-amber-800 mb-1">
                              მნიშვნელოვანია:
                            </div>
                            <ul className="text-amber-700 space-y-1 text-xs">
                              <li>
                                • იმპორტი ჩაანაცვლებს ყველა მიმდინარე ისტორიის
                                მონაცემს
                              </li>
                              <li>
                                • იმპორტამდე დარწმუნდით, რომ შეინახეთ მიმდინარე
                                ნამუშევარი
                              </li>
                              <li>
                                • მხოლოდ ნორჩიდან ექსპორტირებული JSON ფაილების
                                იმპორტი
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="editor" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <Card className="shadow-sm border-0 bg-white/60 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl">
                      კვანძების ბიბლიოთეკა
                    </CardTitle>
                    <Button
                      onClick={() => handleCreateNode("question")}
                      size="sm"
                      className="shadow-sm"
                      disabled={isPending}
                    >
                      <Plus className="h-4 w-4 " />
                      ახალი კვანძის დამატება
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <NodeList
                    nodes={flowData.nodes}
                    startNodeId={flowData.startNodeId}
                    onEdit={handleEditNode}
                    onDelete={handleDeleteNode}
                    hoveredNodeId={hoveredNodeId}
                    selectedNodeId={selectedNodeId}
                  />
                </CardContent>
              </Card>

              <Card className="shadow-sm border-0 bg-white/60 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">
                    {editingNode
                      ? isCreating
                        ? "ახალი კვანძის შექმნა"
                        : "კვანძის რედაქტირება"
                      : "კვანძის რედაქტორი"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {editingNode ? (
                    <NodeEditor
                      node={editingNode}
                      allNodes={flowData.nodes}
                      onSave={handleSaveNode}
                      onCancel={handleCancelEdit}
                      onNodeHover={handleNodeHover}
                      onCreateAndConnect={handleCreateAndConnect}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <FileText className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        აირჩიეთ კვანძი რედაქტირებისთვის
                      </h3>
                      <p className="text-muted-foreground max-w-sm mb-4">
                        აირჩიეთ კვანძი ბიბლიოთეკიდან ან შექმენით ახალი
                        რედაქტირების დასაწყებად
                      </p>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleCreateNode("question")}
                          size="sm"
                          disabled={isPending}
                        >
                          <Plus className="h-4 w-4 " />
                          კითხვის შექმნა
                        </Button>
                        <Button
                          onClick={() => handleCreateNode("callout")}
                          variant="outline"
                          size="sm"
                          disabled={isPending}
                        >
                          <Plus className="h-4 w-4 " />
                          გამოძახების შექმნა
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="flowgraph">
            <Card>
              <CardContent className="p-6">
                <FlowGraph flowData={flowData} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="visual">
            <Card
              className={`transition-all duration-300 ${
                isFullscreen
                  ? "fixed inset-0 z-50 bg-white rounded-none border-0 shadow-2xl"
                  : "shadow-sm"
              }`}
            >
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">ვიზუალური რედაქტორი</CardTitle>
              </CardHeader>
              <CardContent
                className={`${
                  isFullscreen ? "p-6 h-[calc(100vh-80px)]" : "p-6"
                }`}
              >
                <VisualEditor
                  flowData={flowData}
                  onFlowDataChange={handleFlowDataChange}
                  isFullscreen={isFullscreen}
                  onToggleFullscreen={toggleFullscreen}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
