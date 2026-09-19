import React from 'react';
import { BadgeData } from '../types';
import { PRESET_BADGES } from '../data/presets';
import { AnimalType } from './PixelMouse/animalDensity';
import { Sliders, Download, RotateCcw, Palette, Layers, Globe } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language, translations } from '../i18n/translations';

export interface PixelColorOption {
  id: string;
  name: string;
  hex: string;
  rgb: [number, number, number];
}

export const PIXEL_COLORS: PixelColorOption[] = [
  { id: 'emerald', name: '翡翠竹青绿', hex: '#059669', rgb: [0.020, 0.588, 0.412] },
  { id: 'klein', name: '克莱因蔚蓝', hex: '#1d4ed8', rgb: [0.114, 0.306, 0.847] },
  { id: 'slate', name: '极简冷灰色', hex: '#64748b', rgb: [0.392, 0.455, 0.545] },
  { id: 'noir', name: '曜石石墨黑', hex: '#18181b', rgb: [0.094, 0.094, 0.106] },
  { id: 'violet', name: '暮光丁香紫', hex: '#7c3aed', rgb: [0.486, 0.227, 0.929] },
  { id: 'amber', name: '加州晨曦橙', hex: '#ea580c', rgb: [0.918, 0.345, 0.047] }
];

interface ControlToolbarProps {
  currentBadge: BadgeData;
  onSelectPreset: (badge: BadgeData) => void;
  onShake: () => void;
  onOpenCustomizer: () => void;
  onExportImages: () => void;
  gravity: [number, number, number];
  onToggleGravity: () => void;
  currentAnimal: AnimalType;
  onSelectAnimal: (animal: AnimalType) => void;
  currentColor: PixelColorOption;
  onSelectColor: (color: PixelColorOption) => void;
  lang: Language;
  onToggleLanguage: () => void;
}

