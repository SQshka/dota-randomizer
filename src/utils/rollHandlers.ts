// src/utils/rollHandlers.ts
import { heroSets } from "../data/heroSets";
import {
  computeProgress,
  getEasedDelay,
  computeBaseSpeed,
  maxDelayFromDuration,
  DEFAULT_MIN_DELAY,
  ORIGINAL_MIN_DELAY,
  ORIGINAL_MAX_DELAY,
  delayFromDuration,
} from "./animation";

export const createRollHandlers = (
  disabledSets: Set<string>,
  shuffledHeroSets: typeof heroSets,
  setSelectedSet: (set: (typeof heroSets)[0]) => void,
  updateSetInStorage: (set: (typeof heroSets)[0]) => void,
  finishRoll: (final: (typeof heroSets)[0], rollType?: string) => void,
  getRandomSet: () => (typeof heroSets)[0],
  getTopToBottomOrder: (sets: typeof heroSets) => typeof heroSets,
  getColumnByColumnOrder: (sets: typeof heroSets) => typeof heroSets,
  setVisibleCards: (cards: Set<string>) => void,
  setRevealedCards?: (cards: Set<string>) => void
) => {
  const handleLeftToRightRoll = (totalDurationMs: number) => {
    const enabledSets = shuffledHeroSets.filter(
      (set) => !disabledSets.has(set.name)
    );
    const setsToUse = enabledSets.length > 0 ? enabledSets : shuffledHeroSets;
    const leftToRightOrder = getTopToBottomOrder(setsToUse);

    const startTime = performance.now();
    let currentIndex = Math.floor(Math.random() * leftToRightOrder.length);
    let lastSet: (typeof heroSets)[0] | null = null;

    const step = () => {
      const progress = computeProgress(startTime, totalDurationMs);

      const minDelayMs = DEFAULT_MIN_DELAY;
      const maxDelayMs = maxDelayFromDuration(totalDurationMs);
      const randomDecelerationFactor = 0.5 + Math.random() * 0.5;

      const currentDelay = getEasedDelay(minDelayMs, maxDelayMs, progress, randomDecelerationFactor);

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
    const enabledSets = shuffledHeroSets.filter(
      (set) => !disabledSets.has(set.name)
    );
    const setsToUse = enabledSets.length > 0 ? enabledSets : shuffledHeroSets;
    const leftToRightOrder = getTopToBottomOrder(setsToUse);

    const startTime = performance.now();
    let currentIndex = Math.floor(Math.random() * leftToRightOrder.length);
    let lastSet: (typeof heroSets)[0] | null = null;

    const step = () => {
      const progress = computeProgress(startTime, totalDurationMs);

      const minDelayMs = DEFAULT_MIN_DELAY;
      const maxDelayMs = maxDelayFromDuration(totalDurationMs);
      const randomDecelerationFactor = 0.5 + Math.random() * 0.5;

      const currentDelay = getEasedDelay(minDelayMs, maxDelayMs, progress, randomDecelerationFactor);

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
    const enabledSets = shuffledHeroSets.filter(
      (set) => !disabledSets.has(set.name)
    );
    const setsToUse = enabledSets.length > 0 ? enabledSets : shuffledHeroSets;
    const columnByColumnOrder = getColumnByColumnOrder(setsToUse);

    const startTime = performance.now();
    let currentIndex = Math.floor(Math.random() * columnByColumnOrder.length);
    let lastSet: (typeof heroSets)[0] | null = null;

    const step = () => {
      const progress = computeProgress(startTime, totalDurationMs);

      const minDelayMs = DEFAULT_MIN_DELAY;
      const maxDelayMs = maxDelayFromDuration(totalDurationMs);
      const randomDecelerationFactor = 0.5 + Math.random() * 0.5;

      const currentDelay = getEasedDelay(minDelayMs, maxDelayMs, progress, randomDecelerationFactor);

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
    const enabledSets = shuffledHeroSets.filter(
      (set) => !disabledSets.has(set.name)
    );
    const setsToUse = enabledSets.length > 0 ? enabledSets : shuffledHeroSets;
    const columnByColumnOrder = getColumnByColumnOrder(setsToUse);

    const startTime = performance.now();
    let currentIndex = Math.floor(Math.random() * columnByColumnOrder.length);
    let lastSet: (typeof heroSets)[0] | null = null;

    const step = () => {
      const progress = computeProgress(startTime, totalDurationMs);

      const minDelayMs = DEFAULT_MIN_DELAY;
      const maxDelayMs = maxDelayFromDuration(totalDurationMs);
      const randomDecelerationFactor = 0.5 + Math.random() * 0.5;

      const currentDelay = getEasedDelay(minDelayMs, maxDelayMs, progress, randomDecelerationFactor);

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
    const enabledSets = shuffledHeroSets.filter(
      (set) => !disabledSets.has(set.name)
    );
    const setsToUse = enabledSets.length > 0 ? enabledSets : shuffledHeroSets;

    const startTime = performance.now();
    let remainingSets = [...setsToUse];
    const scheduledToHide = new Set<string>();
    const visibleNamesLocal = new Set<string>(setsToUse.map((s) => s.name));

    const step = () => {
      const progress = computeProgress(startTime, totalDurationMs);

      const baseSpeed = computeBaseSpeed(totalDurationMs);
      const minDelayMs = baseSpeed * 0.5;
      const maxDelayMs = baseSpeed * 2;

      const currentDelay = getEasedDelay(minDelayMs, maxDelayMs, progress);
      const stepDelay = delayFromDuration(totalDurationMs);
      const finalDelay = Math.min(1000, stepDelay * 5);

      if (remainingSets.length > 2) {
        const randomIndex = Math.floor(Math.random() * remainingSets.length);
        const currentSet = remainingSets[randomIndex];

        setSelectedSet(currentSet);
        updateSetInStorage(currentSet);

        remainingSets = remainingSets.filter(
          (set) => set.name !== currentSet.name
        );

        const currentName = currentSet.name;
        if (!scheduledToHide.has(currentName)) {
          scheduledToHide.add(currentName);
          setTimeout(() => {
            visibleNamesLocal.delete(currentName);
            setVisibleCards(new Set(visibleNamesLocal));
          }, stepDelay);
        }

        const delayNext = Math.max(currentDelay, stepDelay + 50);
        setTimeout(step, delayNext);
      } else if (remainingSets.length === 2) {
        const loserIndex = Math.floor(Math.random() * 2);
        const loser = remainingSets[loserIndex];
        const winner = remainingSets[1 - loserIndex];
      
        setSelectedSet(loser);
        updateSetInStorage(loser);
      
        const loserName = loser.name;
        setTimeout(() => {
          visibleNamesLocal.delete(loserName);
          setVisibleCards(new Set(visibleNamesLocal));
      
          setTimeout(() => {
            setSelectedSet(winner);
            updateSetInStorage(winner);
            setTimeout(() => finishRoll(winner, "hide-reveal"), 500);
          }, finalDelay);
        }, stepDelay);
      
        remainingSets = [winner];
      }
    };

    setTimeout(step, 100);
  };

  const handleReverseRevealRoll = (totalDurationMs: number) => {
    const enabledSets = shuffledHeroSets.filter(
      (set) => !disabledSets.has(set.name)
    );
    const setsToUse = enabledSets.length > 0 ? enabledSets : shuffledHeroSets;

    const startTime = performance.now();
    let remainingSets = [...setsToUse];
    const revealedLocal = new Set<string>();

    const step = () => {
      const progress = computeProgress(startTime, totalDurationMs);

      const baseSpeed = computeBaseSpeed(totalDurationMs);
      const minDelayMs = baseSpeed * 0.5;
      const maxDelayMs = baseSpeed * 2;

      const currentDelay = getEasedDelay(minDelayMs, maxDelayMs, progress);
      const stepDelay = delayFromDuration(totalDurationMs);
      const finalDelay = Math.min(2000, stepDelay * 10);

      if (remainingSets.length > 2) {
        const randomIndex = Math.floor(Math.random() * remainingSets.length);
        const currentSet = remainingSets[randomIndex];

        setSelectedSet(currentSet);
        updateSetInStorage(currentSet);

        remainingSets = remainingSets.filter(
          (set) => set.name !== currentSet.name
        );
        setTimeout(() => {
          revealedLocal.add(currentSet.name);
          if (setRevealedCards) {
            setRevealedCards(new Set(revealedLocal));
          }
        }, stepDelay);

        const delayNext = Math.max(currentDelay, stepDelay + 50);
        setTimeout(step, delayNext);
      } else if (remainingSets.length === 2) {
        const loserIndex = Math.floor(Math.random() * 2);
        const loser = remainingSets[loserIndex];
        const winner = remainingSets[1 - loserIndex];
      
        setSelectedSet(loser);
        updateSetInStorage(loser);
      
        setTimeout(() => {
          revealedLocal.add(loser.name);
          if (setRevealedCards) {
            setRevealedCards(new Set(revealedLocal));
          }
      
          setTimeout(() => {
            setSelectedSet(winner);
            updateSetInStorage(winner);
            revealedLocal.add(winner.name);
            if (setRevealedCards) {
              setRevealedCards(new Set(revealedLocal));
            }
            setTimeout(() => finishRoll(winner, "reverse-reveal"), 500);
          }, finalDelay);
        }, stepDelay);
      
        remainingSets = [winner];
      }
      
    };

    setTimeout(step, 100);
  };

  const handleOriginalRoll = (totalDurationMs: number) => {
    const startTime = performance.now();

    const step = () => {
      const progress = computeProgress(startTime, totalDurationMs);
      const currentDelay = getEasedDelay(ORIGINAL_MIN_DELAY, ORIGINAL_MAX_DELAY, progress);

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

    setTimeout(step, ORIGINAL_MIN_DELAY);
  };

  return {
    handleLeftToRightRoll,
    handleRightToLeftRoll,
    handleUpToDownRoll,
    handleBottomToTopRoll,
    handleHideRevealRoll,
    handleReverseRevealRoll,
    handleOriginalRoll,
  };
};
