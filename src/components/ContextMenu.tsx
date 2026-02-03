import React from "react";
import { TContextMenu } from "../types";
import { Trash2, Copy, Settings2, X } from "lucide-react";

interface ContextMenuProps extends TContextMenu {
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onClose: () => void;
  onMoreDetails: (id: string) => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  id,
  onDelete,
  onDuplicate,
  onClose,
  onMoreDetails,
  top,
  left,
  right,
  bottom,
}) => {
  if (top === false && bottom === false) return null;
  if (left === false && right === false) return null;

  const positionStyle = {
    top: top !== false ? `${top}px` : undefined,
    left: left !== false ? `${left}px` : undefined,
    right: right !== false ? `${right}px` : undefined,
    bottom: bottom !== false ? `${bottom}px` : undefined,
  };

  return (
    <div
      className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40"
      onClick={onClose}
    >
      <div
        className="absolute z-50 w-64 bg-white rounded-xl shadow-2xl border border-gray-200
                  overflow-hidden animate-slideIn"
        style={positionStyle}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 py-3 bg-gradient-to-r from-gray-800 to-gray-900">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-white">Node Actions</h3>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <div className="p-2 space-y-1">
          <button
            className="flex w-full items-center gap-2 px-3 py-2 rounded-md
                      text-left text-sm font-medium
                      text-red-600 hover:bg-red-50 group
                      transition-colors duration-150"
            onClick={() => onDelete(id)}
          >
            <Trash2 className="w-4 h-4 opacity-70 group-hover:opacity-100" />
            Delete Node
          </button>

          <button
            className="flex w-full items-center gap-2 px-3 py-2 rounded-md
                      text-left text-sm font-medium
                      text-blue-600 hover:bg-blue-50 group
                      transition-colors duration-150"
            onClick={() => onDuplicate(id)}
          >
            <Copy className="w-4 h-4 opacity-70 group-hover:opacity-100" />
            Duplicate Node
          </button>

          <button
            className="flex w-full items-center gap-2 px-3 py-2 rounded-md
                      text-left text-sm font-medium
                      text-purple-600 hover:bg-purple-50 group
                      transition-colors duration-150"
            onClick={() => onMoreDetails(id)}
          >
            <Settings2 className="w-4 h-4 opacity-70 group-hover:opacity-100" />
            More Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContextMenu;
