import { Handle, type NodeProps, Position } from "@xyflow/react";
import { type FilterNode } from "./types";
import { memo, useEffect, useState } from "react";
import {
  Filter,
  ChevronDown,
  ChevronUp,
  Bell,
  BellOff,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { SelectorNode } from "../store/type";
import { useStoreNode } from "../store";
import { useShallow } from "zustand/shallow";
import { nodeColors } from "../utils/edgeStyles";
import { ConditionEvaluator } from "../services/conditionEvaluator";
import ConditionExpression from "../components/ConditionExpression";

const selectorNode: SelectorNode = (state) => ({
  getTargetNodes: state.getTargetNodes,
  updateNodeData: state.updateNodeData,
  getSourceNodes: state.getSourceNodes,
});

const FilterNode = ({
  id,
  data,
  selected,
  isConnectable,
}: NodeProps<FilterNode>) => {
  const [inputValue, setInputValue] = useState<any>(null);
  const [outputValue, setOutputValue] = useState<any>(null);
  const [isActive, setIsActive] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isAlertEnabled, setIsAlertEnabled] = useState(data.isAlertEnabled);
  const [filterHistory, setFilterHistory] = useState<
    Array<{ value: any; passed: boolean; timestamp: string }>
  >([]);

  const { getTargetNodes, updateNodeData, getSourceNodes } = useStoreNode(
    useShallow(selectorNode)
  );

  // Get filter colors from our color system
  const filterColor = nodeColors.filter;

  // When receiving data from a source node
  useEffect(() => {
    let idTimeout: NodeJS.Timeout;
    const sourceNodes = getSourceNodes?.(id) ?? [];

    if (sourceNodes.length > 0) {
      sourceNodes.forEach((sourceNode) => {
        if (
          sourceNode &&
          sourceNode.data &&
          sourceNode.data.value !== inputValue &&
          sourceNode.data.value !== undefined
        ) {
          setInputValue(sourceNode.data.value);
          setIsActive(true);
          idTimeout = setTimeout(() => setIsActive(false), 1000);
        }
      });

      return () => {
        clearTimeout(idTimeout);
      };
    }
  }, [id, getSourceNodes, inputValue, data.value]);

  // Apply filter and propagate data
  useEffect(() => {
    if (inputValue !== null) {
      let isSubmitting = true;

      const scheduleStateUpdate = setTimeout(() => {
        if (isSubmitting) setIsFiltering(true);
      }, 0);

      const config = {
        value: inputValue,
        operator: data.operator,
        target: data.filterValue,
        type: data.valueType,
      };

      const passesFilter = ConditionEvaluator.evaluate(config);

      try {
        // Update filter history asynchronously to prevent cascading renders
        setTimeout(() => {
          if (isSubmitting) {
            setFilterHistory((prev) =>
              [
                {
                  value: inputValue,
                  passed: passesFilter,
                  timestamp: new Date().toLocaleTimeString(),
                },
                ...prev,
              ].slice(0, 5)
            ); // Keep last 5 entries
          }
        }, 0);

        if (passesFilter) {
          setOutputValue(inputValue);
          const targetNodes = getTargetNodes?.(id) ?? [];
          if (targetNodes.length > 0) {
            targetNodes.forEach((targetNode) => {
              if (targetNode) {
                updateNodeData?.(targetNode.id, {
                  value: inputValue,
                });
              }
            });
          }
        } else if (isAlertEnabled) {
          // Trigger alert for failed filter
          console.log("Filter alert: Value did not pass filter condition");
        }
      } catch (error) {
        console.error("Error in filter operation:", error);
      }

      const stopFilteringTimeout = setTimeout(() => {
        if (isSubmitting) setIsFiltering(false);
      }, 500);

      return () => {
        isSubmitting = false;
        clearTimeout(scheduleStateUpdate);
        clearTimeout(stopFilteringTimeout);
      };
    }
  }, [
    inputValue,
    id,
    data.operator,
    data.filterValue,
    data.valueType,
    getTargetNodes,
    updateNodeData,
    isAlertEnabled,
  ]);

  const handleAlertToggle = () => {
    const newAlertState = !isAlertEnabled;
    setIsAlertEnabled(newAlertState);
    updateNodeData?.(id, { isAlertEnabled: newAlertState });
  };

  return (
    <div
      style={{ border: `2px solid ${selected ? filterColor.from : "transparent"}` }}
      className={`
        shadow-lg rounded-xl bg-card border border-border/60 
        transition-all duration-200 ease-in-out
        hover:shadow-primary/20 hover:border-primary/40 transform hover:-translate-y-1
        min-w-[150px] overflow-hidden
      `}
    >
      {/* Header */}
      <div
        className="text-white px-4 py-2 rounded-t-lg 
                    flex items-center justify-between"
        style={{
          background: `linear-gradient(to right, ${filterColor.from}, ${filterColor.to})`,
        }}
      >
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5" />
          <span className="font-semibold truncate">
            {data.label || "Filter"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAlertToggle}
            className={`p-1 rounded-full transition-colors ${isAlertEnabled ? "bg-white/20" : "hover:bg-white/20"
              }`}
            title={isAlertEnabled ? "Disable Alerts" : "Enable Alerts"}
          >
            {isAlertEnabled ? (
              <Bell className="w-4 h-4" />
            ) : (
              <BellOff className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="p-1 rounded-full hover:bg-white/20 transition-colors"
            title="Advanced Settings"
          >
            {showAdvanced ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 py-4 bg-secondary/30">
        <div className="space-y-3">
          <div className="flex gap-2 mb-2">
            <select
              className="w-full p-2 bg-background border border-border rounded-md text-sm font-mono text-foreground focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
              value={data.operator || '=='}
              onChange={(e) => updateNodeData?.(id, { operator: e.target.value })}
            >
              <option value=">">&gt; (Greater than)</option>
              <option value="<">&lt; (Less than)</option>
              <option value=">=">&gt;= (Greater or eq)</option>
              <option value="<=">&lt;= (Less or eq)</option>
              <option value="==">== (Equal)</option>
              <option value="!=">!= (Not equal)</option>
              <option value="contains">contains</option>
              <option value="not_contains">not contains</option>
              <option value="starts_with">starts with</option>
              <option value="ends_with">ends with</option>
              <option value="regex">regex match</option>
            </select>
          </div>

          <ConditionExpression
            currentValue={inputValue}
            condition={data.operator}
            payload={data.filterValue}
          />

          <div className="grid grid-cols-2 gap-4 mt-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                  Input:
                </span>
                <div
                  className={`
                  px-2 py-0.5 rounded-full text-xs font-medium border
                  ${inputValue !== null
                      ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                      : "bg-muted text-muted-foreground border-border"
                    }
                  ${isActive ? "animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.5)]" : ""}
                `}
                >
                  {inputValue !== null ? inputValue : "Waiting..."}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                  Output:
                </span>
                <div
                  className={`
                  px-2 py-0.5 rounded-full text-xs font-medium border
                  ${outputValue !== null
                      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                      : "bg-muted text-muted-foreground border-border"
                    }
                  ${isFiltering ? "animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" : ""}
                `}
                >
                  {outputValue !== null ? outputValue : "No data passed"}
                </div>
              </div>
            </div>
          </div>

          {/* Advanced Settings */}
          {showAdvanced && (
            <div className="mt-4 pt-4 border-t border-border/60">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <span
                    className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold tracking-wide border ${outputValue !== null
                      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                      : "bg-muted text-muted-foreground border-border"
                      }`}
                  >
                    {outputValue !== null ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Alerts:</span>
                  <span
                    className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold tracking-wide border ${isAlertEnabled
                      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                      : "bg-muted text-muted-foreground border-border"
                      }`}
                  >
                    {isAlertEnabled ? "Enabled" : "Disabled"}
                  </span>
                </div>

                {/* Filter History */}
                <div className="mt-2">
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Recent Activity:
                  </div>
                  <div className="space-y-2">
                    {filterHistory.map((entry, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between text-sm p-2 bg-background border border-border/60 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          {entry.passed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <XCircle className="w-4 h-4 text-destructive" />
                          )}
                          <span className="text-foreground font-mono text-xs">{entry.value}</span>
                        </div>
                        <span className="text-muted-foreground/60 text-[10px] uppercase">
                          {entry.timestamp}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Top}
        id="target"
        style={{
          top: -4,
          backgroundColor: filterColor.from,
        }}
        className="react-flow__handle-target"
        isConnectable={isConnectable}
      />

      <Handle
        type="source"
        position={Position.Bottom}
        id="source"
        style={{
          bottom: -4,
          backgroundColor: filterColor.from,
        }}
        className="react-flow__handle-source"
        isConnectable={isConnectable}
      />
    </div>
  );
};

export default memo(FilterNode);
