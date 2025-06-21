"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { StoriesData, Story, FlowData, Node } from "@/app/types";
import {
  loadStoriesData,
  saveStoriesData,
  getDefaultStoriesData,
  migrateLegacyData,
  updateStory,
} from "@/app/lib/storage";
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
} from "lucide-react";

export default function StoryEditPage() {
  const params = useParams();
  const router = useRouter();
  const storyId = params.id as string;

  const [storiesData, setStoriesData] = useState<StoriesData | null>(null);
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [flowData, setFlowData] = useState<FlowData | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editingNode, setEditingNode] = useState<Node | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    console.log("StoryEditPage: Loading story with ID:", storyId);

    // Load stories data
    const loaded =
      loadStoriesData() || migrateLegacyData() || getDefaultStoriesData();
    console.log("StoryEditPage: Loaded stories data:", loaded);

    if (!loaded) {
      console.error("StoryEditPage: No stories data found");
      router.push("/admin/story");
      return;
    }

    // Check if story exists
    const story = loaded.stories[storyId];
    console.log("StoryEditPage: Found story:", story);

    if (!story) {
      console.error("StoryEditPage: Story not found with ID:", storyId);
      alert(`Story not found: ${storyId}`);
      router.push("/admin/story");
      return;
    }

    setStoriesData(loaded);
    setCurrentStory(story);
    setFlowData(story.flowData);
    setIsLoading(false);
  }, [storyId, router]);

  const handleSave = () => {
    if (!storiesData || !currentStory || !flowData) return;

    try {
      const updatedStory = {
        ...currentStory,
        flowData,
        updatedAt: new Date().toISOString(),
      };

      const updatedData = updateStory(storiesData, storyId, updatedStory);
      setStoriesData(updatedData);
      saveStoriesData(updatedData);
      setCurrentStory(updatedStory);
      setHasUnsavedChanges(false);

      console.log("StoryEditPage: Saved story:", storyId);
    } catch (error) {
      console.error("StoryEditPage: Error saving story:", error);
      alert("Failed to save story");
    }
  };

  const handleFlowDataChange = (newFlowData: FlowData) => {
    setFlowData(newFlowData);
    setCurrentStory((current: Story | null) =>
      current ? { ...current, flowData: newFlowData } : null
    );
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
        // If we're deleting the start node, clear it
        startNodeId:
          nodeId === flowData.startNodeId ? "" : flowData.startNodeId,
      };

      handleFlowDataChange(updatedFlowData);

      // Clear selection if we deleted the selected node
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
      // If this is the first node and no start node is set, make it the start node
      startNodeId: flowData.startNodeId || node.id,
    };

    handleFlowDataChange(updatedFlowData);
    // Keep the node open by updating editingNode with the saved version
    // This ensures the editor continues to work with the latest saved data
    setEditingNode(node);
    // Keep the node selected to maintain visual connections
    // Note: selectedNodeId stays the same, isCreating remains false unless it was true
  };

  const handleCancelEdit = () => {
    // Clean up all editing state
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

  // Handle escape key to exit fullscreen
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

    // Use the current editing node (should already be saved by NodeEditor)
    const currentNodeWithChanges = editingNode;
    const updatedFlowData = {
      ...flowData,
      nodes: {
        ...flowData.nodes,
        [currentNodeWithChanges.id]: currentNodeWithChanges,
      },
      startNodeId: flowData.startNodeId || currentNodeWithChanges.id,
    };

    // Generate new node ID
    const newNodeId = `node_${Date.now()}`;
    let newNode: Node;

    // Create the appropriate node type with the provided name
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

    // Update the current editing node to connect to the new node
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

    // Update the flow data with both the updated current node and the new node
    const finalFlowData: FlowData = {
      ...updatedFlowData,
      nodes: {
        ...updatedFlowData.nodes,
        [updatedCurrentNode.id]: updatedCurrentNode,
        [newNodeId]: newNode,
      },
    };

    // Update state - switch to editing the new node
    handleFlowDataChange(finalFlowData);
    setEditingNode(newNode);
    setSelectedNodeId(newNodeId);
    setIsCreating(true);
  };

  // Export story as JSON
  const handleExportJSON = () => {
    if (!currentStory || !flowData) return;

    try {
      // Ensure we have the latest flowData in the story
      const storyToExport = {
        ...currentStory,
        flowData: flowData, // Use current flowData state, not the one in currentStory
      };

      console.log("Exporting story with flowData:", {
        currentStoryNodes: Object.keys(currentStory.flowData?.nodes || {})
          .length,
        currentFlowDataNodes: Object.keys(flowData.nodes).length,
        nodeIds: Object.keys(flowData.nodes),
        allNodes: Object.values(flowData.nodes).map((n) => ({
          id: n.id,
          type: n.type,
          text: n.text?.substring(0, 50) + "...",
        })),
      });

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

      console.log("Story exported successfully:", currentStory.name);
    } catch (error) {
      console.error("Error exporting story:", error);
      alert("Error exporting story. Please try again.");
    }
  };

  // Import story from JSON
  const handleImportJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const jsonContent = JSON.parse(content);
        const nodes = jsonContent.nodes || {};
        // Basic validation
        (Object.values(nodes) as Partial<Node>[]).forEach((n) => {
          if (!n.id || !n.type || !n.text) {
            throw new Error(`Invalid node data found: ${JSON.stringify(n)}`);
          }
        });

        const importedStory = jsonContent.story;

        console.log("Importing story:", {
          storyName: importedStory.name,
          importedNodes: Object.keys(importedStory.flowData?.nodes || {})
            .length,
          nodeIds: Object.keys(importedStory.flowData?.nodes || {}),
          rawFlowData: importedStory.flowData,
        });

        // Confirm import
        const confirmMessage = `Import story "${
          importedStory.name
        }"?\n\nNodes found: ${
          Object.keys(importedStory.flowData?.nodes || {}).length
        }\n\nThis will replace the current story data. Make sure you've saved any changes you want to keep.`;

        if (confirm(confirmMessage)) {
          // Update the story with imported data, keeping the current ID and timestamps
          const updatedStory = {
            ...importedStory,
            id: storyId, // Keep current story ID
            updatedAt: new Date().toISOString(),
          };

          console.log("Setting imported data:", {
            storyNodes: Object.keys(updatedStory.flowData?.nodes || {}).length,
            flowDataNodes: Object.keys(importedStory.flowData?.nodes || {})
              .length,
          });

          setCurrentStory(updatedStory);
          setFlowData(importedStory.flowData);
          setHasUnsavedChanges(true);

          console.log("Story imported successfully:", updatedStory.name);
        }
      } catch (error) {
        console.error("Error importing story:", error);
        alert(
          "Error reading the story file. Please check that the file is a valid JSON story export."
        );
      }
    };

    reader.readAsText(file);
    // Reset file input
    event.target.value = "";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="text-2xl font-semibold text-gray-600 animate-pulse">
          Loading story editor...
        </div>
      </div>
    );
  }

  if (!storiesData || !currentStory || !flowData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-br from-red-50 to-red-100">
        <div className="bg-red-100 border-2 border-red-300 text-red-800 px-6 py-4 rounded-2xl mb-6 text-center max-w-md">
          <h2 className="text-xl font-bold mb-2">Story Not Found</h2>
          <p className="mb-4">
            The story you&apos;re trying to edit doesn&apos;t exist.
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              onClick={() => router.push("/admin/story")}
              variant="outline"
            >
              Back to Admin
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
              >
                <Play className="h-4 w-4 mr-2" />
                Test Flow
              </Button>
              <Button
                onClick={handleSave}
                disabled={!hasUnsavedChanges}
                size="sm"
                className="shadow-sm"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="editor" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Story Settings
            </TabsTrigger>
            <TabsTrigger value="editor" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Nodes & Editor
            </TabsTrigger>
            <TabsTrigger value="flowgraph" className="flex items-center gap-2">
              <Workflow className="h-4 w-4" />
              Flow Graph
            </TabsTrigger>
            <TabsTrigger value="visual" className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Visual Editor
            </TabsTrigger>
          </TabsList>

          <TabsContent value="settings">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Story Information
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label
                          htmlFor="story-name"
                          className="text-sm font-medium"
                        >
                          Story Name
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Enter story name..."
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="story-description"
                          className="text-sm font-medium"
                        >
                          Description (Optional)
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
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Brief description of what this story explores..."
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Story Statistics
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-primary">
                          {nodeCount}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Total Nodes
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
                          Questions
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
                          Endings
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
                          Info Cards
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Import & Export
                    </h3>
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row gap-4">
                        {/* Export JSON */}
                        <div className="flex-1">
                          <Button
                            onClick={handleExportJSON}
                            variant="outline"
                            className="w-full justify-center"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Export as JSON
                          </Button>
                          <p className="text-xs text-muted-foreground mt-2">
                            Download your story as a JSON file for backup or
                            sharing
                          </p>
                        </div>

                        {/* Import JSON */}
                        <div className="flex-1">
                          <div className="relative">
                            <input
                              type="file"
                              accept=".json"
                              onChange={handleImportJSON}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              id="import-json"
                            />
                            <Button
                              variant="outline"
                              className="w-full justify-center"
                              asChild
                            >
                              <label
                                htmlFor="import-json"
                                className="cursor-pointer"
                              >
                                <Upload className="h-4 w-4 mr-2" />
                                Import from JSON
                              </label>
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            Load a story from a previously exported JSON file
                          </p>
                        </div>
                      </div>

                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <div className="flex items-start gap-2">
                          <div className="text-amber-600 mt-0.5">⚠️</div>
                          <div className="text-sm">
                            <div className="font-medium text-amber-800 mb-1">
                              Important:
                            </div>
                            <ul className="text-amber-700 space-y-1 text-xs">
                              <li>
                                • Importing will replace all current story data
                              </li>
                              <li>
                                • Make sure to save your current work before
                                importing
                              </li>
                              <li>
                                • Only import JSON files exported from Norchi
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
              {/* Node List */}
              <Card className="shadow-sm border-0 bg-white/60 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl">Node Library</CardTitle>
                    <Button
                      onClick={() => handleCreateNode("question")}
                      size="sm"
                      className="shadow-sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add new node
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

              {/* Node Editor */}
              <Card className="shadow-sm border-0 bg-white/60 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">
                    {editingNode
                      ? isCreating
                        ? "Create New Node"
                        : "Edit Node"
                      : "Node Editor"}
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
                        Select a node to edit
                      </h3>
                      <p className="text-muted-foreground max-w-sm mb-4">
                        Choose a node from the library or create a new one to
                        start editing
                      </p>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleCreateNode("question")}
                          size="sm"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Create Question
                        </Button>
                        <Button
                          onClick={() => handleCreateNode("callout")}
                          variant="outline"
                          size="sm"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Create Callout
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
                <CardTitle className="text-xl">Visual Editor</CardTitle>
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
