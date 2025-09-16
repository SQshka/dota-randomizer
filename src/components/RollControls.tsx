// src/components/RollControls.tsx
import React from 'react';

interface RollControlsProps {
  durationInput: string;
  setDurationInput: (value: string) => void;
  isSpinning: boolean;
  onSpin: () => void;
}

const RollControls: React.FC<RollControlsProps> = ({
  durationInput,
  setDurationInput,
  isSpinning,
  onSpin
}) => {
  return (
    <div className="text-center mb-12">
      <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-4">
        EvillyRU Challenge
      </h1>
      <p className="text-lg text-gray-300 mb-6">
        Случайный выбор набора героев для вашей следующей игры.
      </p>
      
      {/* Duration Input */}
      <div className="flex flex-col items-center gap-3">
        <label className="text-white font-semibold text-lg">
          Длительность вращения (минимум 15 секунд):
        </label>
        <div className="flex items-center gap-3 ml-8">
          <input
            type="number"
            value={durationInput}
            onChange={(e) => setDurationInput(e.target.value)}
            disabled={isSpinning}
            min="15"
            placeholder="15"
            className={`
              w-24 px-3 py-2 rounded-lg font-medium text-center
              border-2 backdrop-blur-sm transition-all duration-200
              bg-white/20 text-white border-white/30
              placeholder:text-white/60
              focus:outline-none focus:border-yellow-300/50 focus:bg-white/30
              ${isSpinning ? 'opacity-50 cursor-not-allowed' : 'hover:border-white/50'}
            `}
          />
          <span className="text-white/80 text-sm">сек</span>
        </div>
      </div>
      
      <button
        onClick={onSpin}
        disabled={isSpinning}
        className={`
          px-8 py-4 mt-8 mb-12 rounded-full font-bold text-xl
          transition-all duration-300 backdrop-blur-sm
          border-2 shadow-2xl
          ${isSpinning
            ? 'bg-gray-500/70 text-gray-300 cursor-not-allowed border-gray-400/50'
            : 'bg-gradient-to-r from-yellow-400/90 to-orange-400/90 text-purple-900 border-yellow-300/50 hover:scale-105 hover:from-yellow-300/90 hover:to-orange-300/90 hover:border-yellow-200/70 hover:shadow-yellow-400/25'
          }
        `}
      >
        {isSpinning ? 'Крутим...' : 'Испытать удачу!'}
      </button>
    </div>
  );
};

export default RollControls;
