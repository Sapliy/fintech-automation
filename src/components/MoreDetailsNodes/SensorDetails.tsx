import { NodeProps } from "@xyflow/react";
import { RefObject, useRef } from "react";
import { Tag, Gauge, Wifi } from "lucide-react";
import { AppNode, SensorsDeviceNode } from "../../nodes/types";

type TProps = {
  data: Partial<AppNode> & NodeProps<SensorsDeviceNode>["data"];
  handleUpdate: (data: Partial<AppNode>) => void;
};

const SensorDetails = (props: TProps) => {
  const { handleUpdate, data } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const inputTopicRef = useRef<HTMLInputElement>(null);

  const updateData = (
    key: string,
    ref: RefObject<HTMLInputElement | null>
  ): Partial<AppNode> => {
    return Object.assign(props.data, { [key]: ref.current?.value });
  };

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
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    transition-all duration-200
                    placeholder:text-gray-400"
          placeholder="Enter sensor label"
          defaultValue={data.label}
          onBlur={() => handleUpdate(updateData("label", inputRef))}
        />
      </div>

      {/* Value Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-gray-600">
          <Gauge className="w-4 h-4" />
          <label className="text-sm font-medium">Current Value</label>
        </div>
        <div
          className="flex items-center gap-2 px-3 py-2 bg-gray-50 
                      rounded-lg border border-gray-200"
        >
          <span
            className={`
            px-3 py-1 rounded-full text-sm font-medium
            ${
              data.value
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-600"
            }
          `}
          >
            {data.value || "Idle"}
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
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    transition-all duration-200 font-mono text-sm
                    placeholder:text-gray-400"
          placeholder="Enter MQTT topic"
          defaultValue={data.topic}
          onBlur={() => handleUpdate(updateData("topic", inputTopicRef))}
        />
      </div>

      {/* Help Text */}
      <div className="pt-2 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Changes are automatically saved when you click outside the input
            
        </p>
      </div>
    </div>
  );
};

export default SensorDetails;