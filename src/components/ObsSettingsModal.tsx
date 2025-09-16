// src/components/ObsSettingsModal.tsx
import React, { useEffect, useState } from 'react';

export interface ObsSettings {
  plain: boolean;
  bgColor?: string; // Hex color, e.g. #000000
  bgOpacity?: number; // 0..1
}

interface ObsSettingsModalProps {
  open: boolean;
  initialSettings: ObsSettings;
  onClose: () => void;
  onSave: (settings: ObsSettings) => void;
}

const ObsSettingsModal: React.FC<ObsSettingsModalProps> = ({ open, initialSettings, onClose, onSave }) => {
  const [plain, setPlain] = useState<boolean>(initialSettings.plain);
  const [bgColor, setBgColor] = useState<string>(initialSettings.bgColor ?? '#000000');
  const [bgOpacity, setBgOpacity] = useState<number>(typeof initialSettings.bgOpacity === 'number' ? initialSettings.bgOpacity : 0.8);

  useEffect(() => {
    setPlain(initialSettings.plain);
    setBgColor(initialSettings.bgColor ?? '#000000');
    setBgOpacity(typeof initialSettings.bgOpacity === 'number' ? initialSettings.bgOpacity : 0.8);
  }, [initialSettings]);

  if (!open) return null;

  const backgroundWithAlpha = plain
    ? 'transparent'
    : `${bgColor}${Math.round(bgOpacity * 255).toString(16).padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-10 w-full max-w-3xl mx-4 rounded-lg border-2 border-yellow-400/40 bg-black/80 backdrop-blur-sm p-6 text-white">
        <h2 className="text-xl font-bold mb-4">Настройки OBS</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="space-y-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={plain}
                onChange={(e) => setPlain(e.target.checked)}
                className="h-4 w-4"
              />
              <span>Прозрачный режим (без фона)</span>
            </label>
            {!plain && (
              <>
                <div className="flex items-center justify-between gap-4">
                  <label className="text-sm text-white/80">Цвет фона</label>
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="h-8 w-12 bg-transparent border border-white/30 rounded"
                    title="Цвет фона"
                  />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <label className="text-sm text-white/80">Прозрачность</label>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={bgOpacity}
                    onChange={(e) => setBgOpacity(parseFloat(e.target.value))}
                    className="w-40"
                  />
                  <span className="w-12 text-right text-sm">{Math.round(bgOpacity * 100)}%</span>
                </div>
              </>
            )}
            <div className="mt-6 flex justify-start gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded border border-white/30 hover:border-white/60"
              >
                Отмена
              </button>
              <button
                onClick={() => onSave({ plain, bgColor, bgOpacity })}
                className="px-4 py-2 rounded font-semibold bg-blue-500/80 border border-blue-400/60 hover:bg-blue-400/90"
              >
                Сохранить
              </button>
            </div>
          </div>
          <div className="md:pl-2">
            <div
              className="rounded-lg p-4 text-center"
              style={{
                backgroundColor: backgroundWithAlpha,
                background: backgroundWithAlpha,
                minHeight: '160px'
              }}
            >
              <h3 className="font-semibold text-lg mb-2">Текущие герои</h3>
              <h4 className="text-yellow-300 font-bold text-base mb-4">Название набора</h4>
              <div className="flex justify-center items-center gap-3">
                {[0,1,2].map((i) => (
                  <div
                    key={i}
                    className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white/80"
                  >
                    {i+1}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ObsSettingsModal;


