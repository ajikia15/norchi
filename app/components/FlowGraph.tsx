"use client";

import { useCallback, useMemo } from "react";
import {
  ReactFlow,
  Node as FlowNode,
  Edge,
  addEdge,
  ConnectionMode,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  MarkerType,
  Connection,
  ReactFlowProvider,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import { FlowData } from "../types";

interface FlowGraphProps {
  flowData: FlowData;
  selectedNodeId?: string | null;
  hoveredNodeId?: string | null;
  onNodeClick?: (nodeId: string) => void;
  onPaneClick?: () => void;
  onNodeDrop?: (nodeType: string, position: { x: number; y: number }) => void;
}

const nodeWidth = 200;
const nodeHeight = 80;
const levelHeight = 150;

function FlowGraphContent(props: FlowGraphProps) {
  const {
    flowData,
    selectedNodeId,
    hoveredNodeId,
    onNodeClick,
    onPaneClick,
    onNodeDrop,
  } = props;

  const reactFlowInstance = useReactFlow();

  // Convert our flow data to React Flow format
  const { nodes, edges } = useMemo(() => {
    const flowNodes: FlowNode[] = [];
    const flowEdges: Edge[] = [];
    const nodeIds = Object.keys(flowData.nodes);

    // Simple layout: arrange nodes in levels based on distance from start
    const visited = new Set<string>();
    const nodeLevel: Record<string, number> = {};
    const levelWidth: Record<number, number> = {};

    if (flowData.startNodeId && flowData.nodes[flowData.startNodeId]) {
      const queue = [{ id: flowData.startNodeId, level: 0 }];
      visited.add(flowData.startNodeId);
      nodeLevel[flowData.startNodeId] = 0;

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
        } else if (
          node.type === "infocard" &&
          node.nextNodeId &&
          !visited.has(node.nextNodeId) &&
          flowData.nodes[node.nextNodeId]
        ) {
          visited.add(node.nextNodeId);
          nodeLevel[node.nextNodeId] = level + 1;
          queue.push({ id: node.nextNodeId, level: level + 1 });
        } else if (
          node.type === "callout" &&
          node.returnToNodeId &&
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

    nodeIds.forEach((nodeId) => {
      const node = flowData.nodes[nodeId];
      const level = nodeLevel[nodeId] ?? 0;
      const levelCount = levelWidth[level] || 1;
      const position = levelCounters[level] || 0;
      levelCounters[level] = position + 1;

      // Calculate x position to center nodes in each level
      const x = (position - (levelCount - 1) / 2) * (nodeWidth + 100);
      const y = level * levelHeight;

      const isStart = nodeId === flowData.startNodeId;
      const isSelected = nodeId === selectedNodeId;
      const isHovered = nodeId === hoveredNodeId;

      const getNodeColor = () => {
        if (isStart) return "#22c55e"; // Green for start
        switch (node.type) {
          case "question":
            return "#3b82f6"; // Blue
          case "end":
            return "#e879f9"; // Purple
          case "callout":
            return "#ef4444"; // Red
          case "infocard":
            return "#10b981"; // Emerald
          default:
            return "#6b7280"; // Gray
        }
      };

      const getNodeIcon = () => {
        switch (node.type) {
          case "question":
            return "❓";
          case "end":
            return "🏁";
          case "callout":
            return "⚠️";
          case "infocard":
            return "💡";
          default:
            return "📄";
        }
      };

      flowNodes.push({
        id: nodeId,
        type: "default",
        position: { x, y },
        data: {
          label: (
            <div className="text-center text-white">
              <div className="font-bold text-sm mb-1">
                {getNodeIcon()} {nodeId}
                {isStart && <span className="ml-2">დაწყება</span>}
              </div>
              <div className="text-xs line-clamp-2">
                {node.text.length > 40
                  ? `${node.text.substring(0, 40)}...`
                  : node.text}
              </div>
            </div>
          ),
        },
        style: {
          background: getNodeColor(),
          color: "white",
          border: isSelected
            ? "3px solid #fbbf24"
            : isHovered
            ? "3px solid #9ca3af"
            : "1px solid #1e293b",
          borderRadius: "8px",
          width: nodeWidth,
          height: nodeHeight,
          fontSize: "12px",
          transition: "all 0.2s ease-in-out",
          boxShadow: isSelected
            ? "0 0 20px rgba(251, 191, 36, 0.7)"
            : isHovered
            ? "0 0 15px rgba(156, 163, 175, 0.7)"
            : "none",
        },
      });

      // Create edges based on node type
      if (node.type === "question") {
        node.options.forEach((option, optionIndex) => {
          if (option.nextNodeId && flowData.nodes[option.nextNodeId]) {
            const isLoop = option.nextNodeId === nodeId;

            flowEdges.push({
              id: `${nodeId}-${option.nextNodeId}-${optionIndex}`,
              source: nodeId,
              target: option.nextNodeId,
              label:
                option.label.length > 15
                  ? `${option.label.substring(0, 15)}...`
                  : option.label,
              type: isLoop ? "straight" : "smoothstep",
              style: {
                stroke: isLoop ? "#ef4444" : "#6b7280",
                strokeWidth: 2,
              },
              labelStyle: {
                fontSize: "10px",
                fill: "#374151",
                background: "rgba(255, 255, 255, 0.8)",
                padding: "2px 4px",
                borderRadius: "4px",
              },
              markerEnd: {
                type: MarkerType.ArrowClosed,
                color: isLoop ? "#ef4444" : "#6b7280",
              },
            });
          }
        });
      } else if (node.type === "callout") {
        // Callout nodes loop back to their return node
        if (node.returnToNodeId && flowData.nodes[node.returnToNodeId]) {
          flowEdges.push({
            id: `${nodeId}-${node.returnToNodeId}`,
            source: nodeId,
            target: node.returnToNodeId,
            label: node.buttonLabel || "სცადეთ თავიდან",
            type: "straight",
            style: {
              stroke: "#ef4444",
              strokeWidth: 2,
              strokeDasharray: "5,5",
            },
            labelStyle: {
              fontSize: "10px",
              fill: "#ef4444",
              background: "rgba(255, 255, 255, 0.9)",
              padding: "2px 4px",
              borderRadius: "4px",
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: "#ef4444",
            },
          });
        }
      } else if (node.type === "infocard") {
        // Infocard nodes continue to their next node
        if (node.nextNodeId && flowData.nodes[node.nextNodeId]) {
          flowEdges.push({
            id: `${nodeId}-${node.nextNodeId}`,
            source: nodeId,
            target: node.nextNodeId,
            label: node.buttonLabel || "გაგრძელება",
            type: "smoothstep",
            style: {
              stroke: "#10b981",
              strokeWidth: 2,
            },
            labelStyle: {
              fontSize: "10px",
              fill: "#10b981",
              background: "rgba(255, 255, 255, 0.9)",
              padding: "2px 4px",
              borderRadius: "4px",
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
  }, [flowData, selectedNodeId, hoveredNodeId]);

  const [reactFlowNodes, setNodes, onNodesChange] = useNodesState(nodes);
  const [reactFlowEdges, setEdges, onEdgesChange] = useEdgesState(edges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: FlowNode) => {
      onNodeClick?.(node.id);
    },
    [onNodeClick]
  );

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("application/reactflow");
      if (!type || !onNodeDrop || !reactFlowInstance) {
        return;
      }
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      onNodeDrop(type, position);
    },
    [reactFlowInstance, onNodeDrop]
  );

  // Update nodes and edges when flowData changes
  useMemo(() => {
    setNodes(nodes);
    setEdges(edges);
  }, [nodes, edges, setNodes, setEdges]);

  const isInteractive = !!onNodeClick;

  return (
    <div
      className="w-full h-full"
      onDrop={isInteractive ? handleDrop : undefined}
      onDragOver={isInteractive ? handleDragOver : undefined}
    >
      <ReactFlow
        nodes={reactFlowNodes}
        edges={reactFlowEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={isInteractive ? handleNodeClick : undefined}
        onPaneClick={onPaneClick}
        connectionMode={ConnectionMode.Loose}
        fitView
        attributionPosition="bottom-left"
      >
        <Controls />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}

export default function FlowGraph(props: FlowGraphProps) {
  return (
    <ReactFlowProvider>
      <FlowGraphContent {...props} />
    </ReactFlowProvider>
  );
}
