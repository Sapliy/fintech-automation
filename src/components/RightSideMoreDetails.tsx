import { createElement, JSX } from "react";
import { AppNode } from "../nodes/types";
import { useStoreNode, AppStateNode } from "../store";
import { useShallow } from "zustand/shallow";
import { X, Settings2, Activity, Calendar, Split, Filter, Bug } from "lucide-react";
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

const getNodeIcon = (type: string) => {
  switch (type) {
    case 'condition': return Split;
    case 'filter': return Filter;
    case 'dateTime': return Calendar;
    case 'debugger': return Bug;
    default: return Activity;
  }
}

function RightSideMoreDetails({ id, type, data }: TProps) {
  const { closeMoreDetails, updateNodeData } = useStoreNode(
    useShallow(selector)
  );

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

  const NodeIcon = getNodeIcon(type as string);

  return (
    <div className="absolute top-0 right-0 h-full w-96 bg-white border-l border-border shadow-soft-2xl z-20 flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-white sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <NodeIcon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground text-base">Configuration</h2>
            <p className="text-xs text-muted-foreground">Edit node properties</p>
          </div>
        </div>
        <button
          onClick={closeMoreDetails}
          className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Meta Info */}
        <div className="p-4 bg-muted/30 rounded-xl border border-border/60 space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground font-medium">Node ID</span>
            <code className="px-2 py-0.5 bg-muted rounded text-xs font-mono text-foreground select-all">
              {id}
            </code>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground font-medium">Type</span>
            <span className="capitalize px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-medium">
              {type}
            </span>
          </div>
        </div>

        {/* Dynamic Form */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border/60">
            <Settings2 className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">
              Parameters
            </h3>
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100">
            {renderDetailsNode}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border bg-gray-50/50 text-center">
        <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          Changes saved automatically
        </p>
      </div>
    </div>
  );
}

export default RightSideMoreDetails;
