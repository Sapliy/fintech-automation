import { memo, useState } from "react";
import { useStoreNode } from "../store";
import { useShallow } from "zustand/shallow";
import { SelectorNode } from "../store/type";
import { Plus, Settings, Link2, Trash2, X, ThermometerSun, Split, Filter, Calendar, Clock, Bug } from "lucide-react";

const selectorNode: SelectorNode = (state) => ({
  setNodes: state.setNodes,
  nodes: state.nodes,
  removeEdge: state.removeEdge,
  setEdges: state.setEdges,
  edges: state.edges,
});

const nodeTypes = [
  { type: "sensor", label: "Sensor Node", icon: ThermometerSun,},
  { type: "condition", label: "Condition Node", icon: Split },
  { type: "filter", label: "Filter Node", icon: Filter },
  { type: "debugger", label: "Debugger Node", icon: Bug },
  { type: "timeout", label: "Timeout Node", icon: Clock },
  { type: "dateTime", label: "Date & Time Node", icon: Calendar },
];

const EdgeMenu = ({ edgeId, source, target }: { edgeId: string; source: string; target: string }) => {
  const { setNodes, nodes = [], removeEdge, setEdges, edges = [] } = useStoreNode(useShallow(selectorNode));
  const [showNodeMenu, setShowNodeMenu] = useState(false);

  const handleDelete = () => {
    if (removeEdge) {
      removeEdge(edgeId);
    }
  };

  const handleAddNode = (nodeType: string) => {
    const sourceNode = nodes.find(n => n.id === source);
    const targetNode = nodes.find(n => n.id === target);
    
    if (sourceNode && targetNode && setNodes && setEdges) {
      const newPosition = {
        x: (sourceNode.position.x + targetNode.position.x) / 2,
        y: (sourceNode.position.y + targetNode.position.y) / 2,
      };

      const newNodeId = `${nodeType}-${Date.now()}`;
      const newNode = {
        id: newNodeId,
        type: nodeType,
        position: newPosition,
        data: {
          label: `${nodeType.charAt(0).toUpperCase() + nodeType.slice(1)} Node`,
          ...(nodeType === "condition" && {
            if: [{ "==": [{ var: "payload" }, "idle"] }],
            operator: "=="
          }),
          ...(nodeType === "filter" && {
            operator: "==",
            filterValue: 0,
            valueType: "number"
          }),
          ...(nodeType === "debugger" && {
            logs: [],
            isActive: true
          }),
          ...(nodeType === "timeout" && {
            duration: 60,
            isActive: false
          }),
          ...(nodeType === "datetime" && {
            time: "00:00",
            date: new Date().toISOString().split('T')[0],
            isActive: true,
            repeat: false,
            days: []
          })
        }
      };

      const newEdges = [
        {
          id: `edge-${source}-${newNodeId}`,
          source: source,
          target: newNodeId,
          type: "custom",
          animated: true,
        },
        {
          id: `edge-${newNodeId}-${target}`,
          source: newNodeId,
          target: target,
          type: "custom",
          animated: true,
        },
      ];

      setNodes([...nodes, newNode]);
      setEdges([...edges.filter(edge => edge.id !== edgeId), ...newEdges]);
      setShowNodeMenu(false);
    }
  };                            

  return (
    <div className="relative">
      <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 p-1.5 transform transition-all duration-200 hover:scale-105">
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleDelete}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
            title="Delete Edge"
          >
            <Trash2 className="w-4 h-4 text-gray-600 group-hover:text-red-500" />
          </button>

          <div className="h-4 w-px bg-gray-200" />

          <button
            onClick={() => setShowNodeMenu(!showNodeMenu)}
            className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
            title="Add Node"
          >
            <Plus className="w-4 h-4 text-gray-600 group-hover:text-blue-500" />
          </button>
          
          <button
            className="p-2 hover:bg-purple-50 rounded-lg transition-colors group"
            title="Edge Settings"
          >
            <Settings className="w-4 h-4 text-gray-600 group-hover:text-purple-500" />
          </button>
          
          <button
            className="p-2 hover:bg-green-50 rounded-lg transition-colors group"
            title="Reconnect"
          >
            <Link2 className="w-4 h-4 text-gray-600 group-hover:text-green-500" />
          </button>
        </div>
      </div>

      {showNodeMenu && (
        <div className="fixed z-[9999] -left-[210px] -top-[] w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
          style={{
            transform: `translate(${window.scrollX + 10}px, ${window.scrollY + 10}px)`
          }}
        >
          <div className="p-2 border-b border-gray-200 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Add Node</span>
            <button
              onClick={() => setShowNodeMenu(false)}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          <div className="py-1">
            {nodeTypes.map((node) => (
              <button
                key={node.type}
                onClick={() => handleAddNode(node.type)}
                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <span className="text-lg">{<node.icon />}</span>
                <span>{node.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(EdgeMenu); 