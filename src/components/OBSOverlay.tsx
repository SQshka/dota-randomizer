// src/components/OBSOverlay.tsx
import { useEffect, useState } from 'react';

interface HeroSet {
  name: string;
  heroes: string[];
}

const OBSOverlay = () => {
  const [selectedSet, setSelectedSet] = useState<HeroSet | null>(null);

  // Listen for custom events to sync with main app
  useEffect(() => {
    const handleSetChange = (event: CustomEvent) => {
      setSelectedSet(event.detail);
    };

    window.addEventListener('heroSetChanged', handleSetChange as EventListener);
    
    return () => {
      window.removeEventListener('heroSetChanged', handleSetChange as EventListener);
    };
  }, []);


  // Load initial selected set from localStorage if available
  useEffect(() => {
    try {
      const currentSetRaw = localStorage.getItem('currentSelectedSet');
      if (currentSetRaw) {
        const parsed = JSON.parse(currentSetRaw);
        setSelectedSet(parsed);
      }
    } catch { /* noop */ }
  }, []);

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
        className="obs-overlay w-screen h-screen flex items-start justify-end p-4" 
        style={{ 
          backgroundColor: 'transparent',
          background: 'transparent',
          margin: 0,
          padding: '16px'
        }}
      >
      <div 
        className="hero-display backdrop-blur-sm border-2 border-yellow-400/50 rounded-lg p-4 shadow-2xl"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          background: 'rgba(0, 0, 0, 0.8)'
        }}
      >
        <div className="text-center">
          <h2 className="text-white font-semibold text-sm mb-1">Текущие герои</h2>
          {selectedSet ? (
            <>
              <h3 className="text-yellow-300 font-bold text-sm mb-2">{selectedSet.name}</h3>
              <div className="flex justify-center items-center gap-1">
                {selectedSet.heroes.map((hero, index) => (
                  <img
                    key={index}
                    src={hero}
                    alt={`Hero ${index + 1}`}
                    className="w-12 h-12 rounded-full border-2 border-yellow-300/50 object-cover object-center"
                  />
                ))}
              </div>
            </>
          ) : (
            <>
              <h3 className="text-gray-400 font-bold text-sm mb-2">Ожидание...</h3>
              <div className="flex justify-center items-center gap-1">
                <div className="w-12 h-12 rounded-full border-2 border-gray-500/50 bg-gray-700/50 flex items-center justify-center">
                  <span className="text-gray-500 text-xs">?</span>
                </div>
                <div className="w-12 h-12 rounded-full border-2 border-gray-500/50 bg-gray-700/50 flex items-center justify-center">
                  <span className="text-gray-500 text-xs">?</span>
                </div>
                <div className="w-12 h-12 rounded-full border-2 border-gray-500/50 bg-gray-700/50 flex items-center justify-center">
                  <span className="text-gray-500 text-xs">?</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default OBSOverlay;
