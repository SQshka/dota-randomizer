// src/components/HeroSet.tsx
import React from 'react';

interface HeroSetProps {
  name: string;
  heroes: string[];
  isSelected: boolean;
  percentage?: number;
}

const HeroSet: React.FC<HeroSetProps> = ({ name, heroes, isSelected, percentage = 0 }) => {
  return (
    <div
      className={`
        relative p-4 rounded-lg shadow-lg transition-all duration-300 transform
        bg-black/40 backdrop-blur-sm border-2 border-white/30
        ${isSelected ? 'scale-105 shadow-yellow-400/50' : ''}
        hover:scale-105 hover:border-white/50
      `}
      style={{
        boxShadow: isSelected 
          ? '0 0 0 4px rgba(250, 204, 21, 0.8), 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' 
          : undefined
      }}
    >
      <div className="absolute top-2 right-2 bg-black/60 text-yellow-300 text-xs font-bold px-2 py-1 rounded" title="Процент ролла">
        {Math.round(percentage)}%
      </div>
      <div className="flex justify-center items-center mb-2">
        {heroes.map((hero, index) => (
          <img
            key={index}
            src={hero}
            alt={name}
            className="w-16 h-16 rounded-full mx-1 border-2 border-white object-cover object-center shrink-0"
          />
        ))}
      </div>
      <h3 className="text-sm font-semibold text-center text-white">
        {name}
      </h3>
    </div>
  );
};

export default HeroSet;