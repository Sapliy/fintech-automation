import { Handle, type NodeProps, Position } from "@xyflow/react";
import { type AIAnalysisNode } from "./types";
import { memo, useEffect, useState } from "react";
import { SelectorNode } from "../store/type";
import { useStoreNode } from "../store";
import { useShallow } from "zustand/shallow";
import { Sparkles, Brain, Loader2 } from "lucide-react";
import { nodeColors } from "../utils/edgeStyles";

// Selector for accessing node store
const selectorNode: SelectorNode = (state) => ({
  getTargetNodes: state.getTargetNodes,
  updateNodeData: state.updateNodeData,
});

const AIAnalysisNode = ({
  id,
  data,
  selected,
  isConnectable,
}: NodeProps<AIAnalysisNode>) => {
  const [instruction, setInstruction] = useState(data.instruction || "");
  const [result, setResult] = useState(data.result || "No analysis results yet");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | undefined>(data.error);
  const [inputValue, setInputValue] = useState<any>(data.value || "Waiting for input...");
  
  const { getTargetNodes, updateNodeData } = useStoreNode(
    useShallow(selectorNode)
  );

  // Effect to receive data from the connected source node
  useEffect(() => {
    if (data.sourceNode?.value !== undefined) {
      setInputValue(data.sourceNode.value);
    }
  }, [data.sourceNode]);

  // Update data in store when our node data changes
  useEffect(() => {
    updateNodeData?.(id, {
      instruction,
      result,
      isProcessing,
      error,
    });
  }, [instruction, result, isProcessing, error, id, updateNodeData]);


  // Get node colors from our color system
  // Using the same colors as debugger node for now, could be changed to unique colors
  const aiNodeColor = nodeColors.debugger;

  return (
    <div
      style={{ border: `2px solid ${selected ? aiNodeColor.from : "white"}` }}
      className={`
        shadow-lg rounded-lg bg-white border-2 
        transition-all duration-200 ease-in-out
        hover:shadow-xl transform hover:-translate-y-1
        min-w-[280px]
      `}
    >
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Top}
        id="target"
        style={{
          top: -4,
          backgroundColor: aiNodeColor.from,
        }}
        className="react-flow__handle-target"
        isConnectable={isConnectable}
      />
      
      {/* Header */}
      <div
        className="text-white px-4 py-2 rounded-t-lg 
                    flex items-center justify-between"
        style={{
          background: `linear-gradient(to right, ${aiNodeColor.from}, ${aiNodeColor.to})`,
        }}
      >
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          <span className="font-semibold truncate">
            {data.label || "AI Analysis"}
          </span>
        </div>
        <Sparkles className="w-4 h-4" />
      </div>

      {/* Body */}
      <div className="px-4 py-3 bg-gray-50">
        <div className="space-y-3">
          {/* Input Data Display */}
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium mr-2">Input Data:</span>
            <span className="font-mono text-xs bg-gray-200 px-2 py-0.5 rounded truncate max-w-[180px]">
              {inputValue}
            </span>
          </div>

          {/* Instruction Input */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600 block">
              Analysis Instruction:
            </label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md text-sm h-20 resize-none"
              placeholder="E.g., 'Count objects in this image' or 'Analyze this temperature reading'"
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
            />
          </div>

          {/* Run Analysis Button */}
          <button
            disabled={isProcessing}
            className={`
              w-full py-2 px-3 rounded-md
              text-white font-medium text-sm
              flex items-center justify-center gap-2
              transition-colors duration-200
              ${isProcessing 
                ? "bg-indigo-400 cursor-not-allowed" 
                : "bg-indigo-600 hover:bg-indigo-700"
              }
            `}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Run Analysis
              </>
            )}
          </button>

          {/* Error Message */}
          {error && (
            <div className="text-red-500 text-xs mt-1 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          {/* Result Display */}
          <div className="mt-3">
            <div className="text-sm font-medium text-gray-600 mb-1">Analysis Result:</div>
            <div className="bg-white p-3 border border-gray-300 rounded-md text-sm min-h-[60px] overflow-auto">
              {result}
            </div>
          </div>
        </div>
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="source"
        style={{
          bottom: -4,
          backgroundColor: aiNodeColor.to,
        }}
        className="react-flow__handle-source"
        isConnectable={isConnectable}
      />
    </div>
  );
};

export default memo(AIAnalysisNode); 