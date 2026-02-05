import { createElement, JSX, useEffect, useRef } from "react";
import { AppNode } from "../nodes/types";
import { useStoreNode, AppStateNode } from "../store";
import { useShallow } from "zustand/shallow";
import { X, Settings2, ChevronRight } from "lucide-react";
import ConditionDetails from "./MoreDetailsNodes/ConditionDetails";
import FilterDetails from "./MoreDetailsNodes/FilterDetails";
import DebuggerDetails from "./MoreDetailsNodes/DebuggerDetails";
import DateTimeDetails from "./MoreDetailsNodes/DateTimeDetails";

type TProps = {
  id: string;
  type?: AppNode["type"] | string;
  data: Record<string, any>;
};

const selector = (state: AppStateNode) => ({
  closeMoreDetails: state.closeMoreDetails,
  updateNodeData: state.updateNodeData,
});

const detailsNodeByType: Record<
  Exclude<AppNode["type"], undefined> | string,
  JSX.ElementType
> = {
  condition: ConditionDetails,
  filter: FilterDetails,
  dateTime: DateTimeDetails,
  debugger: DebuggerDetails,
};

function RightSideMoreDetails({ id, type, data }: TProps) {
  const { closeMoreDetails, updateNodeData } = useStoreNode(
    useShallow(selector)
  );
  const ref = useRef<HTMLDivElement>(null);

  const handleUpdate = (updatedData: Partial<AppNode>) => {
    updateNodeData(id, updatedData);
  };

  const renderDetailsNode = createElement(
    detailsNodeByType[type as Exclude<AppNode["type"], undefined>],
    {
      data,
      handleUpdate,
    }
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        closeMoreDetails();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeMoreDetails]);

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out">
      <div ref={ref} className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings2 className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Node Details</h2>
            </div>
            <button
              onClick={closeMoreDetails}
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Node Info Card */}
          <div className="p-6 border-b border-gray-200">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">
                  Node ID
                </span>
                <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                  {id}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Type</span>
                <span
                  className={`
                  text-sm px-3 py-1 rounded-full
                  ${type === "sensor"
                      ? "bg-blue-100 text-blue-700"
                      : type === "condition"
                        ? "bg-purple-100 text-purple-700"
                        : type === "actuator"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-gray-100 text-gray-700"
                    }
                `}
                >
                  {" "}
                  {type || "Unknown"}
                </span>
              </div>
            </div>
          </div>

          {/* Node Settings */}
          <div className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Configuration
              </h3>
            </div>
            <div className="space-y-4">{renderDetailsNode}</div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            Changes are automatically saved
          </p>
        </div>
      </div>
    </div>
  );
}

export default RightSideMoreDetails;
