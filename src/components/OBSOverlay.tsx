// src/components/OBSOverlay.tsx
import { useEffect, useState } from 'react';

interface HeroSet {
  name: string;
  heroes: string[];
}

const OBSOverlay = () => {
  const [selectedSet, setSelectedSet] = useState<HeroSet | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Listen for custom events to sync with main app (same tab)
  useEffect(() => {
    const handleSetChange = (event: CustomEvent) => {
      setSelectedSet(event.detail);
      setIsConnected(true);
    };

    window.addEventListener('heroSetChanged', handleSetChange as EventListener);
    
    return () => {
      window.removeEventListener('heroSetChanged', handleSetChange as EventListener);
    };
  }, []);

  // Listen for localStorage changes for cross-tab synchronization
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'currentSelectedSet' && event.newValue) {
        try {
          const parsed = JSON.parse(event.newValue);
          setSelectedSet(parsed);
          setIsConnected(true);
        } catch { /* noop */ }
      }
    };

    // Also listen for our custom update trigger
    const handleCustomStorageChange = () => {
      try {
        const currentSetRaw = localStorage.getItem('currentSelectedSet');
        if (currentSetRaw) {
          const parsed = JSON.parse(currentSetRaw);
          setSelectedSet(parsed);
          setIsConnected(true);
        }
      } catch { /* noop */ }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Poll for updates (fallback for same-origin issues)
    const interval = setInterval(handleCustomStorageChange, 100);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
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
          <div className="flex items-center justify-center gap-2 mb-1">
            <h2 className="text-white font-semibold text-sm">Текущие герои</h2>
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} title={isConnected ? 'Подключено' : 'Ожидание подключения'}></div>
          </div>
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
