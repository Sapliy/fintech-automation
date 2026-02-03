import { useCallback, useRef } from "react";

import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type Node,
  BackgroundVariant,
  Edge,
} from "@xyflow/react";

import Dialog from "./components/UI/Dialog";
import ContextMenu from "./components/ContextMenu";
import { CustomEdge } from "./components/CustomEdge";
import LeftSideDragNodes from "./components/LeftSideDragNodes";
import RightSideMoreDetails from "./components/RightSideMoreDetails";

import {
  useStoreNode,
  AppStateNode,
  AppStateDialog,
  useStoreDialog,
} from "./store";
import { useShallow } from "zustand/shallow";

import { nodeTypes } from "./nodes";
import { AppNode } from "./nodes/types";

import useWebSocket from "./hooks/useWebSocket";

import "./styles/edges.css";
import "@xyflow/react/dist/style.css";

import "./styles/global-handles.css";
import Toaster from "./components/Toaster";

const edgeTypes = {
  custom: CustomEdge,
};

const selectorDialog = (state: AppStateDialog) => ({
  dialog: state.dialog,
  setDialog: state.setDialog,
});

const selectorNode = (state: AppStateNode) => ({
  nodes: state.nodes,
  edges: state.edges,
  onMoreDetails: state.onMoreDetails,
  nodeDetails: state.nodeDetails,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  setEdges: state.setEdges,
  setNodes: state.setNodes,
  deleteNode: state.deleteNode,
  duplicateNode: state.duplicateNode,
  onNodeContextMenu: state.onNodeContextMenu,
  onDrop: state.onDrop,
  setContextMenu: state.setContextMenu,
  contextMenu: state.contextMenu,
  closeMoreDetails: state.closeMoreDetails,
});

export default function App() {
  const ref = useRef<HTMLDivElement>(null);

  const { dialog, setDialog } = useStoreDialog(useShallow(selectorDialog));

  const {
    nodes,
    edges,
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    deleteNode,
    duplicateNode,
    onDrop,
    onNodeContextMenu,
    contextMenu,
    setContextMenu,
    onMoreDetails,
    nodeDetails,
  } = useStoreNode(useShallow(selectorNode));

  const onNodeContextMenuCallback = useCallback(
    (event: React.MouseEvent, node: Node) => {
      onNodeContextMenu(event, node, ref);
    },
    [setContextMenu]
  );

  const onPaneClick = useCallback(() => setContextMenu(null), [setContextMenu]);

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/fintech-automation", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const handleWebSocketMessage = (data: {
    nodes: AppNode[];
    edges: Edge[];
  }) => {
    if (data.nodes?.length > 0 && data.edges?.length > 0) {
      setNodes(data.nodes);
      setEdges(data.edges);
    }
  };

  const WS_URL = import.meta.env.VITE_WS_URL;
  useWebSocket(WS_URL, handleWebSocketMessage);

  return (
    <div ref={ref} className="w-full h-full">
      <Toaster position="top-right" />
      {/* Left Sidebar */}
      <div className="absolute left-0 z-10 w-fit h-full">
        <LeftSideDragNodes onDragStart={onDragStart} />
      </div>

      {/* Main Canvas */}
      <ReactFlow
        ref={ref}
        nodes={nodes}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        edges={edges}
        edgeTypes={edgeTypes}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onPaneClick={onPaneClick}
        onNodeContextMenu={onNodeContextMenuCallback}
        onDrop={(e) => onDrop(e, ref)}
        onDragOver={onDragOver}
        defaultEdgeOptions={{
          type: "custom",
          animated: true,
        }}
        fitView
      >
        <Background variant={BackgroundVariant.Lines} />
        <MiniMap />
        <Controls />
      </ReactFlow>

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          onMoreDetails={onMoreDetails}
          onDelete={deleteNode}
          onDuplicate={duplicateNode}
          onClose={onPaneClick}
          {...contextMenu}
        />
      )}

      {/* Right Sidebar */}
      {nodeDetails && <RightSideMoreDetails {...nodeDetails} />}

      {/* Dialog */}
      {dialog && (
        <Dialog
          isOpen={true}
          title={dialog.title}
          message={dialog.message}
          onConfirm={() => {
            dialog.onConfirm();
            setDialog(null);
          }}
          onCancel={() => setDialog(null)}
        />
      )}
    </div>
  );
}
