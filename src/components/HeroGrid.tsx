// src/components/HeroGrid.tsx
import React from 'react';
import HeroSet from './HeroSet';
import { heroSets } from '../data/heroSets';

interface HeroGridProps {
  shuffledHeroSets: typeof heroSets;
  selectedSet: typeof heroSets[0] | null;
  setStats: Record<string, number>;
  totalSetRolls: number;
  visibleCards: Set<string>;
  disabledSets: Set<string>;
  onToggleDisabled: (setName: string) => void;
}

const HeroGrid: React.FC<HeroGridProps> = ({
  shuffledHeroSets,
  selectedSet,
  setStats,
  totalSetRolls,
  visibleCards,
  disabledSets,
  onToggleDisabled
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 w-full px-4">
      {shuffledHeroSets.map((set, index) => {
        const count = setStats[set.name] ?? 0;
        const percent = totalSetRolls > 0 ? (count / totalSetRolls) * 100 : 0;
        const isVisible = visibleCards.has(set.name);
        
        return (
          <div
            key={index}
            className={`transition-all duration-500 ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'
            }`}
          >
            <HeroSet
              name={set.name}
              heroes={set.heroes}
              isSelected={selectedSet?.name === set.name}
              percentage={percent}
              isDisabled={disabledSets.has(set.name)}
              onToggleDisabled={() => onToggleDisabled(set.name)}
            />
          </div>
        );
      })}
    </div>
  );
};

export default HeroGrid;
