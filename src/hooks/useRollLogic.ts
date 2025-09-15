// src/hooks/useRollLogic.ts
import { useState } from 'react';
import { heroSets } from '../data/heroSets';

export const useRollLogic = (disabledSets: Set<string>) => {
  const [selectedSet, setSelectedSet] = useState<typeof heroSets[0] | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set(heroSets.map(set => set.name)));
  const [shuffledHeroSets, setShuffledHeroSets] = useState<typeof heroSets>(heroSets);

  // Roll types
  const rollTypes = {
    'left-to-right': 'Слева направо',
    'up-to-down': 'Сверху вниз', 
    'hide-reveal': 'Скрыть и показать',
    'right-to-left': 'Справа налево',
    'bottom-to-top': 'Снизу вверх'
  };

  const getRandomSet = () => {
    const enabledSets = heroSets.filter(set => !disabledSets.has(set.name));
    if (enabledSets.length === 0) {
      const randomIndex = Math.floor(Math.random() * heroSets.length);
      return heroSets[randomIndex];
    }
    const randomIndex = Math.floor(Math.random() * enabledSets.length);
    return enabledSets[randomIndex];
  };

  const getRandomRollType = () => {
    const rollTypeKeys = Object.keys(rollTypes);
    const randomIndex = Math.floor(Math.random() * rollTypeKeys.length);
    return rollTypeKeys[randomIndex];
  };

  const shuffleArray = (array: typeof heroSets): typeof heroSets => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Calculate visual order from top to bottom based on grid layout (row by row)
  const getTopToBottomOrder = (sets: typeof heroSets) => {
    const cols = 5; // Assume xl screen size (5 columns)
    const rows = Math.ceil(sets.length / cols);
    
    const orderedSets = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const index = row * cols + col;
        if (index < sets.length) {
          orderedSets.push(sets[index]);
        }
      }
    }
    return orderedSets;
  };

  // Calculate visual order column by column (up to down)
  const getColumnByColumnOrder = (sets: typeof heroSets) => {
    const cols = 5; // Assume xl screen size (5 columns)
    const rows = Math.ceil(sets.length / cols);
    
    const orderedSets = [];
    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        const index = row * cols + col;
        if (index < sets.length) {
          orderedSets.push(sets[index]);
        }
      }
    }
    return orderedSets;
  };

  const updateSetInStorage = (set: typeof heroSets[0]) => {
    // Dispatch custom event for OBS overlay (same tab)
    window.dispatchEvent(new CustomEvent('heroSetChanged', { detail: set }));
    // Also update localStorage for cross-tab synchronization
    try {
      localStorage.setItem('currentSelectedSet', JSON.stringify(set));
      localStorage.setItem('heroSetUpdate', Date.now().toString());
    } catch { /* noop */ }
  };

  const finishRoll = (_final: typeof heroSets[0], rollType?: string) => {
    setIsSpinning(false);
    
    // Reset visible cards to show all after 3 seconds (only for hide-reveal)
    if (rollType === 'hide-reveal') {
      setTimeout(() => {
        setVisibleCards(new Set(heroSets.map(set => set.name)));
      }, 1500);
    }
  };

  return {
    selectedSet,
    setSelectedSet,
    isSpinning,
    setIsSpinning,
    visibleCards,
    setVisibleCards,
    shuffledHeroSets,
    setShuffledHeroSets,
    getRandomSet,
    getRandomRollType,
    shuffleArray,
    getTopToBottomOrder,
    getColumnByColumnOrder,
    updateSetInStorage,
    finishRoll
  };
};
