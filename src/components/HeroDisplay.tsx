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

  useEffect(() => {
    try {
      const name = searchParams.get('name');
      const heroes = searchParams.get('heroes');
      
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
          .hero-display {
            background-color: rgba(0, 0, 0, 0.8) !important;
            background: rgba(0, 0, 0, 0.8) !important;
          }
        `}
      </style>
      <div 
        className="hero-display w-screen h-screen flex items-center justify-center p-4" 
        style={{ 
          backgroundColor: 'transparent',
          background: 'transparent',
          margin: 0,
          padding: '16px'
        }}
      >
        <div 
          className="hero-display backdrop-blur-sm border-2 border-yellow-400/50 rounded-lg p-6 shadow-2xl text-center"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            background: 'rgba(0, 0, 0, 0.8)',
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
              <h2 className="text-white font-semibold text-lg mb-2">Текущие герои</h2>
              <h3 className="text-yellow-300 font-bold text-xl mb-4">{heroSet.name}</h3>
              <div className="flex justify-center items-center gap-3">
                {heroSet.heroes.map((hero, index) => (
                  <img
                    key={index}
                    src={hero}
                    alt={`Hero ${index + 1}`}
                    className="w-16 h-16 rounded-full border-2 border-yellow-300/50 object-cover object-center"
                  />
                ))}
              </div>
            </>
          ) : (
            <>
              <h2 className="text-gray-400 font-bold text-lg mb-4">Загрузка...</h2>
              <div className="flex justify-center items-center gap-3">
                <div className="w-16 h-16 rounded-full border-2 border-gray-500/50 bg-gray-700/50 flex items-center justify-center">
                  <span className="text-gray-500 text-sm">?</span>
                </div>
                <div className="w-16 h-16 rounded-full border-2 border-gray-500/50 bg-gray-700/50 flex items-center justify-center">
                  <span className="text-gray-500 text-sm">?</span>
                </div>
                <div className="w-16 h-16 rounded-full border-2 border-gray-500/50 bg-gray-700/50 flex items-center justify-center">
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
