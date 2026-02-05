import {
  BaseEdge,
  EdgeProps,
  getBezierPath,
  MarkerType,
  Node,
  EdgeLabelRenderer,
} from "@xyflow/react";
import { memo, useMemo } from "react";
import { getEdgeStyle, generateAllGradients } from "../utils/edgeStyles";
import type { NodeTypes } from "../nodes/types";
import EdgeMenu from "./EdgeMenu";


export function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  selected,
  source,
  target,
}: EdgeProps & { sourceNode?: Node; targetNode?: Node }) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const style = useMemo(() => {
    const sourceType = source.split("-")[0] as NodeTypes;
    const targetType = target.split("-")[0] as NodeTypes;
    const edgeStyle = getEdgeStyle(
      sourceType,
      targetType,
      sourceX,
      targetX
    );

    return {
      ...edgeStyle,
      markerEnd: MarkerType.ArrowClosed,
    };
  }, [source, target, sourceX, sourceY, targetX, targetY]);


  // Generate all the possible gradient combinations for the defs section
  const allGradients = useMemo(() =>
    generateAllGradients(),
    []
  );

  return (
    <>
      {/* Gradient Definitions */}
      <defs>
        {allGradients}

        {/* Add filter for glow effect */}
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background Path */}
      <path
        id={id}
        className="react-flow__edge-path-bg"
        d={edgePath}
        strokeWidth={6}
        stroke="#88888822"
        fill="none"
      />

      {/* Animated Edge */}
      <BaseEdge
        path={edgePath}
        style={{
          strokeWidth: style.strokeWidth,
          stroke: style.stroke,
        }}
        markerEnd={style.markerEnd}
        className={`react-flow__edge-path ${selected ? "selected" : ""}`}
      />

      {/* Edge Label and Menu */}
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          {selected && (
            <div className="relative">
              <div className="absolute -translate-x-1/2 -translate-y-1/2">
                <EdgeMenu
                  edgeId={id}
                  source={source}
                  target={target}
                />
              </div>
            </div>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

export default memo(CustomEdge);
