import {
  type Edge,
  type Node,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
} from "@xyflow/react";
import { TContextMenu } from "../types";

type AppNode = Node;

export type AppStateNode = {
  contextMenu: TContextMenu | null;
  setContextMenu: (menu: TContextMenu | null) => void;
  nodeDetails: AppNode | null;
  onMoreDetails: (nodeId: string) => void;
  nodes: AppNode[];
  edges: Edge[];
  onNodesChange: OnNodesChange<AppNode>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: (nodes: AppNode[]) => void;
  setEdges: (edges: Edge[]) => void;
  onNodeContextMenu: (
    event: React.MouseEvent,
    node: Node,
    ref: React.RefObject<HTMLDivElement | null>
  ) => void;
  deleteNode: (nodeId: string) => void;
  duplicateNode: (nodeId: string) => void;
  onDrop: (
    event: React.DragEvent<HTMLDivElement>,
    ref: React.RefObject<HTMLDivElement | null>
  ) => void;
  clearAutomation: () => void;
  closeMoreDetails: () => void;
  updateNodeData: <T>(id: string, data: Partial<T>) => void;
  removeEdge: (edgeId: string) => void;
  getSourceNodes: (nodeId: string) => (AppNode | undefined)[];
  getTargetNodes: (nodeId: string) => (AppNode | undefined)[];
};

export type DialogConfig = {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  type: "info" | "success" | "danger";
  confirmText?: string;
  cancelText?: string | null;
};

export interface AppStateDialog {
  dialog: DialogConfig | null;
  setDialog: (dialog: DialogConfig | null) => void;
  clearAutomation: () => void;
  saveAutomation: () => void;
}

export interface Toaster {
  id: string;
  title: string;
  description: string;
  status: "success" | "error" | "info" | "warning";
  position: "top-right" | "top-left" | "bottom-right" | "bottom-left";
}

export interface ToasterStore {
  toasters: Toaster[];
  addToast: (notification: Omit<Toaster, "id">) => void;
  removeToast: (id: string) => void;
}

export type SelectorNode = (state: AppStateNode) => Partial<AppStateNode>;
export type SelectorDialog = (state: AppStateDialog) => Partial<AppStateDialog>;
export type SelectorToaster = (state: ToasterStore) => Partial<ToasterStore>;
