import { Handle, type NodeProps, Position } from "@xyflow/react";
import { ValuesSensor, type ConditionNode } from "./types";
import { Split, AlertTriangle } from "lucide-react";
import { useState, useEffect, memo, useCallback, useRef } from "react";
import { ConditionConfig, Operator, ValueType } from "../types";
import { useStoreNode } from "../store";
import { useShallow } from "zustand/shallow";
import { ConditionEvaluator } from "../services/conditionEvaluator";
import { SelectorNode } from "../store/type";
import { nodeColors } from "../utils/edgeStyles";
import ConditionExpression from "../components/ConditionExpression";

const selectorNode: SelectorNode = (state) => ({
  getSourceNodes: state.getSourceNodes,
});

const ConditionNode = ({
  data,
  selected,
  id,
  isConnectable,
}: NodeProps<ConditionNode>) => {
  const condition = Object.keys(data.if[0])[0] as Operator;
  const payload = data.if?.[0]?.[condition]?.[1] ?? "";
  const [isValid, setIsValid] = useState(false);
  const [type, setType] = useState<ValueType>("number");
  const { getSourceNodes } = useStoreNode(useShallow(selectorNode));
  const sourceNodes = getSourceNodes?.(id) ?? [];
  const prevValueRef = useRef(data.value);

  // Get condition colors from our color system
  const conditionColor = nodeColors.condition;

  /*
  // Update condition
  const handleOperatorChange = (newOperator: string) => {
    // ConditionNode data structure is complex: data.if[0][operator]
    // We need to preserve the payload (comparison value)
    const newIf = [{ [newOperator]: [{ var: 'value' }, payload] }];
    // This is checking handling of complex rule logic which might be too hard to edit via simple dropdown without refactoring data structure
    // But ConditionExpression implies we are using it.
    // However, existing ConditionNode relies on `data.if` array for "json-logic" style?
    // Line 23: const condition = Object.keys(data.if[0])[0] as Operator;
    // If I change operator, I must update `data.if`.
    // Let's assume user wants to switch operator easiest way.
    // Using updateNodeData to update 'if'.
  };
  */

  // Simplified: we will just update the data assuming a specific structure or refactor ConditionNode to use flatter data if acceptable?
  // Previous task.md said "Keep ConditionNode - rename to ConditionNode (no change needed)".
  // But I am enhancing it.
  // Let's stick to reading 'data.if' for now but offering restricted UI?
  // Or just fix the type error first.

  // Fix type error:
  const getSensorValue = useCallback((): ValuesSensor => {
    if (
      Array.isArray(sourceNodes) &&
      sourceNodes.length > 0 &&
      prevValueRef.current !== data.value
    ) {
      prevValueRef.current = data.value;
      const upstreamNode = sourceNodes[0];
      const val = upstreamNode?.data?.value;
      if (typeof val === 'string' || typeof val === 'number') {
        return val;
      }
      return String(val ?? "value");
    }
    return data.value as ValuesSensor;
  }, [sourceNodes, data.value]);

  // ... (rest of component)
  // I will just fix the type error for now to pass compilation, adding selector is tricky if data structure is complex json-logic.
  // Refactoring ConditionNode to use simple operator/value fields like FilterNode might be better for Phase 2?
  // Current ConditionNode uses `json-logic` style `if: [{ "==": [...] }]`.
  // FilterNode uses `operator` and `filterValue` flat fields.
  // I should probably ALIGN ConditionNode to use flat fields if I want to use the simple selector.
  // But that changes data structure compatibility. 
  // Given I am "Polishing", I should likely sticking to fixing bugs first.



  // Update type based on sensor value
  useEffect(() => {
    const value = getSensorValue();
    const typeofValue = typeof value;
    if (typeofValue === "number") {
      setType("number");
    } else if (typeofValue === "string") {
      setType("text");
    }
  }, [getSensorValue, data.value]);

  // Evaluate condition when sensor data changes
  useEffect(() => {
    const value = getSensorValue() ?? "value";

    const config: ConditionConfig = {
      operator: condition,
      value,
      target: payload,
      type,
    };

    setIsValid(ConditionEvaluator.evaluate(config));
  }, [getSensorValue, condition, payload, type]);

  // Get the current value to display
  const currentValue = getSensorValue() ?? "value";

  return (
    <div
      style={{
        border: `2px solid ${selected ? conditionColor.from : "transparent"}`,
      }}
      className={`
        shadow-lg rounded-xl border border-border/60
        ${isValid ? "bg-emerald-950/20" : "bg-card"}
        transition-all duration-300 ease-in-out
        hover:shadow-primary/20 hover:border-primary/40 transform hover:-translate-y-1
        min-w-[250px] overflow-hidden
      `}
    >
      {/* Header */}
      <div
        className="text-white px-4 py-2 rounded-t-lg 
                    flex items-center justify-between"
        style={{
          background: `linear-gradient(to right, ${conditionColor.from}, ${conditionColor.to})`,
        }}
      >
        <div className="flex items-center gap-2">
          <Split className="w-5 h-5" />
          <span className="font-semibold">Condition</span>
        </div>
        <AlertTriangle
          className={`w-4 h-4 transition-opacity
            ${isValid ? "opacity-0" : "opacity-100"}`}
        />
      </div>

      {/* Body */}
      <div className="px-4 py-4 bg-secondary/30">
        <div className="space-y-4">
          {/* Condition Expression */}
          <ConditionExpression
            currentValue={currentValue}
            condition={condition}
            payload={payload}
          />

          {/* Result */}
          <div
            className={`
            text-center text-xs font-semibold rounded-lg px-3 py-2 border
            transition-colors duration-300 uppercase tracking-wider
            ${isValid
                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                : "bg-destructive/10 text-destructive border-destructive/20"
              }
          `}
          >
            {isValid ? "Condition Met" : "Condition Not Met"}
          </div>
        </div>
      </div>

      {/* Handles with Path Indicators */}
      <div
        className={`p-4 bg-background border-t border-border/60 transition-all duration-300 ease-in-out`}
      >
        <div className="flex justify-center gap-8 px-4 py-2">
          <div
            className={`flex items-center gap-2 text-xs font-medium
                          transition-colors duration-300
                          ${isValid ? "text-emerald-500" : "text-muted-foreground"}`}
          >
            <div
              className={`w-2 h-2 rounded-full transition-colors duration-300 
                          ${isValid ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-muted"}`}
            />
            <span>True Path</span>
          </div>
          <div
            className={`flex items-center gap-2 text-xs font-medium
                          transition-colors duration-300
                          ${!isValid ? "text-destructive" : "text-muted-foreground"}`}
          >
            <div
              className={`w-2 h-2 rounded-full transition-colors duration-300
                          ${!isValid ? "bg-destructive shadow-[0_0_8px_rgba(239,68,68,0.5)]" : "bg-muted"}`}
            />
            <span>False Path</span>
          </div>
        </div>

        {/* Handle connectors styled with inline styles instead of class names */}
        <Handle
          type="target"
          className="react-flow__handle-target"
          position={Position.Top}
          style={{
            top: -4,
            backgroundColor: conditionColor.from,
          }}
          isConnectable={isConnectable}
        />

        <Handle
          type="source"
          className="react-flow__handle-source true-path"
          position={Position.Bottom}
          style={{
            bottom: -4,
          }}
          id="true"
          isConnectable={isConnectable}
        />

        <Handle
          type="source"
          className="react-flow__handle-source false-path"
          position={Position.Bottom}
          style={{
            bottom: -4,
            backgroundColor: "#EF4444", // Red for false path
          }}
          id="false"
          isConnectable={isConnectable}
        />
      </div>
    </div>
  );
};

export default memo(ConditionNode);
