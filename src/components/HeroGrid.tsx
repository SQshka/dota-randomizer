// src/components/HeroGrid.tsx
import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import HeroSet from './HeroSet';
import { heroSets } from '../data/heroSets';

type AppearanceMode = 'normal' | 'reverse';

interface HeroGridProps {
  shuffledHeroSets: typeof heroSets;
  selectedSet: typeof heroSets[0] | null;
  setStats: Record<string, number>;
  totalSetRolls: number;
  visibleCards: Set<string>;
  disabledSets: Set<string>;
  onToggleDisabled: (setName: string) => void;
  currentRollType?: string | null;
  revealedCards?: Set<string>;
}

/**
 * HeroGrid
 * Displays a responsive grid of hero sets with selection outline and
 * supports different appearance modes (normal/reverse-reveal).
 */
const HeroGrid: React.FC<HeroGridProps> = ({
  shuffledHeroSets,
  selectedSet,
  setStats,
  totalSetRolls,
  visibleCards,
  disabledSets,
  onToggleDisabled,
  currentRollType,
  revealedCards
}) => {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());

  const [outlineRect, setOutlineRect] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);

  useLayoutEffect(() => {
    const update = () => {
      if (!selectedSet) {
        setOutlineRect(null);
        return;
      }
      const el = cardRefs.current.get(selectedSet.name);
      const gridEl = gridRef.current;
      if (el && gridEl) {
        const elRect = el.getBoundingClientRect();
        const gridRect = gridEl.getBoundingClientRect();

        setOutlineRect({
          left: elRect.left - gridRect.left,
          top: elRect.top - gridRect.top,
          width: elRect.width,
          height: elRect.height
        });
      } else {
        setOutlineRect(null);
      }
    };

    update();

    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);

    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [selectedSet, shuffledHeroSets, visibleCards]);

  useEffect(() => {
    if (!gridRef.current) return;
    const ro = new ResizeObserver(() => {
      if (selectedSet) {
        const el = cardRefs.current.get(selectedSet.name);
        const gridEl = gridRef.current;
        if (el && gridEl) {
          const elRect = el.getBoundingClientRect();
          const gridRect = gridEl.getBoundingClientRect();
          setOutlineRect({
            left: elRect.left - gridRect.left,
            top: elRect.top - gridRect.top,
            width: elRect.width,
            height: elRect.height
          });
        }
      }
    });
    cardRefs.current.forEach((el) => el && ro.observe(el));
    return () => ro.disconnect();
  }, [shuffledHeroSets, selectedSet]);

  const isReverse = currentRollType === 'reverse-reveal';

  return (
    <div ref={gridRef} className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 w-full px-4">
      {shuffledHeroSets.map((set) => {
        const count = setStats[set.name] ?? 0;
        const percent = totalSetRolls > 0 ? (count / totalSetRolls) * 100 : 0;
        const isVisible = visibleCards.has(set.name);
        const isSelected = selectedSet?.name === set.name;

        const isRevealed = isReverse ? !!revealedCards?.has(set.name) : true;
        const appearanceMode: AppearanceMode = isReverse ? 'reverse' : 'normal';

        const dimClass = isReverse && isRevealed && !isSelected ? 'opacity-60' : '';

        return (
          <div
            key={set.name}
            ref={(el) => { cardRefs.current.set(set.name, el); }}
            className={`relative transition-all duration-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'} ${dimClass}`}
          >
            <HeroSet
              name={set.name}
              heroes={set.heroes}
              isSelected={isSelected}
              percentage={percent}
              isDisabled={disabledSets.has(set.name)}
              onToggleDisabled={() => onToggleDisabled(set.name)}
              appearanceMode={appearanceMode}
              isRevealed={isRevealed}
            />
          </div>
        );
      })}

      {outlineRect && (
        <motion.div
          initial={false}
          animate={{
            left: outlineRect.left,
            top: outlineRect.top,
            width: outlineRect.width,
            height: outlineRect.height,
            opacity: 1
          }}
          transition={{ type: 'spring', stiffness: 450, damping: 36, mass: 0.4 }}
          style={{ position: 'absolute' }}
          className="pointer-events-none rounded-lg ring-2 ring-yellow-400 border-0 z-50"
        />
      )}
    </div>
  );
};

export default HeroGrid;
