// src/hooks/useRollLogic.ts
import { useState } from 'react';
import { heroSets } from '../data/heroSets';

/**
 * useRollLogic
 * Encapsulates state and helpers for rolling hero sets, including
 * selection state, roll type, visibility/reveal management, and storage sync.
 */
export const useRollLogic = (disabledSets: Set<string>) => {
  const [selectedSet, setSelectedSet] = useState<typeof heroSets[0] | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set(heroSets.map(set => set.name)));
  const [shuffledHeroSets, setShuffledHeroSets] = useState<typeof heroSets>(heroSets);
  const [currentRollType, setCurrentRollType] = useState<string | null>(null);
  const [revealedCards, setRevealedCards] = useState<Set<string>>(new Set());

  const rollTypes = {
    'left-to-right': 'Слева направо',
    'up-to-down': 'Сверху вниз', 
    'hide-reveal': 'Скрыть и показать',
    'right-to-left': 'Справа налево',
    'bottom-to-top': 'Снизу вверх',
    'reverse-reveal': 'Обратное раскрытие'
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

  const getTopToBottomOrder = (sets: typeof heroSets) => {
    const cols = 5;
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

  const getColumnByColumnOrder = (sets: typeof heroSets) => {
    const cols = 5;
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
    window.dispatchEvent(new CustomEvent('heroSetChanged', { detail: set }));
    try {
      localStorage.setItem('currentSelectedSet', JSON.stringify(set));
      localStorage.setItem('heroSetUpdate', Date.now().toString());
    } catch { /* noop */ }
  };

  const finishRoll = (_final: typeof heroSets[0], rollType?: string) => {
    setIsSpinning(false);
    if (rollType) setCurrentRollType(rollType);
    
    if (rollType === 'hide-reveal') {
      setTimeout(() => {
        setVisibleCards(new Set(heroSets.map(set => set.name)));
      }, 1500);
    }

    if (rollType === 'reverse-reveal') {
      setTimeout(() => {
        setRevealedCards(new Set());
        setCurrentRollType(null);
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
    finishRoll,
    currentRollType,
    setCurrentRollType,
    revealedCards,
    setRevealedCards
  };
};
