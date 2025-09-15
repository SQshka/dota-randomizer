// src/hooks/useLocalStorage.ts
import { useEffect, useState } from 'react';

export const useLocalStorage = () => {
  const [setStats, setSetStats] = useState<Record<string, number>>({});
  const [isStatsLoaded, setIsStatsLoaded] = useState(false);
  const [disabledSets, setDisabledSets] = useState<Set<string>>(new Set());

  // Загружаем статистику сетов и отключенные сеты из localStorage при монтировании
  useEffect(() => {
    try {
      const raw = localStorage.getItem('setStats');
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, number>;
        setSetStats(parsed);
      }
      
      const disabledRaw = localStorage.getItem('disabledSets');
      if (disabledRaw) {
        const parsed = JSON.parse(disabledRaw) as string[];
        setDisabledSets(new Set(parsed));
      }
      
      setIsStatsLoaded(true);
    } catch { /* noop */ }
  }, []);

  // Сохраняем статистику сетов в localStorage при изменении
  useEffect(() => {
    if (!isStatsLoaded) return;
    try {
      localStorage.setItem('setStats', JSON.stringify(setStats));
    } catch { /* noop */ }
  }, [setStats, isStatsLoaded]);

  // Сохраняем отключенные сеты в localStorage при изменении
  useEffect(() => {
    if (!isStatsLoaded) return;
    try {
      localStorage.setItem('disabledSets', JSON.stringify(Array.from(disabledSets)));
    } catch { /* noop */ }
  }, [disabledSets, isStatsLoaded]);

  const resetStats = () => {
    setSetStats({});
    setDisabledSets(new Set());
    localStorage.removeItem('setStats');
    localStorage.removeItem('disabledSets');
  };

  return {
    setStats,
    setSetStats,
    disabledSets,
    setDisabledSets,
    resetStats
  };
};
