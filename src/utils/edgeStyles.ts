import { CSSProperties } from 'react';
import React from 'react';
import { NodeTypes } from '../nodes/types';

// Node type base colors - organized by category
export const nodeColors: Record<NodeTypes, { from: string; to: string }> = {
  // ===== TRIGGERS =====
  eventTrigger: { from: '#3B82F6', to: '#60A5FA' }, // Blue
  dateTime: { from: '#F59E0B', to: '#FBBF24' }, // Amber

  // ===== LOGIC =====
  condition: { from: '#8B5CF6', to: '#A78BFA' }, // Purple
  filter: { from: '#EC4899', to: '#F472B6' }, // Pink
  timeout: { from: '#F59E0B', to: '#FBBF24' }, // Amber
  approval: { from: '#D97706', to: '#FBBF24' }, // Orange-Amber
  rateLimit: { from: '#DC2626', to: '#F87171' }, // Red

  // ===== ACTIONS =====
  notification: { from: '#3B82F6', to: '#60A5FA' }, // Blue
  webhook: { from: '#059669', to: '#10B981' }, // Emerald
  auditLog: { from: '#7C3AED', to: '#A78BFA' }, // Violet

  // ===== UTILITIES =====
  debugger: { from: '#10B981', to: '#34D399' }, // Green
  'ai-analysis': { from: '#6366F1', to: '#818CF8' }, // Indigo
};

// Dynamic gradient generation with direction awareness
export const getGradientId = (
  sourceType: NodeTypes,
  targetType: NodeTypes,
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number
): string => {
  const isLeftToRight = sourceX <= targetX;
  return `${sourceType}-to-${targetType}-gradient-${isLeftToRight ? 'ltr' : 'rtl'}`;
};

export const getEdgeStyle = (
  sourceType: NodeTypes,
  targetType: NodeTypes,
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number
): CSSProperties => {
  const gradientId = getGradientId(sourceType, targetType, sourceX, sourceY, targetX, targetY);

  return {
    stroke: `url(#${gradientId})`,
    strokeWidth: 2,
    animation: 'dash 2s linear infinite'
  };
};

// All node types for gradient generation
const allNodeTypes: NodeTypes[] = [
  // Triggers
  'eventTrigger', 'dateTime',
  // Logic
  'condition', 'filter', 'timeout', 'approval', 'rateLimit',
  // Actions
  'notification', 'webhook', 'auditLog',
  // Utilities
  'debugger', 'ai-analysis',
];

// Function to generate all possible gradients for the defs section
export const generateAllGradients = (): React.ReactElement[] => {
  const gradients: React.ReactElement[] = [];

  allNodeTypes.forEach(sourceType => {
    allNodeTypes.forEach(targetType => {
      // Create LTR (left-to-right) gradient
      const ltrId = getGradientId(sourceType, targetType, 0, 0, 100, 0);
      const sourceColor = nodeColors[sourceType];
      const targetColor = nodeColors[targetType];

      gradients.push(
        React.createElement(
          'linearGradient',
          {
            key: ltrId,
            id: ltrId,
            x1: '0%',
            y1: '0%',
            x2: '100%',
            y2: '0%'
          },
          React.createElement('stop', { offset: '0%', stopColor: sourceColor.from }),
          React.createElement('stop', { offset: '50%', stopColor: sourceColor.to }),
          React.createElement('stop', { offset: '100%', stopColor: targetColor.to })
        )
      );

      // Create RTL (right-to-left) gradient
      const rtlId = getGradientId(sourceType, targetType, 100, 0, 0, 0);

      gradients.push(
        React.createElement(
          'linearGradient',
          {
            key: rtlId,
            id: rtlId,
            x1: '0%',
            y1: '0%',
            x2: '100%',
            y2: '0%'
          },
          React.createElement('stop', { offset: '0%', stopColor: targetColor.to }),
          React.createElement('stop', { offset: '50%', stopColor: targetColor.from }),
          React.createElement('stop', { offset: '50%', stopColor: sourceColor.to }),
          React.createElement('stop', { offset: '100%', stopColor: sourceColor.from })
        )
      );
    });
  });

  return gradients;
};
