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
  useReactFlow,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";
import { FlowData, Node } from "../types";
import NodePalette from "./NodePalette";
import CustomNode from "./CustomNode";
import ConnectionDialog from "./ConnectionDialog";
import NodeEditor from "./NodeEditor";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface VisualEditorProps {
  flowData: FlowData;
  onFlowDataChange: (newFlowData: FlowData) => void;
}

const nodeTypes = {
  custom: CustomNode,
};

function VisualEditorContent({
  flowData,
  onFlowDataChange,
}: VisualEditorProps) {
  const reactFlowInstance = useReactFlow();
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [editingNode, setEditingNode] = useState<Node | null>(null);
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

    // Position nodes
    const levelCounters: Record<number, number> = {};
    const nodeWidth = 250;
    const levelHeight = 200;

    nodeIds.forEach((nodeId) => {
      const node = flowData.nodes[nodeId];
      const level = nodeLevel[nodeId] ?? 0;
      const levelCount = levelWidth[level] || 1;
      const position = levelCounters[level] || 0;
      levelCounters[level] = position + 1;

      // Calculate x position to center nodes in each level
      const x = (position - (levelCount - 1) / 2) * (nodeWidth + 100);
      const y = level * levelHeight;

      flowNodes.push({
        id: nodeId,
        type: "custom",
        position: { x, y },
        data: {
          node,
          isSelected: selectedNodeId === nodeId,
          onEdit: handleEditNode,
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
  }, [flowData, selectedNodeId]);

  const [reactFlowNodes, setNodes, onNodesChange] = useNodesState(nodes);
  const [reactFlowEdges, setEdges, onEdgesChange] = useEdgesState(edges);

  // Update nodes when data changes
  useMemo(() => {
    setNodes(nodes);
    setEdges(edges);
  }, [nodes, edges, setNodes, setEdges]);

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
    [flowData.nodes]
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
    [reactFlowInstance, flowData, onFlowDataChange]
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

  return (
    <div className="flex gap-6 h-[800px]">
      {/* Left Sidebar - Node Palette */}
      <div className="flex-shrink-0">
        <NodePalette />
      </div>

      {/* Main Canvas */}
      <div className="flex-1 relative">
        <div
          className="w-full h-full border border-gray-300 rounded-lg overflow-hidden"
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
            nodeTypes={nodeTypes}
            connectionMode={ConnectionMode.Loose}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            nodesDraggable={true}
            nodesConnectable={true}
            elementsSelectable={true}
            attributionPosition="bottom-left"
          >
            <Controls />
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          </ReactFlow>
        </div>
      </div>

      {/* Right Sidebar - Node Editor */}
      <div className="w-80 flex-shrink-0">
        <Card className="h-full shadow-sm border-0 bg-white/60 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">
              {editingNode ? "Edit Node" : "Node Properties"}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 h-[calc(100%-80px)] overflow-y-auto">
            {editingNode ? (
              <NodeEditor
                node={editingNode}
                allNodes={flowData.nodes}
                onSave={handleSaveNode}
                onCancel={handleCancelEdit}
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Select a node to edit
                </h3>
                <p className="text-muted-foreground text-sm">
                  Click on any node or drag from the palette to start editing
                </p>
              </div>
            )}
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
