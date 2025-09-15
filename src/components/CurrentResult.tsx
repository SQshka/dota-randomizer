// src/components/CurrentResult.tsx
import React from 'react';
import { heroSets } from '../data/heroSets';

interface CurrentResultProps {
  selectedSet: typeof heroSets[0] | null;
  obsCopied: boolean;
  onCopyHeroUrl: () => void;
}

const CurrentResult: React.FC<CurrentResultProps> = ({
  selectedSet,
  obsCopied,
  onCopyHeroUrl
}) => {
  if (!selectedSet) return null;

  return (
    <div className="fixed top-2 right-2 sm:top-4 sm:right-4 z-20 bg-black/80 backdrop-blur-sm border-2 border-yellow-400/50 rounded-lg p-2 sm:p-4 shadow-2xl">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <h2 className="text-white font-semibold text-xs sm:text-sm">Текущие герои</h2>
          <button
            onClick={onCopyHeroUrl}
            className={`px-2 py-1 rounded text-xs font-medium border transition-all duration-200 ${
              obsCopied
                ? 'bg-green-500/80 text-white border-green-400/50'
                : 'bg-blue-500/80 text-white border-blue-400/50 hover:bg-blue-400/90 hover:scale-105'
            }`}
            title="Copy Hero URL for OBS"
          >
            {obsCopied ? 'Copied' : 'OBS'}
          </button>
        </div>
        <h3 className="text-yellow-300 font-bold text-xs sm:text-sm mb-1 sm:mb-2">{selectedSet.name}</h3>
        <div className="flex justify-center items-center gap-0.5 sm:gap-1">
          {selectedSet.heroes.map((hero, index) => (
            <img
              key={index}
              src={hero}
              alt={`Hero ${index + 1}`}
              className="w-8 h-8 sm:w-12 sm:h-12 rounded-full border-2 border-yellow-300/50 object-cover object-center hover:scale-110 transition-transform duration-200"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CurrentResult;
