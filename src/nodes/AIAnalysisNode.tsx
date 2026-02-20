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
  updateNodeData: state.updateNodeData,
});

const AIAnalysisNode = ({
  id,
  data,
  selected,
  isConnectable,
}: NodeProps<AIAnalysisNode>) => {
  const [instruction, setInstruction] = useState(data.instruction || "");
  const [result] = useState(data.result || "No analysis results yet");
  const [inputValue, setInputValue] = useState<any>(data.value || "Waiting for input...");

  const { updateNodeData } = useStoreNode(
    useShallow(selectorNode)
  );

  // Effect to receive data from the connected source node
  useEffect(() => {
    if (data.value !== undefined) {
      setTimeout(() => setInputValue(data.value), 0);
    }
  }, [data.value]);

  // Update data in store when our node data changes
  useEffect(() => {
    updateNodeData?.(id, {
      instruction,
      result,
    });
  }, [instruction, result, id, updateNodeData]);


  // Get node colors from our color system
  // Using the same colors as debugger node for now, could be changed to unique colors
  const aiNodeColor = nodeColors.debugger;

  return (
    <div
      style={{ border: `2px solid ${selected ? aiNodeColor.from : "transparent"}` }}
      className={`
        shadow-lg rounded-xl bg-card border border-border/60
        transition-all duration-300 ease-in-out
        hover:shadow-primary/20 hover:border-primary/40 transform hover:-translate-y-1
        min-w-[280px] overflow-hidden
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
      <div className="px-4 py-4 bg-secondary/30">
        <div className="space-y-4">
          {/* Input Data Display */}
          <div className="flex items-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <span className="mr-2">Input Data:</span>
            <span className="font-mono text-xs bg-background border border-border/60 px-2 py-0.5 rounded-md truncate max-w-[180px] text-foreground lowercase">
              {String(inputValue)}
            </span>
          </div>

          {/* Instruction Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
              Analysis Instruction:
            </label>
            <textarea
              className="w-full p-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none resize-none h-20"
              placeholder="E.g., 'Count objects in this image' or 'Analyze this temperature reading'"
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
            />
          </div>

          {/* Run Analysis Button */}
          <button
            disabled={data.isProcessing}
            className={`
              w-full py-2.5 px-3 rounded-lg
              font-semibold text-sm shadow-sm
              flex items-center justify-center gap-2
              transition-all duration-200
              ${data.isProcessing
                ? "bg-primary/50 text-primary-foreground/50 cursor-not-allowed"
                : "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-primary/25"
              }
            `}
          >
            {data.isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 fill-current opacity-70" />
                Run Analysis
              </>
            )}
          </button>

          {/* Error Message */}
          {data.error && (
            <div className="text-destructive text-xs mt-2 bg-destructive/10 border border-destructive/20 p-2.5 rounded-lg">
              {data.error}
            </div>
          )}

          {/* Result Display */}
          <div className="mt-4 pt-4 border-t border-border/60">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Analysis Result:</div>
            <div className="bg-background text-foreground p-3 border border-border/60 rounded-lg text-sm min-h-[60px] max-h-[120px] overflow-auto shadow-inner">
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