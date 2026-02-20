import {
  PlayCircle,
  Cpu,
  Zap,
  ArrowLeft,
  ArrowRight,
  Workflow,
  Clock,
  Split,
  Filter,
  Timer,
  UserCheck,
  Gauge,
  Send,
  Globe,
  FileText,
  Bug,
  Brain,
  ArrowRightCircle,
  Wrench
} from "lucide-react";
import { useRef, useState } from 'react';
import { nodeColors } from '../utils/edgeStyles';

type TProps = {
  onDragStart: (event: React.DragEvent, type: string) => void;
};

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
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['triggers', 'logic', 'actions', 'utilities']);
  /* const { saveAutomation, clearAutomation } = useStoreDialog(
    useShallow(selectorDialog)
  ); */

  const toggleCategory = (key: string) => {
    setExpandedCategories((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  return (
    <div
      ref={ref}
      className={`
        h-screen relative transform transition-all duration-300 ease-in-out
        ${open ? 'w-80' : 'w-12'}
        bg-card border-r border-border shadow-lg z-20
      `}
    >
      {/* Toggle Button */}
      <button
        className={`
          absolute z-30 -right-3 top-6
          p-1.5 rounded-full shadow-md border border-border
          bg-card hover:bg-secondary text-muted-foreground
          transition-all duration-200
        `}
        onClick={() => setOpen(!open)}
      >
        {!open ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
      </button>

      {/* Sidebar Content */}
      <div className={`h-full flex flex-col ${!open ? 'opacity-0 pointer-events-none' : 'opacity-100'} transition-opacity duration-200`}>
        {/* Header */}
        <div className="p-5 border-b border-border bg-secondary/30">
          <div className="flex items-center gap-2 mb-1">
            <Workflow className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Flow Nodes</h2>
          </div>
          <p className="text-xs text-muted-foreground">
            Drag nodes to build your automation
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-2 py-4 space-y-1 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
          {nodeCategories.map((category) => {
            const isExpanded = expandedCategories.includes(category.key);
            const CategoryIcon = category.icon;

            return (
              <div key={category.key} className="rounded-xl overflow-hidden border border-transparent hover:border-border/50 transition-colors">
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category.key)}
                  className="w-full px-3 py-2.5 flex items-center justify-between hover:bg-secondary/50 rounded-lg transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-md bg-background shadow-sm border border-border/50 group-hover:border-primary/50 group-hover:shadow-md transition-all">
                      <CategoryIcon
                        className="w-4 h-4"
                        style={{ color: category.color }}
                      />
                    </div>
                    <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                      {category.label}
                    </span>
                  </div>
                  <ArrowRight
                    size={14}
                    className={`text-muted-foreground transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                  />
                </button>

                {/* Category Nodes */}
                <div
                  className={`
                    overflow-hidden transition-all duration-300 ease-in-out
                    ${isExpanded ? 'max-h-[1000px] opacity-100 mt-1 mb-2' : 'max-h-0 opacity-0'}
                  `}
                >
                  <div className="px-2 space-y-2">
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
                            border border-border/60 bg-background
                            hover:border-primary/50 hover:shadow-lg hover:-translate-y-0.5
                            active:scale-[0.98] active:shadow-sm
                            transition-all duration-200
                          `}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className="p-2 rounded-lg bg-secondary/50 shrink-0"
                              style={{
                                color: nodeColor.from
                              }}
                            >
                              <NodeIcon className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-foreground text-sm truncate group-hover:text-primary transition-colors">
                                {node.label}
                              </p>
                              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                {node.description || `Add a ${node.label.toLowerCase()} step`}
                              </p>
                            </div>
                          </div>

                          {/* Drag Indicator */}
                          <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="p-1 rounded bg-secondary">
                              <ArrowRight className="w-3 h-3 text-muted-foreground" />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LeftSideDragNodes;
