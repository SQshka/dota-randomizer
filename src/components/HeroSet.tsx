// src/components/HeroSet.tsx
import React, { useState } from 'react';
import dota2Logo from '../assets/img/dota2.png';

interface HeroSetProps {
  name: string;
  heroes: string[];
  isSelected: boolean;
  percentage?: number;
  isDisabled?: boolean;
  onToggleDisabled?: () => void;
  appearanceMode?: 'normal' | 'reverse';
  isRevealed?: boolean;
}

/**
 * HeroSet
 * Card for a single hero set. Supports disabled state, selection styling,
 * and a back-face when used in reverse-reveal mode.
 */
const HeroSet: React.FC<HeroSetProps> = ({ name, heroes, isSelected, percentage = 0, isDisabled = false, onToggleDisabled, appearanceMode = 'normal', isRevealed = true }) => {
  const [obsCopied, setObsCopied] = useState(false);

  const handleClick = () => {
    if (onToggleDisabled) {
      onToggleDisabled();
    }
  };

  const handleCopyObsUrl: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.stopPropagation();
    try {
      const baseUrl = window.location.origin;
      const heroUrls = heroes.join(',');
      let plain = true;
      let bgColor: string | undefined;
      let bgOpacity: number | undefined;
      try {
        const raw = localStorage.getItem('obsSettings');
        if (raw) {
          const parsed = JSON.parse(raw) as { plain?: boolean; bgColor?: string; bgOpacity?: number };
          if (typeof parsed.plain === 'boolean') plain = parsed.plain;
          if (typeof parsed.bgColor === 'string') bgColor = parsed.bgColor;
          if (typeof parsed.bgOpacity === 'number') bgOpacity = parsed.bgOpacity;
        }
      } catch { /* noop */ }
      const params: string[] = [];
      if (plain) {
        params.push('plain=1');
      } else {
        if (bgColor) params.push(`bgColor=${encodeURIComponent(bgColor)}`);
        if (typeof bgOpacity === 'number') params.push(`bgOpacity=${encodeURIComponent(String(bgOpacity))}`);
      }
      const queryTail = params.length ? `&${params.join('&')}` : '';
      const heroUrl = `${baseUrl}/dota-randomizer/heroes?name=${encodeURIComponent(name)}&heroes=${encodeURIComponent(heroUrls)}${queryTail}`;
      await navigator.clipboard.writeText(heroUrl);
      setObsCopied(true);
      setTimeout(() => setObsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy hero URL:', err);
      alert('Failed to copy hero URL to clipboard');
    }
  };

  const showBack = appearanceMode === 'reverse' && !isRevealed;
  const showPercentage = appearanceMode !== 'reverse' || isRevealed;

  return (
    <div
      onClick={handleClick}
      className={`
        relative p-4 rounded-lg shadow-lg transition-transform duration-300 cursor-pointer
        backdrop-blur-sm border-2
        ${isDisabled 
          ? 'bg-gray-600/40 border-gray-500/50 opacity-50' 
          : 'bg-black/40 border-white/0 hover:scale-105 hover:border-white/50'
        }
        ${isSelected && !isDisabled ? 'scale-105 border-transparent hover:border-transparent' : ''}
      `}
      style={undefined}
    >
      {showPercentage && (
        <div className="absolute top-2 right-2 bg-black/60 text-yellow-300 text-xs font-bold px-2 py-1 rounded" title="Процент ролла">
          {Math.round(percentage)}%
        </div>
      )}
      {(appearanceMode !== 'reverse' || isRevealed) && (
        <button
          onClick={handleCopyObsUrl}
          className={`absolute bottom-2 right-2 px-2 py-1 rounded text-xs font-medium border transition-all duration-200 focus:outline-none focus:ring-0 ${
            obsCopied
              ? 'bg-green-500/80 text-white border-green-400/50'
              : 'bg-blue-500/80 text-white border-blue-400/50 hover:bg-blue-400/90 hover:scale-105'
          }`}
          title="Copy Hero URL for OBS"
        >
          {obsCopied ? 'Copied' : 'OBS'}
        </button>
      )}
      {isDisabled && (
        <div className="absolute top-2 left-2 bg-red-600/80 text-white text-xs font-bold px-2 py-1 rounded" title="Отключен">
          ✕
        </div>
      )}

      {showBack ? (
        <div className="flex justify-center items-center mb-2">
          {[0,1,2].map((i) => (
            <img
              key={i}
              src={dota2Logo}
              alt="Dota 2"
              className="w-16 h-16 rounded-full mx-1 border-2 border-white/30 object-cover object-center shrink-0 bg-black/40"
            />
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center mb-2">
          {heroes.map((hero, index) => (
            <img
              key={index}
              src={hero}
              alt={name}
              className="w-16 h-16 rounded-full mx-1 border-2 border-white object-cover object-center shrink-0"
            />
          ))}
        </div>
      )}
      {(appearanceMode !== 'reverse' || isRevealed) && (
        <h3 className="text-sm font-semibold text-center text-white">
          {name}
        </h3>
      )}
    </div>
  );
};

export default HeroSet;