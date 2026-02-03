import { NodeProps } from "@xyflow/react";
import { ActuatorNode, AppNode } from "../../nodes/types";
import { RefObject, useRef } from "react";
import { Tag, Power, Wifi, Activity } from "lucide-react";

type TProps = {
  data: Partial<AppNode> & NodeProps<ActuatorNode>["data"];
  handleUpdate: (data: Partial<AppNode>) => void;
};

const ActuatorDetails = (props: TProps) => {
  const { handleUpdate, data } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const inputTopicRef = useRef<HTMLInputElement>(null);

  const updateData = (
    key: string,
    ref: RefObject<HTMLInputElement | null>
  ): Partial<AppNode> => {
    return Object.assign(props.data, { [key]: ref.current?.value });
  };

  const isActive = data.status?.toLowerCase() === "on" || data.status === "1";

  return (
    <div className="space-y-6">
      {/* Label Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-gray-600">
          <Tag className="w-4 h-4" />
          <label className="text-sm font-medium">Label</label>
        </div>
        <input
          ref={inputRef}
          className="w-full px-3 py-2 rounded-lg border border-gray-300
                    focus:ring-2 focus:ring-orange-500 focus:border-orange-500
                    transition-all duration-200
                    placeholder:text-gray-400"
          placeholder="Enter actuator label"
          defaultValue={data.label}
          onBlur={() => handleUpdate(updateData("label", inputRef))}
        />
      </div>

      {/* Status Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-gray-600">
          <Power className="w-4 h-4" />
          <label className="text-sm font-medium">Current Status</label>
        </div>
        <div
          className="flex items-center justify-between p-3 bg-gray-50 
                      rounded-lg border border-gray-200"
        >
          <div className="flex items-center gap-2">
            <Activity
              className={`w-4 h-4 ${
                isActive ? "text-green-500" : "text-gray-400"
              }`}
            />
            <span className="text-sm text-gray-600">Status:</span>
          </div>
          <span
            className={`
            px-3 py-1 rounded-full text-sm font-medium
            ${
              isActive
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600"
            }
          `}
          >
            {data.status || "Idle"}
          </span>
        </div>
      </div>

      {/* Topic Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-gray-600">
          <Wifi className="w-4 h-4" />
          <label className="text-sm font-medium">MQTT Topic</label>
        </div>
        <input
          ref={inputTopicRef}
          className="w-full px-3 py-2 rounded-lg border border-gray-300
                    focus:ring-2 focus:ring-orange-500 focus:border-orange-500
                    transition-all duration-200 font-mono text-sm
                    placeholder:text-gray-400"
          placeholder="Enter MQTT topic"
          defaultValue={data.topic}
          onBlur={() => handleUpdate(updateData("topic", inputTopicRef))}
        />
        <p className="text-xs text-gray-500 ml-1">
          Topic used to publish control commands
        </p>
      </div>

      {/* Control Buttons */}
      <div className="grid grid-cols-2 gap-3 pt-2"></div>

      {/* Help Text */}
      <div className="pt-2 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Changes are automatically saved when you click outside the input
          fields
        </p>
      </div>
    </div>
  );
};

export default ActuatorDetails;
