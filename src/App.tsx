// src/App.tsx
import { useEffect, useMemo, useState } from 'react';
import HeroSet from './components/HeroSet';
import { heroSets } from './data/heroSets';
import backgroundImage from './assets/img/the-international-2025-wallpaper-v0-42ifx3d9h78f1.webp';

function App() {
  const [selectedSet, setSelectedSet] = useState<typeof heroSets[0] | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [finalResultText, setFinalResultText] = useState<string | null>(null);
  const [setStats, setSetStats] = useState<Record<string, number>>({});
  const [isStatsLoaded, setIsStatsLoaded] = useState(false);
  const [durationInput, setDurationInput] = useState<string>('3'); // Default 3 seconds
  const [disabledSets, setDisabledSets] = useState<Set<string>>(new Set());

  const getRandomSet = () => {
    const enabledSets = heroSets.filter(set => !disabledSets.has(set.name));
    if (enabledSets.length === 0) {
      const randomIndex = Math.floor(Math.random() * heroSets.length);
      return heroSets[randomIndex];
    }
    const randomIndex = Math.floor(Math.random() * enabledSets.length);
    return enabledSets[randomIndex];
  };

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setSelectedSet(null);
    setFinalResultText(null);

    const durationSeconds = durationInput.trim() === '' ? 3 : parseInt(durationInput, 10);
    const totalDurationMs = Math.max(1000, durationSeconds * 1000); 
    const minDelayMs = 60; // начальная скорость (быстро)
    const maxDelayMs = 350; // финальная скорость (медленно)

    const startTime = performance.now();

    const step = () => {
      const now = performance.now();
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / totalDurationMs);

      // easeOutCubic: быстро вначале, замедляясь к концу
      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
      const eased = easeOutCubic(progress);

      // Чем больше прогресс, тем больше задержка между сменами (т.е. медленнее)
      const currentDelay = minDelayMs + (maxDelayMs - minDelayMs) * eased;

      // Меняем подсветку набора
      setSelectedSet(getRandomSet());

      if (progress < 1) {
        setTimeout(step, currentDelay);
      } else {
        // Финальный выбор
        const final = getRandomSet();
        setSelectedSet(final);
        setFinalResultText(`Результат: ${final.name}`);
        // Обновляем статистику сетов (процент выпадения каждого набора)
        setSetStats(prev => ({
          ...prev,
          [final.name]: (prev[final.name] ?? 0) + 1,
        }));
        setIsSpinning(false);
      }
    };

    // Первый шаг сразу
    setTimeout(step, minDelayMs);
  };

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

  // Функция для переключения состояния сета
  const toggleSetDisabled = (setName: string) => {
    setDisabledSets(prev => {
      const newSet = new Set(prev);
      if (newSet.has(setName)) {
        newSet.delete(setName);
      } else {
        newSet.add(setName);
      }
      return newSet;
    });
  };

  // Вспомогательные расчёты
  const totalSetRolls = useMemo(() => {
    return Object.values(setStats).reduce((sum, n) => sum + n, 0);
  }, [setStats]);

  return (
    <div 
      className="min-h-screen py-12 flex flex-col items-center relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative z-10 w-full flex flex-col items-center">
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
             Длительность вращения (секунды):
           </label>
           <div className="flex items-center gap-3">
             <input
               type="number"
               value={durationInput}
               onChange={(e) => setDurationInput(e.target.value)}
               disabled={isSpinning}
               min="1"
               placeholder="3"
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
      </div>
      
      <button
        onClick={handleSpin}
        disabled={isSpinning}
        className={`
          px-8 py-4 mb-12 rounded-full font-bold text-xl
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

      {!isSpinning && finalResultText && (
        <div className="mb-8 text-center">
          <p className="text-2xl font-bold text-yellow-300 drop-shadow-sm">{finalResultText}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 w-full px-4">
        {heroSets.map((set, index) => {
          const count = setStats[set.name] ?? 0;
          const percent = totalSetRolls > 0 ? (count / totalSetRolls) * 100 : 0;
          return (
            <HeroSet
              key={index}
              name={set.name}
              heroes={set.heroes}
              isSelected={selectedSet?.name === set.name}
              percentage={percent}
              isDisabled={disabledSets.has(set.name)}
              onToggleDisabled={() => toggleSetDisabled(set.name)}
            />
          );
        })}
      </div>
      
      {/* Reset Stats Button */}
      <button
        onClick={() => {
          setSetStats({});
          setDisabledSets(new Set());
          localStorage.removeItem('setStats');
          localStorage.removeItem('disabledSets');
        }}
        disabled={isSpinning}
        className={`
          px-3 py-1.5 rounded text-xs font-medium mt-8
          transition-all duration-200 backdrop-blur-sm border
          ${isSpinning 
            ? 'bg-gray-500/50 text-gray-400 cursor-not-allowed border-gray-400/30'
            : 'bg-red-500/80 text-white border-red-400/50 hover:bg-red-400/90 hover:border-red-300/70 hover:scale-105'
          }
        `}
      >
        Сброс статистики и настроек
      </button>
      </div>
    </div>
  );
}

export default App;