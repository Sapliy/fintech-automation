import { Handle, type NodeProps, Position } from "@xyflow/react";
import { SensorsDeviceNode, type ConditionNode } from "./types";
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

  // Get the value from connected sensor
  const getSensorValue = useCallback(() => {
    if (
      Array.isArray(sourceNodes) &&
      sourceNodes.length > 0 &&
      prevValueRef.current !== data.value
    ) {
      prevValueRef.current = data.value;
      // Assuming the first source node is the sensor
      const sensorNode = sourceNodes[0] as SensorsDeviceNode;
      return sensorNode?.data?.value ?? "value";
    }
    return data.value;
  }, [sourceNodes, data.value]);

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
        border: `2px solid ${selected ? conditionColor.from : "white"}`,
      }}
      className={`
        shadow-lg rounded-lg border-2
        ${isValid ? "bg-green-50" : "bg-red-50"}
        transition-all duration-300 ease-in-out
        hover:shadow-xl transform hover:-translate-y-1
        min-w-[250px]
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
      <div className="px-4 py-3">
        <div className="space-y-3">
          {/* Condition Expression */}
          <ConditionExpression
            currentValue={currentValue}
            condition={condition}
            payload={payload}
          />

          {/* Result */}
          <div
            className={`
            text-center text-sm font-medium rounded-full px-3 py-1
            transition-colors duration-300
            ${
              isValid
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }
          `}
          >
            {isValid ? "Condition Met" : "Condition Not Met"}
          </div>
        </div>
      </div>

      {/* Handles with Path Indicators */}
      <div
        className={`p-4 rounded-lg bg-white border-2 border-gray-200 transition-all duration-300 ease-in-out
                    ${
                      isValid
                        ? "bg-green-50 border-green-500"
                        : "bg-red-50  border-red-500"
                    }`}
      >
        <div className="flex justify-center gap-8 px-4 py-2 border-gray-200">
          <div
            className={`flex items-center gap-2 text-xs font-medium
                          transition-colors duration-300
                          ${isValid ? "text-green-600" : "text-gray-400"}`}
          >
            <div
              className={`w-2 h-2 rounded-full transition-colors duration-300 
                          ${isValid ? "bg-green-500" : "bg-gray-300"}`}
            />
            <span>True Path</span>
          </div>
          <div
            className={`flex items-center gap-2 text-xs font-medium
                          transition-colors duration-300
                          ${!isValid ? "text-red-600" : "text-gray-400"}`}
          >
            <div
              className={`w-2 h-2 rounded-full transition-colors duration-300
                          ${!isValid ? "bg-red-500" : "bg-gray-300"}`}
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
