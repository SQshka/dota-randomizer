// src/App.tsx
import { useMemo, useState } from 'react';
import { heroSets } from './data/heroSets';
import backgroundImage from './assets/img/the-international-2025-wallpaper-v0-42ifx3d9h78f1.webp';
import { useRollLogic } from './hooks/useRollLogic';
import { useLocalStorage } from './hooks/useLocalStorage';
import { createRollHandlers } from './utils/rollHandlers';
import RollControls from './components/RollControls';
import CurrentResult from './components/CurrentResult';
import HeroGrid from './components/HeroGrid';
import ResetButton from './components/ResetButton';

function App() {
  const [durationInput, setDurationInput] = useState<string>('10');
  const [obsCopied, setObsCopied] = useState(false);

  // Custom hooks
  const {
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
  } = useRollLogic();

  const {
    setStats,
    setSetStats,
    disabledSets,
    setDisabledSets,
    resetStats
  } = useLocalStorage();

  // Create roll handlers
  const rollHandlers = createRollHandlers(
    disabledSets,
    setSelectedSet,
    updateSetInStorage,
    (final, rollType) => {
      setSetStats(prev => ({
        ...prev,
        [final.name]: (prev[final.name] ?? 0) + 1,
      }));
      finishRoll(final, rollType);
    },
    getRandomSet,
    getTopToBottomOrder,
    getColumnByColumnOrder,
    setVisibleCards
  );

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setSelectedSet(null);

    // Shuffle hero positions for each roll
    setShuffledHeroSets(shuffleArray(heroSets));

    // Select random roll type
    const rollType = getRandomRollType();

    // Only reset visible cards for hide-reveal roll
    if (rollType === 'hide-reveal') {
      setVisibleCards(new Set(heroSets.map(set => set.name)));
    }

    const durationSeconds = durationInput.trim() === '' ? 10 : parseInt(durationInput, 10);
    const totalDurationMs = Math.max(10000, durationSeconds * 1000);

    switch (rollType) {
      case 'left-to-right':
        rollHandlers.handleLeftToRightRoll(totalDurationMs);
        break;
      case 'up-to-down':
        rollHandlers.handleUpToDownRoll(totalDurationMs);
        break;
      case 'hide-reveal':
        rollHandlers.handleHideRevealRoll(totalDurationMs);
        break;
      case 'right-to-left':
        rollHandlers.handleRightToLeftRoll(totalDurationMs);
        break;
      case 'bottom-to-top':
        rollHandlers.handleBottomToTopRoll(totalDurationMs);
        break;
      default:
        rollHandlers.handleOriginalRoll(totalDurationMs);
    }
  };

  // Calculate total rolls for percentage
  const totalSetRolls = useMemo(() => {
    return Object.values(setStats).reduce((sum, n) => sum + n, 0);
  }, [setStats]);

  // Copy hero URL to clipboard
  const copyHeroUrl = async () => {
    if (!selectedSet) {
      alert('No heroes selected! Please roll for heroes first.');
      return;
    }

    const baseUrl = window.location.origin;
    const heroUrls = selectedSet.heroes.join(',');
    const heroUrl = `${baseUrl}/dota-randomizer/heroes?name=${encodeURIComponent(selectedSet.name)}&heroes=${encodeURIComponent(heroUrls)}`;

    try {
      await navigator.clipboard.writeText(heroUrl);
      setObsCopied(true);
      setTimeout(() => setObsCopied(false), 2000); 
    } catch (err) {
      console.error('Failed to copy hero URL:', err);
      alert('Failed to copy hero URL to clipboard');
    }
  };

  // Toggle set disabled state
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
      
      {/* Current Result Display */}
      <CurrentResult
        selectedSet={selectedSet}
        obsCopied={obsCopied}
        onCopyHeroUrl={copyHeroUrl}
      />
      
      <div className="relative z-10 w-full flex flex-col items-center">
        {/* Roll Controls */}
        <RollControls
          durationInput={durationInput}
          setDurationInput={setDurationInput}
          isSpinning={isSpinning}
          onSpin={handleSpin}
        />
        
        {/* Hero Grid */}
        <HeroGrid
          shuffledHeroSets={shuffledHeroSets}
          selectedSet={selectedSet}
          setStats={setStats}
          totalSetRolls={totalSetRolls}
          visibleCards={visibleCards}
          disabledSets={disabledSets}
          onToggleDisabled={toggleSetDisabled}
        />
        
        {/* Reset Button */}
        <ResetButton
          isSpinning={isSpinning}
          onReset={resetStats}
        />
      </div>
    </div>
  );
}

export default App;