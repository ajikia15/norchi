"use client";

import { useCallback, useMemo, useState, DragEvent } from "react";
import {
  ReactFlow,
  Node as FlowNode,
  Edge,
  ConnectionMode,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  MarkerType,
  Connection,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";
import { FlowData, Node } from "../types";
import NodePalette from "./NodePalette";
import CustomNode from "./CustomNode";
import ConnectionDialog from "./ConnectionDialog";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import NodeEditor from "./NodeEditor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface VisualEditorProps {
  flowData: FlowData;
  onFlowDataChange: (newFlowData: FlowData) => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

const nodeTypes = {
  custom: CustomNode,
};

function VisualEditorContent({
  flowData,
  onFlowDataChange,
  isFullscreen = false,
  onToggleFullscreen,
}: VisualEditorProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [editingNode, setEditingNode] = useState<Node | null>(null);
  const [nodePositions, setNodePositions] = useState<
    Record<string, { x: number; y: number }>
  >({});
  const [hasInitialLayout, setHasInitialLayout] = useState(false);
  const [connectionDialog, setConnectionDialog] = useState<{
    isOpen: boolean;
    sourceNodeId: string;
    targetNodeId: string;
    sourceHandle?: string;
  }>({
    isOpen: false,
    sourceNodeId: "",
    targetNodeId: "",
  });
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    nodeToDelete: Node | null;
  }>({
    isOpen: false,
    nodeToDelete: null,
  });

  // Define callbacks first before using them in useMemo
  const handleEditNode = useCallback((node: Node) => {
    setEditingNode(node);
    setSelectedNodeId(node.id);
  }, []);

  const handleSaveNode = useCallback(
    (updatedNode: Node) => {
      const updatedFlowData: FlowData = {
        ...flowData,
        nodes: {
          ...flowData.nodes,
          [updatedNode.id]: updatedNode,
        },
      };
      onFlowDataChange(updatedFlowData);
      setEditingNode(null);
    },
    [flowData, onFlowDataChange]
  );

  const handleCancelEdit = useCallback(() => {
    setEditingNode(null);
  }, []);

  // Handle node deletion
  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      const nodeToDelete = flowData.nodes[nodeId];
      if (!nodeToDelete) return;

      setDeleteDialog({
        isOpen: true,
        nodeToDelete,
      });
    },
    [flowData.nodes]
  );

  const confirmDeleteNode = useCallback(() => {
    if (!deleteDialog.nodeToDelete) return;

    const nodeId = deleteDialog.nodeToDelete.id;
    const newNodes = { ...flowData.nodes };
    delete newNodes[nodeId];

    const updatedFlowData: FlowData = {
      ...flowData,
      nodes: newNodes,
      // If we're deleting the start node, clear it
      startNodeId: nodeId === flowData.startNodeId ? "" : flowData.startNodeId,
    };

    // Remove from stored positions
    setNodePositions((prev) => {
      const newPositions = { ...prev };
      delete newPositions[nodeId];
      return newPositions;
    });

    onFlowDataChange(updatedFlowData);

    // Clear selection if we deleted the selected node
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(null);
      setEditingNode(null);
    }

    setDeleteDialog({ isOpen: false, nodeToDelete: null });
  }, [deleteDialog.nodeToDelete, flowData, onFlowDataChange, selectedNodeId]);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Only handle shortcuts when a node is selected and no dialog is open
      if (!selectedNodeId || connectionDialog.isOpen || deleteDialog.isOpen)
        return;

      if (event.key === "Delete" || event.key === "Backspace") {
        event.preventDefault();
        handleDeleteNode(selectedNodeId);
      }
    },
    [
      selectedNodeId,
      connectionDialog.isOpen,
      deleteDialog.isOpen,
      handleDeleteNode,
    ]
  );

  // Add keyboard event listeners
  useMemo(() => {
    const handleKeyDownEvent = (event: KeyboardEvent) => handleKeyDown(event);
    document.addEventListener("keydown", handleKeyDownEvent);
    return () => document.removeEventListener("keydown", handleKeyDownEvent);
  }, [handleKeyDown]);

  // Convert flow data to ReactFlow format
  const { nodes, edges } = useMemo(() => {
    const flowNodes: FlowNode[] = [];
    const flowEdges: Edge[] = [];
    const nodeIds = Object.keys(flowData.nodes);

    // Simple auto-layout algorithm
    const visited = new Set<string>();
    const nodeLevel: Record<string, number> = {};
    const levelWidth: Record<number, number> = {};

    // BFS to assign levels
    const queue = [{ id: flowData.startNodeId || nodeIds[0], level: 0 }];
    if (flowData.startNodeId) {
      visited.add(flowData.startNodeId);
      nodeLevel[flowData.startNodeId] = 0;
    }

    while (queue.length > 0) {
      const { id, level } = queue.shift()!;
      levelWidth[level] = (levelWidth[level] || 0) + 1;

      const node = flowData.nodes[id];
      if (node && node.type === "question") {
        for (const option of node.options) {
          if (
            option.nextNodeId &&
            !visited.has(option.nextNodeId) &&
            flowData.nodes[option.nextNodeId]
          ) {
            visited.add(option.nextNodeId);
            nodeLevel[option.nextNodeId] = level + 1;
            queue.push({ id: option.nextNodeId, level: level + 1 });
          }
        }
      } else if (node && node.type === "infocard" && node.nextNodeId) {
        if (!visited.has(node.nextNodeId) && flowData.nodes[node.nextNodeId]) {
          visited.add(node.nextNodeId);
          nodeLevel[node.nextNodeId] = level + 1;
          queue.push({ id: node.nextNodeId, level: level + 1 });
        }
      } else if (node && node.type === "callout" && node.returnToNodeId) {
        if (
          !visited.has(node.returnToNodeId) &&
          flowData.nodes[node.returnToNodeId]
        ) {
          visited.add(node.returnToNodeId);
          nodeLevel[node.returnToNodeId] = level + 1;
          queue.push({ id: node.returnToNodeId, level: level + 1 });
        }
      }
    }

    // Position nodes - use stored positions or auto-layout for new nodes
    const levelCounters: Record<number, number> = {};
    const nodeWidth = 250;
    const levelHeight = 200;

    nodeIds.forEach((nodeId) => {
      const node = flowData.nodes[nodeId];
      let nodePosition: { x: number; y: number };

      // Use stored position if available, otherwise calculate with auto-layout
      if (nodePositions[nodeId]) {
        nodePosition = nodePositions[nodeId];
      } else {
        const level = nodeLevel[nodeId] ?? 0;
        const levelCount = levelWidth[level] || 1;
        const position = levelCounters[level] || 0;
        levelCounters[level] = position + 1;

        // Calculate x position to center nodes in each level
        const x = (position - (levelCount - 1) / 2) * (nodeWidth + 100);
        const y = level * levelHeight;
        nodePosition = { x, y };

        // Store the initial position
        if (!hasInitialLayout) {
          setNodePositions((prev) => ({ ...prev, [nodeId]: nodePosition }));
        }
      }

      flowNodes.push({
        id: nodeId,
        type: "custom",
        position: nodePosition,
        data: {
          node,
          isSelected: selectedNodeId === nodeId,
          onEdit: handleEditNode,
          onClick: handleEditNode, // Click to edit
          onAddConnection: () => {}, // Placeholder for future functionality
        },
        selected: selectedNodeId === nodeId,
      });

      // Create edges based on node type
      if (node.type === "question") {
        node.options.forEach((option, optionIndex) => {
          if (option.nextNodeId && flowData.nodes[option.nextNodeId]) {
            flowEdges.push({
              id: `${nodeId}-${option.nextNodeId}-${optionIndex}`,
              source: nodeId,
              target: option.nextNodeId,
              sourceHandle: `option-${optionIndex}`,
              label: option.label,
              type: "smoothstep",
              style: {
                stroke: "#6b7280",
                strokeWidth: 2,
              },
              labelStyle: {
                fontSize: "11px",
                fill: "#374151",
                background: "rgba(255, 255, 255, 0.9)",
                padding: "2px 6px",
                borderRadius: "4px",
                border: "1px solid #e5e7eb",
              },
              markerEnd: {
                type: MarkerType.ArrowClosed,
                color: "#6b7280",
              },
            });
          }
        });
      } else if (node.type === "callout" && node.returnToNodeId) {
        if (flowData.nodes[node.returnToNodeId]) {
          flowEdges.push({
            id: `${nodeId}-${node.returnToNodeId}`,
            source: nodeId,
            target: node.returnToNodeId,
            label: node.buttonLabel || "Try Again",
            type: "straight",
            style: {
              stroke: "#ef4444",
              strokeWidth: 2,
              strokeDasharray: "5,5",
            },
            labelStyle: {
              fontSize: "11px",
              fill: "#ef4444",
              background: "rgba(255, 255, 255, 0.9)",
              padding: "2px 6px",
              borderRadius: "4px",
              border: "1px solid #fecaca",
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: "#ef4444",
            },
          });
        }
      } else if (node.type === "infocard" && node.nextNodeId) {
        if (flowData.nodes[node.nextNodeId]) {
          flowEdges.push({
            id: `${nodeId}-${node.nextNodeId}`,
            source: nodeId,
            target: node.nextNodeId,
            label: node.buttonLabel || "Continue",
            type: "smoothstep",
            style: {
              stroke: "#10b981",
              strokeWidth: 2,
            },
            labelStyle: {
              fontSize: "11px",
              fill: "#10b981",
              background: "rgba(255, 255, 255, 0.9)",
              padding: "2px 6px",
              borderRadius: "4px",
              border: "1px solid #d1fae5",
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: "#10b981",
            },
          });
        }
      }
    });

    return { nodes: flowNodes, edges: flowEdges };
  }, [
    flowData,
    selectedNodeId,
    handleEditNode,
    nodePositions,
    hasInitialLayout,
  ]);

  const [reactFlowNodes, setNodes, onNodesChange] = useNodesState(nodes);
  const [reactFlowEdges, setEdges, onEdgesChange] = useEdgesState(edges);

  // Set initial layout flag after first render
  useMemo(() => {
    if (Object.keys(flowData.nodes).length > 0 && !hasInitialLayout) {
      setHasInitialLayout(true);
    }
  }, [flowData.nodes, hasInitialLayout]);

  // Update nodes when data changes
  useMemo(() => {
    setNodes(nodes);
    setEdges(edges);
  }, [nodes, edges, setNodes, setEdges]);

  // Handle node drag end to store positions
  const onNodeDragStop = useCallback(
    (_event: React.MouseEvent, node: FlowNode) => {
      setNodePositions((prev) => ({
        ...prev,
        [node.id]: node.position,
      }));
    },
    []
  );

  const handleDirectConnection = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) return;

      const sourceNode = flowData.nodes[connection.source];
      const updatedFlowData = { ...flowData };

      if (sourceNode.type === "infocard") {
        updatedFlowData.nodes[connection.source] = {
          ...sourceNode,
          nextNodeId: connection.target,
        } as Node;
      } else if (sourceNode.type === "callout") {
        updatedFlowData.nodes[connection.source] = {
          ...sourceNode,
          returnToNodeId: connection.target,
        } as Node;
      }

      onFlowDataChange(updatedFlowData);
    },
    [flowData, onFlowDataChange]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) return;

      const sourceNode = flowData.nodes[connection.source];
      if (sourceNode && sourceNode.type === "question") {
        // Show dialog to set option label
        setConnectionDialog({
          isOpen: true,
          sourceNodeId: connection.source,
          targetNodeId: connection.target,
          sourceHandle: connection.sourceHandle || "",
        });
      } else {
        // Direct connection for other node types
        handleDirectConnection(connection);
      }
    },
    [flowData.nodes, handleDirectConnection]
  );

  const handleConnectionConfirm = useCallback(
    (optionLabel: string) => {
      const { sourceNodeId, targetNodeId, sourceHandle } = connectionDialog;
      const sourceNode = flowData.nodes[sourceNodeId];

      if (sourceNode && sourceNode.type === "question") {
        const optionIndex = sourceHandle
          ? parseInt(sourceHandle.split("-")[1])
          : -1;

        if (optionIndex >= 0 && optionIndex < sourceNode.options.length) {
          // Update existing option
          const newOptions = [...sourceNode.options];
          newOptions[optionIndex] = {
            ...newOptions[optionIndex],
            nextNodeId: targetNodeId,
            label: optionLabel,
          };

          const updatedFlowData: FlowData = {
            ...flowData,
            nodes: {
              ...flowData.nodes,
              [sourceNodeId]: {
                ...sourceNode,
                options: newOptions,
              },
            },
          };

          onFlowDataChange(updatedFlowData);
        } else {
          // Add new option
          const newOptions = [
            ...sourceNode.options,
            { label: optionLabel, nextNodeId: targetNodeId },
          ];

          const updatedFlowData: FlowData = {
            ...flowData,
            nodes: {
              ...flowData.nodes,
              [sourceNodeId]: {
                ...sourceNode,
                options: newOptions,
              },
            },
          };

          onFlowDataChange(updatedFlowData);
        }
      }

      setConnectionDialog({
        isOpen: false,
        sourceNodeId: "",
        targetNodeId: "",
      });
    },
    [connectionDialog, flowData, onFlowDataChange]
  );

  const handleDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();

      const nodeType = event.dataTransfer.getData("application/reactflow");
      if (!nodeType) return;

      const nodeId = `node_${Date.now()}`;
      let newNode: Node;

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

      const updatedFlowData: FlowData = {
        ...flowData,
        nodes: {
          ...flowData.nodes,
          [nodeId]: newNode,
        },
        startNodeId: flowData.startNodeId || nodeId,
      };

      onFlowDataChange(updatedFlowData);

      // Auto-edit the new node
      setEditingNode(newNode);
      setSelectedNodeId(nodeId);
    },
    [flowData, onFlowDataChange]
  );

  const handleDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const handleSelectionChange = useCallback(
    ({ nodes: selectedNodes }: { nodes: FlowNode[] }) => {
      if (selectedNodes.length === 1) {
        const nodeId = selectedNodes[0].id;
        setSelectedNodeId(nodeId);
      } else {
        setSelectedNodeId(null);
      }
    },
    []
  );

  // If there are no nodes, show an empty state
  if (Object.keys(flowData.nodes).length === 0) {
    return (
      <div className="w-full h-full flex-grow flex items-center justify-center relative bg-gray-50">
        <NodePalette />
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-800">ცარიელი ტილო</h3>
          <p className="text-gray-500 mt-2">
            გადმოათრიეთ კვანძი მარცხენა პალიტრიდან დასაწყებად.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4 h-full min-h-[600px]">
      {/* Left Sidebar - Node Palette */}
      <div className="flex-shrink-0 w-64 flex flex-col">
        <div className="flex-1">
          <NodePalette />
        </div>
        {/* Fullscreen Button */}
        {onToggleFullscreen && (
          <div className="mt-4 px-2">
            <Button
              onClick={onToggleFullscreen}
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2 text-sm shadow-sm"
              title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              <div className="w-4 h-4 flex items-center justify-center">
                {isFullscreen ? (
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 9V4.5M9 9H4.5M9 9L3.5 3.5M15 9h4.5M15 9V4.5M15 9l5.5-5.5M9 15v4.5M9 15H4.5M9 15l-5.5 5.5M15 15h4.5M15 15v4.5m0-4.5l5.5 5.5"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 7V4a1 1 0 011-1h3m0 0V1m0 2h2M7 21H4a1 1 0 01-1-1v-3m0 0H1m2 0v-2M21 7V4a1 1 0 00-1-1h-3m0 0V1m0 2h-2M17 21h3a1 1 0 001-1v-3m0 0h2m-2 0v-2"
                    />
                  </svg>
                )}
              </div>
              <span>{isFullscreen ? "დააპატარავე" : "გაადიდე"}</span>
            </Button>
          </div>
        )}
      </div>

      {/* Main Canvas */}
      <div className="flex-1 relative min-w-0">
        <div
          className="w-full h-full border border-gray-300 rounded-lg overflow-hidden bg-gray-50"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <ReactFlow
            nodes={reactFlowNodes}
            edges={reactFlowEdges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onSelectionChange={handleSelectionChange}
            onNodeDragStop={onNodeDragStop}
            nodeTypes={nodeTypes}
            connectionMode={ConnectionMode.Loose}
            fitView
            fitViewOptions={{ padding: 0.1 }}
            nodesDraggable={true}
            nodesConnectable={true}
            elementsSelectable={true}
            attributionPosition="bottom-left"
            minZoom={0.1}
            maxZoom={2}
          >
            <Controls />
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          </ReactFlow>
        </div>
      </div>

      {/* Right Sidebar - Node Editor */}
      <div className="w-96 flex-shrink-0">
        <Card className="min-w-[400px] max-w-[400px] h-full shadow-lg border-l-2 bg-white/60 backdrop-blur-sm flex flex-col">
          <CardHeader className="pb-4 flex-shrink-0">
            <CardTitle className="text-lg">
              {editingNode ? "Edit Node" : "Node Properties"}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 flex-1 overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto pr-2">
              {editingNode ? (
                <NodeEditor
                  key={editingNode.id}
                  node={editingNode}
                  allNodes={flowData.nodes}
                  onSave={handleSaveNode}
                  onCancel={handleCancelEdit}
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-center h-full p-6">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <div className="w-8 h-8 rounded-sm border-2 border-dashed border-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    აირჩიეთ კვანძი
                  </h3>
                  <p className="text-muted-foreground max-w-sm">
                    დააკლიკეთ კვანძს ვიზუალურ რედაქტორში, რომ ნახოთ მისი
                    დეტალები და შეიტანოთ ცვლილებები.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Connection Dialog */}
      <ConnectionDialog
        isOpen={connectionDialog.isOpen}
        onClose={() =>
          setConnectionDialog({
            isOpen: false,
            sourceNodeId: "",
            targetNodeId: "",
          })
        }
        onConfirm={handleConnectionConfirm}
        sourceNodeId={connectionDialog.sourceNodeId}
        targetNodeId={connectionDialog.targetNodeId}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, nodeToDelete: null })}
        onConfirm={confirmDeleteNode}
        nodeToDelete={deleteDialog.nodeToDelete}
      />
    </div>
  );
}

export default function VisualEditor(props: VisualEditorProps) {
  return (
    <ReactFlowProvider>
      <VisualEditorContent {...props} />
    </ReactFlowProvider>
  );
}
