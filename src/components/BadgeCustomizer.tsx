import React, { useRef } from 'react';
import { BadgeData, BadgeTheme } from '../types';
import { PRESET_BADGES } from '../data/presets';
import { X, Upload, User, Palette, Sliders, RefreshCw, Image as ImageIcon } from 'lucide-react';

interface BadgeCustomizerProps {
  badge: BadgeData;
  onChange: (updated: BadgeData) => void;
  onReset: () => void;
  isOpen: boolean;
  onClose: () => void;
  lanyardWidth: number;
  onLanyardWidthChange: (w: number) => void;
  gravity: [number, number, number];
  onGravityChange: (g: [number, number, number]) => void;
}

export const BadgeCustomizer: React.FC<BadgeCustomizerProps> = ({
  badge,
  onChange,
  onReset,
  isOpen,
  onClose,
  lanyardWidth,
  onLanyardWidthChange,
  gravity,
  onGravityChange
}) => {
  const [activeTab, setActiveTab] = React.useState<'info' | 'theme' | 'physics' | 'customImages'>('info');
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);
  const lanyardInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleTextChange = (key: keyof BadgeData, value: any) => {
    onChange({
      ...badge,
      [key]: value
    });
  };

  const handleThemeChange = (key: keyof BadgeTheme, value: any) => {
    onChange({
      ...badge,
      theme: {
        ...badge.theme,
        [key]: value
      }
    });
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        handleTextChange('avatarUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCustomImageUpload = (field: 'customFrontImage' | 'customBackImage' | 'customLanyardImage') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        handleTextChange(field, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] bg-white/95 backdrop-blur-3xl border-l border-black/[0.08] shadow-2xl flex flex-col text-neutral-900 transition-all duration-300 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-black/[0.06]">
        <div>
          <h2 className="text-sm font-semibold text-neutral-900 tracking-tight">工牌配置</h2>
          <p className="text-[12px] text-neutral-500">极简白底风格与物理参数</p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-900 hover:bg-black/[0.04] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Apple-style Segmented Tabs */}
      <div className="px-6 py-3 border-b border-black/[0.06] bg-neutral-50/50">
        <div className="grid grid-cols-4 gap-1 p-1 bg-neutral-200/60 rounded-xl border border-black/[0.04]">
          {[
            { id: 'info', label: '信息', icon: User },
            { id: 'theme', label: '主题', icon: Palette },
            { id: 'physics', label: '物理', icon: Sliders },
            { id: 'customImages', label: '贴图', icon: ImageIcon }
          ].map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer text-center ${
                  isActive
                    ? 'bg-white text-black shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Body Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs custom-scrollbar">
        {/* TAB 1: INFO */}
        {activeTab === 'info' && (
          <div className="space-y-5">
            {/* Avatar Section */}
            <div>
              <label className="block text-[11px] font-semibold text-neutral-500 mb-2 uppercase tracking-wider">
                头像照片
              </label>
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-black/[0.1] bg-neutral-100 shrink-0 shadow-sm">
                  {badge.avatarUrl ? (
                    <img src={badge.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs">无</div>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <button
                    onClick={() => avatarInputRef.current?.click()}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border border-neutral-200 text-xs font-medium transition-all cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-neutral-700" /> 上传肖像照
                  </button>
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                  <input
                    type="text"
                    value={badge.avatarUrl}
                    onChange={e => handleTextChange('avatarUrl', e.target.value)}
                    placeholder="或输入图片 URL..."
                    className="w-full py-1.5 px-3 rounded-lg bg-neutral-50 border border-neutral-200 text-xs text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-black/30 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Brand Logo Type */}
            <div>
              <label className="block text-[11px] font-semibold text-neutral-500 mb-2 uppercase tracking-wider">
                品牌标志 (Brand Logo)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'minimal', label: '◈ Studio Prism' },
                  { id: 'nexus', label: '✦ Nexus Hex' },
                  { id: 'swiss', label: '▪ Swiss Grid' }
                ].map(logo => {
                  const isCur = (badge.logoType || 'minimal') === logo.id;
                  return (
                    <button
                      key={logo.id}
                      onClick={() => handleTextChange('logoType', logo.id)}
                      className={`py-2 px-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer text-center ${
                        isCur
                          ? 'border-black/40 bg-neutral-100 text-black font-semibold'
                          : 'border-neutral-200 bg-neutral-50 text-neutral-600 hover:bg-neutral-100'
                      }`}
                    >
                      {logo.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Names */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-neutral-500 mb-1">姓名 (中文)</label>
                <input
                  type="text"
                  value={badge.name}
                  onChange={e => handleTextChange('name', e.target.value)}
                  className="w-full py-2 px-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-black/30 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-neutral-500 mb-1">英文名</label>
                <input
                  type="text"
                  value={badge.englishName}
                  onChange={e => handleTextChange('englishName', e.target.value)}
                  className="w-full py-2 px-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-black/30 focus:bg-white"
                />
              </div>
            </div>

            {/* Role & Dept */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-neutral-500 mb-1">职位 Title</label>
                <input
                  type="text"
                  value={badge.role}
                  onChange={e => handleTextChange('role', e.target.value)}
                  className="w-full py-2 px-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-black/30 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-neutral-500 mb-1">部门 Department</label>
                <input
                  type="text"
                  value={badge.department}
                  onChange={e => handleTextChange('department', e.target.value)}
                  className="w-full py-2 px-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-black/30 focus:bg-white"
                />
              </div>
            </div>

            {/* Company & Subtitle */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-neutral-500 mb-1">所属组织</label>
                <input
                  type="text"
                  value={badge.company}
                  onChange={e => handleTextChange('company', e.target.value)}
                  className="w-full py-2 px-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-black/30 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-neutral-500 mb-1">园区 / 地址</label>
                <input
                  type="text"
                  value={badge.companyEn}
                  onChange={e => handleTextChange('companyEn', e.target.value)}
                  className="w-full py-2 px-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-black/30 focus:bg-white"
                />
              </div>
            </div>

            {/* ID & Clearance */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-neutral-500 mb-1">工号 (ID)</label>
                <input
                  type="text"
                  value={badge.employeeId}
                  onChange={e => handleTextChange('employeeId', e.target.value)}
                  className="w-full py-2 px-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-mono text-neutral-900 focus:outline-none focus:border-black/30 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-neutral-500 mb-1">权限级别</label>
                <input
                  type="text"
                  value={badge.accessLevel}
                  onChange={e => handleTextChange('accessLevel', e.target.value)}
                  className="w-full py-2 px-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-black/30 focus:bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: THEME */}
        {activeTab === 'theme' && (
          <div className="space-y-6">
            <div>
              <label className="block text-[11px] font-semibold text-neutral-500 mb-3 uppercase tracking-wider">
                选择预设风格
              </label>
              <div className="grid grid-cols-1 gap-2">
                {PRESET_BADGES.map(preset => {
                  const isSelected = badge.id === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => onChange(preset)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-black bg-neutral-100 text-black ring-1 ring-black'
                          : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-5 h-5 rounded-md border border-black/10"
                          style={{
                            background: preset.theme.cardBgGradient[0]
                          }}
                        />
                        <div>
                          <div className="text-xs font-semibold text-neutral-900">{preset.theme.name}</div>
                          <div className="text-[11px] text-neutral-500">{preset.company} • {preset.role}</div>
                        </div>
                      </div>
                      <span className="text-[11px] font-mono text-neutral-400">
                        {preset.styleMode === 'light' ? '亮色' : '暗色'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Chip Style */}
            <div className="pt-4 border-t border-neutral-200 space-y-3">
              <label className="block text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                智能芯片质感 (NFC Smart Chip)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'titanium', label: '钛金属' },
                  { id: 'silver', label: '浅银' },
                  { id: 'stealth', label: '曜石黑' },
                  { id: 'gold', label: '微金' }
                ].map(chip => {
                  const isCur = badge.theme.chipColor === chip.id;
                  return (
                    <button
                      key={chip.id}
                      onClick={() => handleThemeChange('chipColor', chip.id)}
                      className={`py-2 rounded-xl border text-xs transition-all cursor-pointer text-center ${
                        isCur
                          ? 'border-black bg-neutral-200 text-black font-semibold'
                          : 'border-neutral-200 bg-neutral-50 text-neutral-600 hover:bg-neutral-100'
                      }`}
                    >
                      {chip.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Colors */}
            <div className="pt-4 border-t border-neutral-200 space-y-4">
              <label className="block text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                色彩微调
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-neutral-500 mb-1">卡面基色</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={badge.theme.cardBgGradient[0]}
                      onChange={e => handleThemeChange('cardBgGradient', [e.target.value, badge.theme.cardBgGradient[1]])}
                      className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <span className="text-xs font-mono text-neutral-600">{badge.theme.cardBgGradient[0]}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] text-neutral-500 mb-1">挂带织物颜色</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={badge.theme.lanyardColor}
                      onChange={e => handleThemeChange('lanyardColor', e.target.value)}
                      className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <span className="text-xs font-mono text-neutral-600">{badge.theme.lanyardColor}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PHYSICS & LANYARD */}
        {activeTab === 'physics' && (
          <div className="space-y-6">
            {/* Lanyard Width */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                  挂绳织带宽度 (lanyardWidth)
                </label>
                <span className="text-xs font-mono text-neutral-800">{lanyardWidth.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={lanyardWidth}
                onChange={e => onLanyardWidthChange(parseFloat(e.target.value))}
                className="w-full accent-black cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-neutral-400 mt-1">
                <span>0.5 (精炼极简)</span>
                <span>1.0 (标准织带)</span>
                <span>2.0 (展会加宽)</span>
              </div>
            </div>

            {/* Strap Text */}
            <div>
              <label className="block text-[11px] font-semibold text-neutral-500 mb-1 uppercase tracking-wider">
                织带印字 (Strap Text)
              </label>
              <input
                type="text"
                value={badge.theme.strapText || ''}
                onChange={e => handleThemeChange('strapText', e.target.value)}
                placeholder="例如: STUDIO LAB • INTERFACE DESIGN • CREATIVE ACCESS"
                className="w-full py-2 px-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-sans text-neutral-900 focus:outline-none focus:border-black/30 focus:bg-white"
              />
            </div>

            {/* Gravity */}
            <div>
              <label className="block text-[11px] font-semibold text-neutral-500 mb-2 uppercase tracking-wider">
                物理重力环境 (Gravity Vector)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: '地球重力 (1.0 G)', val: [0, -40, 0] as [number, number, number], desc: '标准自然垂直垂坠' },
                  { label: '月球低重力 (0.16 G)', val: [0, -12, 0] as [number, number, number], desc: '缓慢轻盈浮动' },
                  { label: '零重力太空 (0.0 G)', val: [0, -2, 0] as [number, number, number], desc: '无拘束三维失重' },
                  { label: '高重力 (2.0 G)', val: [0, -85, 0] as [number, number, number], desc: '强阻尼快速归位' }
                ].map((item, idx) => {
                  const isCur = gravity[1] === item.val[1];
                  return (
                    <button
                      key={idx}
                      onClick={() => onGravityChange(item.val)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isCur
                          ? 'border-black bg-neutral-100 text-black font-semibold'
                          : 'border-neutral-200 bg-neutral-50 text-neutral-600 hover:bg-neutral-100'
                      }`}
                    >
                      <div className="text-xs font-medium text-neutral-900">{item.label}</div>
                      <div className="text-[11px] text-neutral-500 mt-0.5">{item.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DIRECT IMAGE UPLOAD */}
        {activeTab === 'customImages' && (
          <div className="space-y-5">
            <div className="p-3.5 rounded-xl bg-neutral-100 border border-neutral-200 text-[12px] text-neutral-700 leading-relaxed">
              支持直接导入你自己设计好的完整卡片正面、背面或挂带纹理，组件会自动贴合 3D 模型 UV。
            </div>

            {/* Front Image Upload */}
            <div>
              <label className="block text-[11px] font-semibold text-neutral-500 mb-2">
                自定义卡片正面 (frontImage)
              </label>
              <div className="space-y-2">
                <button
                  onClick={() => frontInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border border-neutral-200 text-xs font-medium transition-all cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-neutral-700" /> 上传正面设计图 (PNG/JPG)
                </button>
                <input
                  ref={frontInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleCustomImageUpload('customFrontImage')}
                  className="hidden"
                />
                {badge.customFrontImage && (
                  <button
                    onClick={() => handleTextChange('customFrontImage', null)}
                    className="text-[11px] text-rose-500 hover:underline cursor-pointer"
                  >
                    清除自定义正面图 (恢复动态排版)
                  </button>
                )}
              </div>
            </div>

            {/* Back Image Upload */}
            <div>
              <label className="block text-[11px] font-semibold text-neutral-500 mb-2">
                自定义卡片背面 (backImage)
              </label>
              <div className="space-y-2">
                <button
                  onClick={() => backInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border border-neutral-200 text-xs font-medium transition-all cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-neutral-700" /> 上传背面设计图 (PNG/JPG)
                </button>
                <input
                  ref={backInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleCustomImageUpload('customBackImage')}
                  className="hidden"
                />
                {badge.customBackImage && (
                  <button
                    onClick={() => handleTextChange('customBackImage', null)}
                    className="text-[11px] text-rose-500 hover:underline cursor-pointer"
                  >
                    清除自定义背面图 (恢复动态排版)
                  </button>
                )}
              </div>
            </div>

            {/* Lanyard Image Upload */}
            <div>
              <label className="block text-[11px] font-semibold text-neutral-500 mb-2">
                自定义挂绳贴图 (lanyardImage)
              </label>
              <div className="space-y-2">
                <button
                  onClick={() => lanyardInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border border-neutral-200 text-xs font-medium transition-all cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-neutral-700" /> 上传织带纹理 (PNG)
                </button>
                <input
                  ref={lanyardInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleCustomImageUpload('customLanyardImage')}
                  className="hidden"
                />
                {badge.customLanyardImage && (
                  <button
                    onClick={() => handleTextChange('customLanyardImage', null)}
                    className="text-[11px] text-rose-500 hover:underline cursor-pointer"
                  >
                    清除自定义挂绳贴图 (恢复默认织带)
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-black/[0.06] bg-neutral-50/50 flex items-center justify-between">
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" /> 恢复初始设计
        </button>
        <button
          onClick={onClose}
          className="px-5 py-2 rounded-xl bg-black text-white hover:bg-neutral-800 text-xs font-medium transition-all cursor-pointer shadow-md"
        >
          完成
        </button>
      </div>
    </div>
  );
};
