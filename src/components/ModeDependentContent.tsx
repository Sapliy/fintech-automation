import React from 'react';
import { useUIStore } from '../store/uiStore';

interface ModeDependentContentProps {
  children: {
    friendly: React.ReactNode;
    advanced: React.ReactNode;
  };
}

const ModeDependentContent: React.FC<ModeDependentContentProps> = ({ children }) => {
  const { mode } = useUIStore();

  return (
    <div className="p-4">
      {mode === 'friendly' ? children.friendly : children.advanced}
    </div>
  );
};

export default ModeDependentContent; 