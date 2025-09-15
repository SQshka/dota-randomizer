// src/utils/rollHandlers.ts
import { heroSets } from '../data/heroSets';

export const createRollHandlers = (
  disabledSets: Set<string>,
  setSelectedSet: (set: typeof heroSets[0]) => void,
  updateSetInStorage: (set: typeof heroSets[0]) => void,
  finishRoll: (final: typeof heroSets[0], rollType?: string) => void,
  getRandomSet: () => typeof heroSets[0],
  getTopToBottomOrder: (sets: typeof heroSets) => typeof heroSets,
  getColumnByColumnOrder: (sets: typeof heroSets) => typeof heroSets,
  setVisibleCards: (cards: Set<string>) => void
) => {
  const handleLeftToRightRoll = (totalDurationMs: number) => {
    const enabledSets = heroSets.filter(set => !disabledSets.has(set.name));
    const setsToUse = enabledSets.length > 0 ? enabledSets : heroSets;
    const leftToRightOrder = getTopToBottomOrder(setsToUse);
    
    const startTime = performance.now();
    let currentIndex = Math.floor(Math.random() * leftToRightOrder.length);
    let lastSet: typeof heroSets[0] | null = null;

    const step = () => {
      const now = performance.now();
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / totalDurationMs);

      const minDelayMs = 50;
      const durationSeconds = totalDurationMs / 1000;
      const maxDelayMs = Math.min(800, 50 + (durationSeconds * 30));
      const randomDecelerationFactor = 0.5 + Math.random() * 0.5;
      
      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
      const eased = easeOutCubic(progress);
      const currentDelay = minDelayMs + (maxDelayMs - minDelayMs) * eased * randomDecelerationFactor;

      const newSet = leftToRightOrder[currentIndex];
      setSelectedSet(newSet);
      updateSetInStorage(newSet);
      lastSet = newSet;

      currentIndex++;
      if (currentIndex >= leftToRightOrder.length) {
        currentIndex = 0;
      }

      if (progress < 1) {
        setTimeout(step, currentDelay);
      } else {
        if (lastSet) {
          setSelectedSet(lastSet);
          updateSetInStorage(lastSet);
          setTimeout(() => finishRoll(lastSet!), 500);
        } else {
          const final = getRandomSet();
          setSelectedSet(final);
          updateSetInStorage(final);
          setTimeout(() => finishRoll(final), 500);
        }
      }
    };

    setTimeout(step, 100);
  };

  const handleRightToLeftRoll = (totalDurationMs: number) => {
    const enabledSets = heroSets.filter(set => !disabledSets.has(set.name));
    const setsToUse = enabledSets.length > 0 ? enabledSets : heroSets;
    const leftToRightOrder = getTopToBottomOrder(setsToUse);
    
    const startTime = performance.now();
    let currentIndex = Math.floor(Math.random() * leftToRightOrder.length);
    let lastSet: typeof heroSets[0] | null = null;

    const step = () => {
      const now = performance.now();
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / totalDurationMs);

      const minDelayMs = 50;
      const durationSeconds = totalDurationMs / 1000;
      const maxDelayMs = Math.min(800, 50 + (durationSeconds * 30));
      const randomDecelerationFactor = 0.5 + Math.random() * 0.5;
      
      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
      const eased = easeOutCubic(progress);
      const currentDelay = minDelayMs + (maxDelayMs - minDelayMs) * eased * randomDecelerationFactor;

      const newSet = leftToRightOrder[currentIndex];
      setSelectedSet(newSet);
      updateSetInStorage(newSet);
      lastSet = newSet;

      currentIndex--;
      if (currentIndex < 0) {
        currentIndex = leftToRightOrder.length - 1;
      }

      if (progress < 1) {
        setTimeout(step, currentDelay);
      } else {
        if (lastSet) {
          setSelectedSet(lastSet);
          updateSetInStorage(lastSet);
          setTimeout(() => finishRoll(lastSet!), 500);
        } else {
          const final = getRandomSet();
          setSelectedSet(final);
          updateSetInStorage(final);
          setTimeout(() => finishRoll(final), 500);
        }
      }
    };

    setTimeout(step, 100);
  };

  const handleUpToDownRoll = (totalDurationMs: number) => {
    const enabledSets = heroSets.filter(set => !disabledSets.has(set.name));
    const setsToUse = enabledSets.length > 0 ? enabledSets : heroSets;
    const columnByColumnOrder = getColumnByColumnOrder(setsToUse);
    
    const startTime = performance.now();
    let currentIndex = Math.floor(Math.random() * columnByColumnOrder.length);
    let lastSet: typeof heroSets[0] | null = null;

    const step = () => {
      const now = performance.now();
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / totalDurationMs);

      const minDelayMs = 50;
      const durationSeconds = totalDurationMs / 1000;
      const maxDelayMs = Math.min(800, 50 + (durationSeconds * 30));
      const randomDecelerationFactor = 0.5 + Math.random() * 0.5;
      
      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
      const eased = easeOutCubic(progress);
      const currentDelay = minDelayMs + (maxDelayMs - minDelayMs) * eased * randomDecelerationFactor;

      const newSet = columnByColumnOrder[currentIndex];
      setSelectedSet(newSet);
      updateSetInStorage(newSet);
      lastSet = newSet;

      currentIndex--;
      if (currentIndex < 0) {
        currentIndex = columnByColumnOrder.length - 1;
      }

      if (progress < 1) {
        setTimeout(step, currentDelay);
      } else {
        if (lastSet) {
          setSelectedSet(lastSet);
          updateSetInStorage(lastSet);
          setTimeout(() => finishRoll(lastSet!), 500);
        } else {
          const final = getRandomSet();
          setSelectedSet(final);
          updateSetInStorage(final);
          setTimeout(() => finishRoll(final), 500);
        }
      }
    };

    setTimeout(step, 100);
  };

  const handleBottomToTopRoll = (totalDurationMs: number) => {
    const enabledSets = heroSets.filter(set => !disabledSets.has(set.name));
    const setsToUse = enabledSets.length > 0 ? enabledSets : heroSets;
    const columnByColumnOrder = getColumnByColumnOrder(setsToUse);
    
    const startTime = performance.now();
    let currentIndex = Math.floor(Math.random() * columnByColumnOrder.length);
    let lastSet: typeof heroSets[0] | null = null;

    const step = () => {
      const now = performance.now();
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / totalDurationMs);

      const minDelayMs = 50;
      const durationSeconds = totalDurationMs / 1000;
      const maxDelayMs = Math.min(800, 50 + (durationSeconds * 30));
      const randomDecelerationFactor = 0.5 + Math.random() * 0.5;
      
      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
      const eased = easeOutCubic(progress);
      const currentDelay = minDelayMs + (maxDelayMs - minDelayMs) * eased * randomDecelerationFactor;

      const newSet = columnByColumnOrder[currentIndex];
      setSelectedSet(newSet);
      updateSetInStorage(newSet);
      lastSet = newSet;

      currentIndex++;
      if (currentIndex >= columnByColumnOrder.length) {
        currentIndex = 0;
      }

      if (progress < 1) {
        setTimeout(step, currentDelay);
      } else {
        if (lastSet) {
          setSelectedSet(lastSet);
          updateSetInStorage(lastSet);
          setTimeout(() => finishRoll(lastSet!), 500);
        } else {
          const final = getRandomSet();
          setSelectedSet(final);
          updateSetInStorage(final);
          setTimeout(() => finishRoll(final), 500);
        }
      }
    };

    setTimeout(step, 100);
  };

  const handleHideRevealRoll = (totalDurationMs: number) => {
    const enabledSets = heroSets.filter(set => !disabledSets.has(set.name));
    const setsToUse = enabledSets.length > 0 ? enabledSets : heroSets;
    
    const startTime = performance.now();
    let remainingSets = [...setsToUse];

    const step = () => {
      const now = performance.now();
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / totalDurationMs);

      const baseSpeed = Math.max(200, totalDurationMs / 20);
      const minDelayMs = baseSpeed * 0.5;
      const maxDelayMs = baseSpeed * 2;
      
      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
      const eased = easeOutCubic(progress);
      const currentDelay = minDelayMs + (maxDelayMs - minDelayMs) * eased;

      if (remainingSets.length > 1) {
        const randomIndex = Math.floor(Math.random() * remainingSets.length);
        const currentSet = remainingSets[randomIndex];
        
        setSelectedSet(currentSet);
        updateSetInStorage(currentSet);
        
        remainingSets = remainingSets.filter(set => set.name !== currentSet.name);
        setVisibleCards(new Set(remainingSets.map(set => set.name)));
      }

      if (progress < 1 && remainingSets.length > 1) {
        setTimeout(step, currentDelay);
      } else {
        if (remainingSets.length > 0) {
          const final = remainingSets[0];
          setSelectedSet(final);
          updateSetInStorage(final);
          setTimeout(() => finishRoll(final, 'hide-reveal'), 500);
        } else {
          const final = getRandomSet();
          setSelectedSet(final);
          updateSetInStorage(final);
          setTimeout(() => finishRoll(final, 'hide-reveal'), 500);
        }
      }
    };

    setTimeout(step, 100);
  };

  const handleOriginalRoll = (totalDurationMs: number) => {
    const minDelayMs = 60;
    const maxDelayMs = 350;
    const startTime = performance.now();

    const step = () => {
      const now = performance.now();
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / totalDurationMs);

      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
      const eased = easeOutCubic(progress);
      const currentDelay = minDelayMs + (maxDelayMs - minDelayMs) * eased;

      const newSet = getRandomSet();
      setSelectedSet(newSet);
      updateSetInStorage(newSet);

      if (progress < 1) {
        setTimeout(step, currentDelay);
      } else {
        const final = getRandomSet();
        setSelectedSet(final);
        updateSetInStorage(final);
        setTimeout(() => finishRoll(final), 500);
      }
    };

    setTimeout(step, minDelayMs);
  };

  return {
    handleLeftToRightRoll,
    handleRightToLeftRoll,
    handleUpToDownRoll,
    handleBottomToTopRoll,
    handleHideRevealRoll,
    handleOriginalRoll
  };
};
