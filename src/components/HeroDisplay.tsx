// src/components/HeroDisplay.tsx
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

interface HeroSet {
  name: string;
  heroes: string[];
}

/**
 * HeroDisplay
 * OBS-friendly view that reads the current hero set from URL params
 * and renders a compact, transparent overlay.
 */
const HeroDisplay = () => {
  const [searchParams] = useSearchParams();
  const [heroSet, setHeroSet] = useState<HeroSet | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPlain, setIsPlain] = useState<boolean>(false);
  const [bgColor, setBgColor] = useState<string>('#000000');
  const [bgOpacity, setBgOpacity] = useState<number>(0.8);

  useEffect(() => {
    try {
      const name = searchParams.get('name');
      const heroes = searchParams.get('heroes');
      
      const plainParam = searchParams.get('plain');
      const isPlainLocal = plainParam === '1' || plainParam === 'true';
      setIsPlain(isPlainLocal);

      if (!isPlainLocal) {
        const bgColorParam = searchParams.get('bgColor');
        const bgOpacityParam = searchParams.get('bgOpacity');
        if (bgColorParam && /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(bgColorParam)) {
          setBgColor(bgColorParam);
        }
        if (bgOpacityParam) {
          const parsed = parseFloat(bgOpacityParam);
          if (!Number.isNaN(parsed) && parsed >= 0 && parsed <= 1) {
            setBgOpacity(parsed);
          }
        }
      }

      if (name && heroes) {
        const heroUrls = heroes.split(',');
        setHeroSet({ name, heroes: heroUrls });
        setError(null);
      } else {
        setError('No hero data found in URL');
      }
    } catch {
      setError('Invalid hero data in URL');
    }
  }, [searchParams]);

  return (
    <>
      {isPlain && (
        <style>
          {`
            html, body, #root {
              background-color: transparent !important;
              background: transparent !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            * {
              background-color: transparent !important;
              background: transparent !important;
            }
          `}
        </style>
      )}
      <div 
        className="w-screen h-screen flex items-center justify-center p-4" 
        style={isPlain ? {
          backgroundColor: 'transparent',
          background: 'transparent',
          margin: 0,
          padding: '16px'
        } : { margin: 0, padding: '16px' }}
      >
        <div 
          className={`${isPlain ? '' : 'backdrop-blur-sm'} rounded-lg p-6 text-center`}
          style={isPlain ? { minWidth: '300px' } : {
            backgroundColor: `${bgColor}${Math.round(bgOpacity * 255).toString(16).padStart(2, '0')}`,
            background: `${bgColor}${Math.round(bgOpacity * 255).toString(16).padStart(2, '0')}`,
            minWidth: '300px'
          }}
        >
          {error ? (
            <>
              <h2 className="text-red-400 font-bold text-lg mb-4">Error</h2>
              <p className="text-red-300 text-sm">{error}</p>
            </>
          ) : heroSet ? (
            <>
              <h2 className={`font-semibold text-lg mb-2 ${isPlain ? 'text-white' : 'text-white'}`}>Текущие герои</h2>
              <h3 className={`${isPlain ? 'text-white' : 'text-yellow-300'} font-bold text-xl mb-4`}>{heroSet.name}</h3>
              <div className="flex justify-center items-center gap-3">
                {heroSet.heroes.map((hero, index) => (
                  <img
                    key={index}
                    src={hero}
                    alt={`Hero ${index + 1}`}
                    className="w-16 h-16 rounded-full object-cover object-center"
                  />
                ))}
              </div>
            </>
          ) : (
            <>
              <h2 className="text-gray-400 font-bold text-lg mb-4">Загрузка...</h2>
              <div className="flex justify-center items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-gray-700/50 flex items-center justify-center">
                  <span className="text-gray-500 text-sm">?</span>
                </div>
                <div className="w-16 h-16 rounded-full bg-gray-700/50 flex items-center justify-center">
                  <span className="text-gray-500 text-sm">?</span>
                </div>
                <div className="w-16 h-16 rounded-full bg-gray-700/50 flex items-center justify-center">
                  <span className="text-gray-500 text-sm">?</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default HeroDisplay;
