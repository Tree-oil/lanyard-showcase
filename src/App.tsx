import React, { useEffect, useState, useCallback } from 'react';
import Lanyard from './components/Lanyard/Lanyard';
import { PixelMouse } from './components/PixelMouse/PixelMouse';
import { AnimalType } from './components/PixelMouse/animalDensity';
import { BadgeCustomizer } from './components/BadgeCustomizer';
import { ControlToolbar, PIXEL_COLORS, PixelColorOption } from './components/ControlToolbar';
import { BadgeData } from './types';
import { PRESET_BADGES } from './data/presets';
import { generateFrontBadge, generateBackBadge, generateLanyardStrap } from './utils/badgeGenerator';

export default function App() {
  const [badge, setBadge] = useState<BadgeData>(PRESET_BADGES[0]);
  const [frontTexture, setFrontTexture] = useState<string | null>(null);
  const [backTexture, setBackTexture] = useState<string | null>(null);
  const [lanyardTexture, setLanyardTexture] = useState<string | null>(null);
  const [lanyardWidth, setLanyardWidth] = useState<number>(1.0);
  const [gravity, setGravity] = useState<[number, number, number]>([0, -40, 0]);
  const [shakeTrigger, setShakeTrigger] = useState<number>(0);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Background Pixel Animal & Color settings
  const [currentAnimal, setCurrentAnimal] = useState<AnimalType>('deer');
  const [currentColor, setCurrentColor] = useState<PixelColorOption>(PIXEL_COLORS[0]); // Deep Forest Emerald

  // Generate dynamic 2D canvas textures when badge info changes
  const updateTextures = useCallback(async (currentBadge: BadgeData) => {
    setIsGenerating(true);
    try {
      // 1. Generate Front Badge Texture
      const frontDataUrl = await generateFrontBadge(currentBadge);
      setFrontTexture(frontDataUrl);

      // 2. Generate Back Badge Texture
      const backDataUrl = await generateBackBadge(currentBadge);
      setBackTexture(backDataUrl);

      // 3. Generate Lanyard Strap Texture
      const strapDataUrl = generateLanyardStrap(currentBadge.theme, currentBadge.theme.strapText);
      setLanyardTexture(strapDataUrl);
    } catch (err) {
      console.error('Failed to generate badge textures:', err);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  useEffect(() => {
    updateTextures(badge);
  }, [badge, updateTextures]);

  // Handle Preset selection
  const handleSelectPreset = (preset: BadgeData) => {
    setBadge(preset);
  };

  // Handle Shake / Gentle impulse
  const handleShake = () => {
    setShakeTrigger(prev => prev + 1);
  };

  // Handle Gravity toggle
  const handleToggleGravity = () => {
    setGravity(prev => {
      if (prev[1] === -40) return [0, -12, 0]; // Moon
      if (prev[1] === -12) return [0, -2, 0];  // Zero-G
      if (prev[1] === -2) return [0, -85, 0];  // Heavy
      return [0, -40, 0];                      // Earth
    });
  };

  // Reset to default preset
  const handleReset = () => {
    setBadge(PRESET_BADGES[0]);
    setLanyardWidth(1.0);
    setGravity([0, -40, 0]);
  };

  // Export Front and Back Badge Images
  const handleExportImages = () => {
    if (frontTexture) {
      const linkFront = document.createElement('a');
      linkFront.download = `${badge.employeeId || 'badge'}-front.png`;
      linkFront.href = badge.customFrontImage || frontTexture;
      linkFront.click();
    }
    if (backTexture) {
      setTimeout(() => {
        const linkBack = document.createElement('a');
        linkBack.download = `${badge.employeeId || 'badge'}-back.png`;
        linkBack.href = badge.customBackImage || backTexture;
        linkBack.click();
      }, 300);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-white text-neutral-900 font-sans">
      {/* 1. Full-screen Pixel Animal with Mouse Physics Interaction */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <PixelMouse
          animal={currentAnimal}
          color={currentColor.rgb}
          opacity={1}
        />
      </div>

      {/* 2. Floating Header & Bottom Dock */}
      <ControlToolbar
        currentBadge={badge}
        onSelectPreset={handleSelectPreset}
        onShake={handleShake}
        onOpenCustomizer={() => setIsCustomizerOpen(true)}
        onExportImages={handleExportImages}
        gravity={gravity}
        onToggleGravity={handleToggleGravity}
        currentAnimal={currentAnimal}
        onSelectAnimal={setCurrentAnimal}
        currentColor={currentColor}
        onSelectColor={setCurrentColor}
      />

      {/* 3. 3D Lanyard Canvas Scene (Hanging freely over protected clear center) */}
      <div className="relative z-10 w-full h-full pointer-events-auto">
        <Lanyard
          position={[0, 0, 20]}
          gravity={gravity}
          fov={20}
          transparent={true}
          frontImage={badge.customFrontImage || frontTexture}
          backImage={badge.customBackImage || backTexture}
          imageFit="cover"
          lanyardImage={badge.customLanyardImage || lanyardTexture}
          lanyardWidth={lanyardWidth}
          shakeTrigger={shakeTrigger}
        />
      </div>

      {/* 4. Slide-out Customizer Drawer */}
      <BadgeCustomizer
        badge={badge}
        onChange={setBadge}
        onReset={handleReset}
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        lanyardWidth={lanyardWidth}
        onLanyardWidthChange={setLanyardWidth}
        gravity={gravity}
        onGravityChange={setGravity}
      />

      {/* 5. Minimal Status Capsule */}
      {isGenerating && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-white/90 backdrop-blur-2xl px-3.5 py-1.5 rounded-full border border-black/[0.08] text-[11px] text-neutral-700 flex items-center gap-2 shadow-lg">
          <div className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
          <span>正在渲染材质...</span>
        </div>
      )}
    </div>
  );
}
