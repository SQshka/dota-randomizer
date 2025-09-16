// src/App.tsx
import { useEffect, useMemo, useState } from 'react';
import { heroSets } from './data/heroSets';
import backgroundImage from './assets/img/the-international-2025-wallpaper-v0-42ifx3d9h78f1.webp';
import { useRollLogic } from './hooks/useRollLogic';
import { useLocalStorage } from './hooks/useLocalStorage';
import { createRollHandlers } from './utils/rollHandlers';
import RollControls from './components/RollControls';
import CurrentResult from './components/CurrentResult';
import HeroGrid from './components/HeroGrid';
import ResetButton from './components/ResetButton';
import ObsSettingsModal, { type ObsSettings } from './components/ObsSettingsModal';

/**
 * App
 * Main page that orchestrates roll interactions, state, and layout.
 */
function App() {
  const [durationInput, setDurationInput] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('rollDurationSeconds');
      return saved && typeof saved === 'string' ? saved : '10';
    } catch {
      return '10';
    }
  });
  const [obsCopied, setObsCopied] = useState(false);
  const [isObsModalOpen, setIsObsModalOpen] = useState(false);
  const [obsSettings, setObsSettings] = useState<ObsSettings>(() => {
    try {
      const raw = localStorage.getItem('obsSettings');
      if (raw) return JSON.parse(raw) as ObsSettings;
    } catch { /* noop */ }
    return { plain: true };
  });

  // Persist duration to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem('rollDurationSeconds', durationInput || '10');
    } catch { /* noop */ }
  }, [durationInput]);

  // Persist OBS settings
  useEffect(() => {
    try {
      localStorage.setItem('obsSettings', JSON.stringify(obsSettings));
    } catch { /* noop */ }
  }, [obsSettings]);

  const {
    setStats,
    setSetStats,
    disabledSets,
    setDisabledSets,
    resetStats
  } = useLocalStorage();

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
    finishRoll,
    currentRollType,
    setCurrentRollType,
    revealedCards,
    setRevealedCards
  } = useRollLogic(disabledSets);

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setSelectedSet(null);

    const newShuffledSets = shuffleArray(heroSets);
    setShuffledHeroSets(newShuffledSets);

    const rollType = getRandomRollType();
    setCurrentRollType(rollType);

    if (rollType === 'hide-reveal') {
      setVisibleCards(new Set(heroSets.map(set => set.name)));
    }
    if (rollType === 'reverse-reveal') {
      setRevealedCards(new Set());
    }

    const rollHandlers = createRollHandlers(
      disabledSets,
      newShuffledSets,
      setSelectedSet,
      updateSetInStorage,
      (final, rt) => {
        setSetStats(prev => ({
          ...prev,
          [final.name]: (prev[final.name] ?? 0) + 1,
        }));
        finishRoll(final, rt);
      },
      getRandomSet,
      getTopToBottomOrder,
      getColumnByColumnOrder,
      setVisibleCards,
      setRevealedCards
    );

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
      case 'reverse-reveal':
        rollHandlers.handleReverseRevealRoll(totalDurationMs);
        break;
      default:
        rollHandlers.handleOriginalRoll(totalDurationMs);
    }
  };

  const totalSetRolls = useMemo(() => {
    return Object.values(setStats).reduce((sum, n) => sum + n, 0);
  }, [setStats]);

  const copyHeroUrl = async () => {
    if (!selectedSet) {
      alert('No heroes selected! Please roll for heroes first.');
      return;
    }

    const baseUrl = window.location.origin;
    const heroUrls = selectedSet.heroes.join(',');
    const params: string[] = [];
    if (obsSettings.plain) {
      params.push('plain=1');
    } else {
      if (obsSettings.bgColor) params.push(`bgColor=${encodeURIComponent(obsSettings.bgColor)}`);
      if (typeof obsSettings.bgOpacity === 'number') params.push(`bgOpacity=${encodeURIComponent(String(obsSettings.bgOpacity))}`);
    }
    if (obsSettings.showTitle === false) params.push('showTitle=0');
    if (obsSettings.showSetName === false) params.push('showSetName=0');
    const queryTail = params.length ? `&${params.join('&')}` : '';
    const heroUrl = `${baseUrl}/dota-randomizer/heroes?name=${encodeURIComponent(selectedSet.name)}&heroes=${encodeURIComponent(heroUrls)}${queryTail}`;

    try {
      await navigator.clipboard.writeText(heroUrl);
      setObsCopied(true);
      setTimeout(() => setObsCopied(false), 2000); 
    } catch (err) {
      console.error('Failed to copy hero URL:', err);
      alert('Failed to copy hero URL to clipboard');
    }
  };

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
      <a
        href="https://github.com/SQshka"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="SQshka"
        className="absolute bottom-12 right-3 z-20 inline-flex items-center gap-2 px-3 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white transition"
        title="SQshka"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
        >
          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.486 2 12.019c0 4.427 2.865 8.18 6.839 9.504.5.092.683-.217.683-.482 0-.238-.009-.868-.014-1.703-2.782.604-3.369-1.342-3.369-1.342-.455-1.156-1.11-1.464-1.11-1.464-.907-.62.069-.607.069-.607 1.003.07 1.53 1.03 1.53 1.03.892 1.53 2.341 1.088 2.91.833.091-.647.35-1.088.636-1.339-2.22-.253-4.555-1.112-4.555-4.949 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.748-1.026 2.748-1.026.546 1.378.203 2.397.1 2.65.64.7 1.027 1.595 1.027 2.688 0 3.846-2.338 4.694-4.566 4.943.36.31.68.922.68 1.859 0 1.34-.012 2.419-.012 2.75 0 .267.18.579.688.48A10.02 10.02 0 0 0 22 12.02C22 6.486 17.523 2 12 2Z" clipRule="evenodd" />
        </svg>
        <span className="text-sm">SQshka</span>
      </a>
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      
      <CurrentResult
        selectedSet={selectedSet}
        obsCopied={obsCopied}
        onCopyHeroUrl={copyHeroUrl}
      />
      
      <div className="relative z-10 w-full flex flex-col items-center">
        <RollControls
          durationInput={durationInput}
          setDurationInput={setDurationInput}
          isSpinning={isSpinning}
          onSpin={handleSpin}
        />
        <button
          onClick={() => setIsObsModalOpen(true)}
          className="relative z-10 px-4 py-2 -mt-8 mb-8 rounded-full font-medium border-2 border-yellow-300/50 bg-black/40 text-white hover:border-yellow-200/70 hover:scale-105"
        >
          Настройки OBS
        </button>
        
        <HeroGrid
          shuffledHeroSets={shuffledHeroSets}
          selectedSet={selectedSet}
          setStats={setStats}
          totalSetRolls={totalSetRolls}
          visibleCards={visibleCards}
          disabledSets={disabledSets}
          onToggleDisabled={toggleSetDisabled}
          currentRollType={currentRollType}
          revealedCards={revealedCards}
        />
        
        <ResetButton
          isSpinning={isSpinning}
          onReset={resetStats}
        />
        <ObsSettingsModal
          open={isObsModalOpen}
          initialSettings={obsSettings}
          onClose={() => setIsObsModalOpen(false)}
          onSave={(s) => { setObsSettings(s); setIsObsModalOpen(false); }}
        />
      </div>
    </div>
  );
}

export default App;