export const ControlToolbar: React.FC<ControlToolbarProps> = ({
  currentBadge,
  onSelectPreset,
  onShake,
  onOpenCustomizer,
  onExportImages,
  gravity,
  onToggleGravity,
  currentAnimal,
  onSelectAnimal,
  currentColor,
  onSelectColor,
  lang,
  onToggleLanguage
}) => {
  const [showTip, setShowTip] = React.useState(true);
  const t = translations[lang];

  const triggerExport = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.88 },
      colors: [currentColor.hex, '#111111', '#888888']
    });
    onExportImages();
  };

  const getGravityLabel = () => {
    if (gravity[1] > -10) return t.header.gravity.space;
    if (gravity[1] > -25) return t.header.gravity.moon;
    if (gravity[1] < -60) return t.header.gravity.heavy;
    return t.header.gravity.earth;
  };

  return (
    <>
      {/* Top Minimalist Header */}
      <header className="fixed top-6 left-6 right-6 z-40 flex items-center justify-between pointer-events-none">
        {/* Left Brand Badge */}
        <div className="flex items-center gap-2.5 bg-white/85 backdrop-blur-2xl border border-black/[0.08] px-3.5 py-1.5 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.06)] pointer-events-auto transition-all">
          <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center text-white shadow-xs">
            <Layers className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-neutral-900 tracking-tight">
              {t.brand.title}
            </span>
            <span className="w-1 h-1 rounded-full bg-neutral-300" />
            <span className="text-[11px] font-normal text-neutral-500 tracking-normal">
              {t.brand.subtitle}
            </span>
          </div>
        </div>

        {/* Center: Animal Silhouette & Pixel Color Switcher */}
        <div className="hidden md:flex items-center gap-2 bg-white/85 backdrop-blur-2xl border border-black/[0.08] p-1.5 px-3 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.06)] pointer-events-auto">
          {/* Animal Selector */}
          <span className="text-[11px] font-semibold text-neutral-400 pl-1 pr-1">{t.header.animalLabel}</span>
          {[
            { id: 'deer', label: t.header.animals.deer },
            { id: 'whale', label: t.header.animals.whale },
            { id: 'fox', label: t.header.animals.fox }
          ].map(item => {
            const isCur = currentAnimal === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectAnimal(item.id as AnimalType)}
                className={`px-2.5 py-1 rounded-full text-xs transition-all cursor-pointer ${
                  isCur
                    ? 'bg-neutral-900 text-white font-medium shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-black/[0.04]'
                }`}
              >
                {item.label}
              </button>
            );
          })}

          <div className="w-[1px] h-4 bg-black/10 mx-1" />

          {/* Pixel Color Swatches */}
          <span className="text-[11px] font-semibold text-neutral-400 pr-1">{t.header.colorLabel}</span>
          <div className="flex items-center gap-1.5">
            {PIXEL_COLORS.map(c => {
              const isCur = currentColor.id === c.id;
              const colorName = t.header.colors[c.id as keyof typeof t.header.colors] || c.name;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onSelectColor(c)}
                  className={`relative w-6 h-6 rounded-full transition-all cursor-pointer flex items-center justify-center shadow-xs ${
                    isCur
                      ? 'scale-110 ring-2 ring-neutral-900 ring-offset-2 ring-offset-white'
                      : 'hover:scale-110 opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={`${colorName} (${c.hex})`}
                  aria-label={`${t.header.colorLabel} ${colorName}`}
                >
                  {isCur && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Bilingual Language Switcher */}
          <button
            onClick={onToggleLanguage}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/85 backdrop-blur-2xl border border-black/[0.08] hover:border-black/20 text-xs font-medium text-neutral-700 hover:text-black transition-all shadow-[0_8px_30px_rgba(0,0,0,0.04)] cursor-pointer"
            title={lang === 'zh' ? 'Switch to English' : '切换为中文'}
            aria-label="Toggle language"
          >
            <Globe className="w-3.5 h-3.5 text-neutral-500" />
            <span className="font-semibold text-[11px] tracking-wide">{lang === 'zh' ? 'EN' : '中'}</span>
          </button>

          {/* Gravity Pill */}
          <button
            onClick={onToggleGravity}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/85 backdrop-blur-2xl border border-black/[0.08] hover:border-black/20 text-xs font-medium text-neutral-700 hover:text-black transition-all shadow-[0_8px_30px_rgba(0,0,0,0.04)] cursor-pointer"
            title={lang === 'zh' ? '点击切换重力参数' : 'Click to cycle gravity'}
          >
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: currentColor.hex }}
            />
            <span>{getGravityLabel()}</span>
          </button>

          {/* Customize Button */}
          <button
            onClick={onOpenCustomizer}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-black text-white hover:bg-neutral-800 text-xs font-medium transition-all shadow-[0_8px_20px_rgba(0,0,0,0.15)] cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-white" />
            <span>{t.header.customizeBtn}</span>
          </button>
        </div>
      </header>

      {/* Floating Gentle Tip */}
      {showTip && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-2xl border border-black/[0.08] text-[12px] text-neutral-700 shadow-[0_12px_32px_rgba(0,0,0,0.08)]">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: currentColor.hex }}
            />
            <span>{t.header.tip}</span>
            <button
              onClick={() => setShowTip(false)}
              className="ml-2 text-neutral-400 hover:text-neutral-800 text-xs cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Bottom Main Floating Toolbar */}
      <div className="fixed bottom-7 left-1/2 -translate-x-1/2 z-40 w-auto max-w-[95vw] pointer-events-none">
        <div className="bg-white/85 backdrop-blur-3xl border border-black/[0.08] rounded-full p-2 px-3 shadow-[0_16px_40px_rgba(0,0,0,0.08)] flex items-center gap-2 pointer-events-auto">
          {/* Preset Segmented Selector */}
          <div className="flex items-center gap-1 bg-neutral-100/80 p-1 rounded-full border border-black/[0.04]">
            {PRESET_BADGES.map(preset => {
              const isSelected = currentBadge.id === preset.id;
              const displayName = lang === 'en'
                ? (preset.englishName ? preset.englishName.split(' ')[0] : preset.name)
                : preset.name;
              return (
                <button
                  key={preset.id}
                  onClick={() => onSelectPreset(preset)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-black text-white shadow-sm'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-black/[0.04]'
                  }`}
                >
                  {displayName}
                </button>
              );
            })}
          </div>

          <div className="w-[1px] h-5 bg-black/10 mx-1" />

          {/* Gentle Impulse / Swing */}
          <button
            onClick={onShake}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/[0.03] hover:bg-black/[0.07] border border-black/[0.06] text-xs font-medium text-neutral-800 transition-all cursor-pointer"
            title={lang === 'zh' ? '给工牌施加轻微物理摆动冲量' : 'Apply gentle physics impulse'}
          >
            <RotateCcw className="w-3.5 h-3.5 text-neutral-600" />
            <span>{t.dock.swingBadge}</span>
          </button>

          {/* Export PNG */}
          <button
            onClick={triggerExport}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/[0.06] hover:bg-black/[0.12] border border-black/[0.08] text-xs font-medium text-neutral-900 transition-all cursor-pointer"
            title={lang === 'zh' ? '导出当前工牌高清图片' : 'Export high-res badge images'}
          >
            <Download className="w-3.5 h-3.5 text-neutral-700" />
            <span>{t.dock.export}</span>
          </button>
        </div>
      </div>
    </>
  );
};
