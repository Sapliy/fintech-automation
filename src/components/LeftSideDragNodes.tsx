import {
  ArrowLeft,
  ArrowRight,
  Trash2,
  Workflow,
  // Trigger icons
  Zap,
  Clock,
  // Logic icons
  Split,
  Filter,
  Timer,
  UserCheck,
  Gauge,
  // Action icons
  Send,
  Globe,
  FileText,
  // Utility icons
  Bug,
  Brain,
  // Category icons
  PlayCircle,
  Cpu,
  ArrowRightCircle,
  Wrench,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useStoreDialog } from '../store';
import { useShallow } from 'zustand/shallow';
import { SelectorDialog } from '../store/type';
import { nodeColors } from '../utils/edgeStyles';

type TProps = {
  onDragStart: (event: React.DragEvent, type: string) => void;
};

const selectorDialog: SelectorDialog = (state) => ({
  dialog: state.dialog,
  setDialog: state.setDialog,
  clearAutomation: state.clearAutomation,
  saveAutomation: state.saveAutomation,
});

// Node configuration organized by category
const nodeCategories = [
  {
    key: 'triggers',
    label: 'Triggers',
    icon: PlayCircle,
    color: '#3B82F6',
    description: 'Start automation flows',
    nodes: [
      {
        type: 'eventTrigger',
        label: 'Event Trigger',
        icon: Zap,
        description: 'Stripe, Wallet, Ledger events',
      },
      {
        type: 'dateTime',
        label: 'Schedule',
        icon: Clock,
        description: 'Time-based triggers (cron)',
      },
    ],
  },
  {
    key: 'logic',
    label: 'Logic',
    icon: Cpu,
    color: '#8B5CF6',
    description: 'Decision making & flow control',
    nodes: [
      {
        type: 'condition',
        label: 'Condition',
        icon: Split,
        description: 'If/else branching',
      },
      {
        type: 'filter',
        label: 'Filter',
        icon: Filter,
        description: 'Filter by criteria',
      },
      {
        type: 'timeout',
        label: 'Delay',
        icon: Timer,
        description: 'Wait before continuing',
      },
      {
        type: 'approval',
        label: 'Approval',
        icon: UserCheck,
        description: 'Human approval step',
      },
      {
        type: 'rateLimit',
        label: 'Rate Limit',
        icon: Gauge,
        description: 'Prevent action flooding',
      },
    ],
  },
  {
    key: 'actions',
    label: 'Actions',
    icon: ArrowRightCircle,
    color: '#10B981',
    description: 'Output operations',
    nodes: [
      {
        type: 'notification',
        label: 'Notification',
        icon: Send,
        description: 'WhatsApp, Email, Slack',
      },
      {
        type: 'webhook',
        label: 'Webhook',
        icon: Globe,
        description: 'HTTP requests',
      },
      {
        type: 'auditLog',
        label: 'Audit Log',
        icon: FileText,
        description: 'Create audit entries',
      },
    ],
  },
  {
    key: 'utilities',
    label: 'Utilities',
    icon: Wrench,
    color: '#F59E0B',
    description: 'Debugging & analysis',
    nodes: [
      {
        type: 'debugger',
        label: 'Debugger',
        icon: Bug,
        description: 'Log and inspect data',
      },
      {
        type: 'ai-analysis',
        label: 'AI Analysis',
        icon: Brain,
        description: 'AI-powered analysis',
      },
    ],
  },
];

const LeftSideDragNodes = ({ onDragStart }: TProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['triggers', 'logic', 'actions']);
  const { saveAutomation, clearAutomation } = useStoreDialog(
    useShallow(selectorDialog)
  );

  const toggleCategory = (key: string) => {
    setExpandedCategories((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(true);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Shortcut: Ctrl + E to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'e') {
        setOpen(!open);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <div
      ref={ref}
      className={`
        h-screen relative transform transition-all duration-300
        ${open ? 'w-5' : 'w-80'}
        bg-white shadow-lg
      `}
    >
      {/* Toggle Button */}
      <button
        className={`
          absolute z-10 -right-3 top-6
          p-1.5 rounded-full shadow-md
          ${open
            ? 'bg-blue-500 hover:bg-blue-600'
            : 'bg-gray-700 hover:bg-gray-800'
          }
          text-white transition-all duration-200
        `}
        onClick={() => setOpen(!open)}
      >
        {!open ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
      </button>

      {/* Sidebar Content */}
      {!open && (
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-800">Automation Nodes</h2>
            <p className="text-sm text-gray-500 mt-1">
              Drag to create flows
            </p>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            {nodeCategories.map((category) => {
              const isExpanded = expandedCategories.includes(category.key);
              const CategoryIcon = category.icon;

              return (
                <div key={category.key} className="border-b border-gray-100">
                  {/* Category Header */}
                  <button
                    onClick={() => toggleCategory(category.key)}
                    className="w-full px-5 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <CategoryIcon
                        className="w-5 h-5"
                        style={{ color: category.color }}
                      />
                      <div className="text-left">
                        <div className="font-semibold text-gray-800">
                          {category.label}
                        </div>
                        <div className="text-xs text-gray-500">
                          {category.description}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''
                        }`}
                    >
                      <ArrowRight size={16} className="text-gray-400" />
                    </div>
                  </button>

                  {/* Category Nodes */}
                  {isExpanded && (
                    <div className="px-3 pb-3 space-y-2">
                      {category.nodes.map((node) => {
                        const NodeIcon = node.icon;
                        const nodeColor = (nodeColors as any)[node.type] || {
                          from: category.color,
                          to: category.color,
                        };

                        return (
                          <div
                            key={node.type}
                            draggable
                            onDragStart={(event) => onDragStart(event, node.type)}
                            className={`
                              group relative p-3 rounded-lg cursor-grab
                              border-2 bg-white
                              hover:shadow-md active:shadow-lg
                              transition-all duration-200
                            `}
                            style={{
                              borderColor: nodeColor.from + '40',
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className="p-2 rounded-lg"
                                style={{
                                  backgroundColor: nodeColor.from + '15',
                                }}
                              >
                                <NodeIcon
                                  className="w-4 h-4"
                                  style={{ color: nodeColor.from }}
                                />
                              </div>
                              <div>
                                <p className="font-medium text-gray-800 text-sm">
                                  {node.label}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {node.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="p-4 border-t border-gray-100 space-y-2">
            <button
              onClick={saveAutomation}
              className={`
                cursor-pointer
                flex items-center justify-center gap-2 w-full
                px-4 py-2.5 rounded-lg
                bg-blue-500 hover:bg-blue-600
                text-white font-medium transition-colors
              `}
            >
              <Workflow size={18} />
              Save Flow
            </button>

            <button
              onClick={clearAutomation}
              className={`
                cursor-pointer
                flex items-center justify-center gap-2 w-full
                px-4 py-2 rounded-lg
                bg-red-50 hover:bg-red-100
                text-red-600 font-medium transition-colors
              `}
            >
              <Trash2 size={16} />
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeftSideDragNodes;
