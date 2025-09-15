// src/components/ResetButton.tsx
import React from 'react';

interface ResetButtonProps {
  isSpinning: boolean;
  onReset: () => void;
}

const ResetButton: React.FC<ResetButtonProps> = ({
  isSpinning,
  onReset
}) => {
  return (
    <button
      onClick={onReset}
      disabled={isSpinning}
      className={`
        px-3 py-1.5 rounded text-xs font-medium mt-8
        transition-all duration-200 backdrop-blur-sm border
        ${isSpinning 
          ? 'bg-gray-500/50 text-gray-400 cursor-not-allowed border-gray-400/30'
          : 'bg-red-500/80 text-white border-red-400/50 hover:bg-red-400/90 hover:border-red-300/70 hover:scale-105'
        }
      `}
    >
      Сброс статистики и настроек
    </button>
  );
};

export default ResetButton;
