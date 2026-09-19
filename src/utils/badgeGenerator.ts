import { BadgeData, BadgeTheme } from '../types';

function createFallbackAvatar(name: string, bg: string, textColor: string): string {
  const initial = name.slice(0, 1) || 'A';
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240">
    <rect width="240" height="240" rx="36" fill="${encodeURIComponent(bg)}"/>
    <text x="120" y="148" font-size="100" font-weight="600" fill="${encodeURIComponent(textColor)}" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Plus Jakarta Sans', sans-serif">${encodeURIComponent(initial)}</text>
  </svg>`;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = src;
  });
}

/**
 * Draw vector Geometric Studio Prism Logo (Original, minimal, copyright-free)
 */
function drawStudioPrism(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
  ctx.save();
  ctx.translate(x + size / 2, y + size / 2);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = size * 0.09;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const r = size * 0.44;
  // Diamond rhombus
  ctx.beginPath();
  ctx.moveTo(0, -r);
  ctx.lineTo(r, 0);
  ctx.lineTo(0, r);
  ctx.lineTo(-r, 0);
  ctx.closePath();
  ctx.stroke();

  // Isometric inner lines
  ctx.beginPath();
  ctx.moveTo(0, -r);
  ctx.lineTo(0, r);
  ctx.moveTo(-r, 0);
  ctx.lineTo(r, 0);
  ctx.stroke();

  // Center node
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.15, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Draw vector Nexus Hex Logo (Original, minimal, copyright-free)
 */
function drawNexusHex(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
  ctx.save();
  ctx.translate(x + size / 2, y + size / 2);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = size * 0.1;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const segments = 6;
  const radius = size * 0.42;

  ctx.beginPath();
  for (let i = 0; i < segments; i++) {
    const angle = (i * Math.PI * 2) / segments - Math.PI / 2;
    const px = Math.cos(angle) * radius;
    const py = Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.stroke();

  // Internal 3 radial arms
  for (let i = 0; i < 3; i++) {
    const angle = (i * Math.PI * 2) / 3 - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * Draw Contactless NFC / Wave Icon
 */
function drawNFCIcon(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';

  for (let i = 1; i <= 3; i++) {
    ctx.beginPath();
    const r = (size / 3) * i;
    ctx.arc(0, size, r, -Math.PI / 2, -Math.PI / 6);
    ctx.stroke();
  }
  ctx.restore();
}

/**
 * Draw Minimalist Smart Chip (Titanium / Silver / Gold / Stealth)
 */
function drawMinimalChip(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, style: string, isDark: boolean) {
  ctx.save();
  // Chip base plate
  let grad = ctx.createLinearGradient(x, y, x + w, y + h);
  if (style === 'titanium') {
    grad.addColorStop(0, '#52525b');
    grad.addColorStop(0.5, '#71717a');
    grad.addColorStop(1, '#3f3f46');
  } else if (style === 'silver') {
    grad.addColorStop(0, '#e4e4e7');
    grad.addColorStop(0.5, '#d4d4d8');
    grad.addColorStop(1, '#a1a1aa');
  } else if (style === 'stealth') {
    grad.addColorStop(0, '#27272a');
    grad.addColorStop(0.5, '#18181b');
    grad.addColorStop(1, '#09090b');
  } else {
    grad.addColorStop(0, '#fef08a');
    grad.addColorStop(0.5, '#eab308');
    grad.addColorStop(1, '#ca8a04');
  }

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 6);
  ctx.fill();

  // Subtle laser engraved contacts
  ctx.strokeStyle = isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.5)';
  ctx.lineWidth = 1.2;
  ctx.strokeRect(x + 2, y + 2, w - 4, h - 4);

  ctx.beginPath();
  ctx.moveTo(x + w * 0.35, y + 2);
  ctx.lineTo(x + w * 0.35, y + h - 2);
  ctx.moveTo(x + w * 0.65, y + 2);
  ctx.lineTo(x + w * 0.65, y + h - 2);

  ctx.moveTo(x + 2, y + h * 0.5);
  ctx.lineTo(x + w * 0.35, y + h * 0.5);

  ctx.moveTo(x + w * 0.65, y + h * 0.5);
  ctx.lineTo(x + w - 2, y + h * 0.5);
  ctx.stroke();

  ctx.restore();
}

/**
 * Draw Clean Minimal QR Code
 */
function drawMinimalQRCode(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, bg: string) {
  ctx.save();
  ctx.fillStyle = bg;
  ctx.beginPath();
  ctx.roundRect(x, y, size, size, 6);
  ctx.fill();

  ctx.fillStyle = color;
  const margin = 6;
  const activeS = size - margin * 2;
  const cells = 15;
  const cSize = activeS / cells;

  const drawMarker = (mx: number, my: number) => {
    ctx.fillRect(mx, my, cSize * 5, cSize * 5);
    ctx.fillStyle = bg;
    ctx.fillRect(mx + cSize, my + cSize, cSize * 3, cSize * 3);
    ctx.fillStyle = color;
    ctx.fillRect(mx + cSize * 1.5, my + cSize * 1.5, cSize * 2, cSize * 2);
  };

  drawMarker(x + margin, y + margin);
  drawMarker(x + margin + (cells - 5) * cSize, y + margin);
  drawMarker(x + margin, y + margin + (cells - 5) * cSize);

  for (let r = 0; r < cells; r++) {
    for (let c = 0; c < cells; c++) {
      if ((r < 5 && c < 5) || (r < 5 && c >= cells - 5) || (r >= cells - 5 && c < 5)) continue;
      if ((r * 11 + c * 17) % 3 === 0 || (r + c) % 4 === 0) {
        ctx.fillRect(x + margin + c * cSize, y + margin + r * cSize, cSize - 0.5, cSize - 0.5);
      }
    }
  }
  ctx.restore();
}

/**
 * Generate High-Res Minimalist Front Face (600 x 900)
 * Designed following Apple Cupertino & OpenAI San Francisco aesthetic
 */
export async function generateFrontBadge(badge: BadgeData): Promise<string> {
  const W = 600;
  const H = 900;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  const isLight = badge.styleMode === 'light';
  const { theme } = badge;

  // 1. Clean Matte Background
  const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
  bgGrad.addColorStop(0, theme.cardBgGradient[0]);
  bgGrad.addColorStop(1, theme.cardBgGradient[1]);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // Subtle frosted border
  ctx.strokeStyle = theme.borderColor || (isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.1)');
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, W - 2, H - 2);

  // Subtle hairline inner rim
  ctx.strokeStyle = isLight ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 1;
  ctx.strokeRect(6, 6, W - 12, H - 12);

  // 2. Top Header: Company Brand & Clean Identity
  const headerY = 55;

  if (badge.logoType === 'nexus') {
    drawNexusHex(ctx, 45, headerY - 10, 26, theme.textColor);
    ctx.font = '700 22px -apple-system, BlinkMacSystemFont, "SF Pro Display", "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = theme.textColor;
    ctx.fillText(badge.company.toUpperCase(), 82, headerY + 11);
  } else if (badge.logoType === 'swiss') {
    ctx.font = '700 22px -apple-system, BlinkMacSystemFont, "SF Pro Display", "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = theme.textColor;
    ctx.fillText(badge.company.toUpperCase(), 45, headerY + 11);
  } else {
    // Default / Minimal / Studio Prism
    drawStudioPrism(ctx, 45, headerY - 10, 26, theme.textColor);
    ctx.font = '600 21px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
    ctx.fillStyle = theme.textColor;
    ctx.fillText(badge.company.toUpperCase(), 82, headerY + 11);
  }

  // Address subtitle
  ctx.font = '400 12px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
  ctx.fillStyle = theme.subtextColor;
  ctx.fillText(badge.companyEn, 45, headerY + 34);

  // Top-right: Minimalist Smart Chip & NFC indicator
  drawMinimalChip(ctx, W - 115, headerY - 10, 70, 48, theme.chipColor, !isLight);
  drawNFCIcon(ctx, W - 138, headerY - 5, 20, theme.subtextColor);

  // Subtle separator line
  ctx.strokeStyle = isLight ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(45, 116);
  ctx.lineTo(W - 45, 116);
  ctx.stroke();

  // 3. Center Portrait (Apple Clean Aesthetic)
  const avatarSize = 200;
  const avatarX = (W - avatarSize) / 2;
  const avatarY = 155;

  // Portrait drop shadow & soft border
  ctx.save();
  ctx.shadowColor = isLight ? 'rgba(0, 0, 0, 0.12)' : 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 10;
  ctx.fillStyle = isLight ? '#e5e5ea' : '#1c1c1e';
  ctx.beginPath();
  ctx.roundRect(avatarX, avatarY, avatarSize, avatarSize, 32);
  ctx.fill();
  ctx.restore();

  // Draw portrait image
  try {
    const avatarSrc = badge.avatarUrl || createFallbackAvatar(badge.name, isLight ? '#e4e4e7' : '#27272a', theme.textColor);
    const img = await loadImage(avatarSrc);
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(avatarX, avatarY, avatarSize, avatarSize, 32);
    ctx.clip();
    ctx.drawImage(img, avatarX, avatarY, avatarSize, avatarSize);
    ctx.restore();
  } catch (err) {
    const fallbackSrc = createFallbackAvatar(badge.name, isLight ? '#e4e4e7' : '#27272a', theme.textColor);
    const img = await loadImage(fallbackSrc);
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(avatarX, avatarY, avatarSize, avatarSize, 32);
    ctx.clip();
    ctx.drawImage(img, avatarX, avatarY, avatarSize, avatarSize);
    ctx.restore();
  }

  // Portrait border
  ctx.save();
  ctx.strokeStyle = isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(avatarX, avatarY, avatarSize, avatarSize, 32);
  ctx.stroke();
  ctx.restore();

  // 4. Name & Typography
  const textCenterY = 405;
  ctx.save();
  ctx.textAlign = 'center';

  // Chinese Name
  ctx.font = '700 36px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
  ctx.fillStyle = theme.textColor;
  ctx.fillText(badge.name, W / 2, textCenterY);

  // English Name
  ctx.font = '500 15px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
  ctx.fillStyle = theme.subtextColor;
  ctx.letterSpacing = '1px';
  ctx.fillText(badge.englishName.toUpperCase(), W / 2, textCenterY + 28);

  // Role
  ctx.font = '600 18px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
  ctx.fillStyle = theme.textColor;
  ctx.fillText(badge.role, W / 2, textCenterY + 68);

  // Department
  ctx.font = '400 13px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
  ctx.fillStyle = theme.subtextColor;
  ctx.fillText(badge.department, W / 2, textCenterY + 92);
  ctx.restore();

  // 5. Minimalist Spec Grid (Apple / OpenAI Clean Layout)
  const gridY = 545;
  const gridW = W - 90;
  const gridH = 110;

  ctx.save();
  ctx.fillStyle = isLight ? 'rgba(0, 0, 0, 0.02)' : 'rgba(255, 255, 255, 0.03)';
  ctx.beginPath();
  ctx.roundRect(45, gridY, gridW, gridH, 16);
  ctx.fill();
  ctx.strokeStyle = isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.06)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Column 1: Employee ID
  ctx.font = '500 11px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
  ctx.fillStyle = theme.subtextColor;
  ctx.fillText('EMPLOYEE ID', 70, gridY + 38);
  ctx.font = '600 16px "JetBrains Mono", monospace';
  ctx.fillStyle = theme.textColor;
  ctx.fillText(badge.employeeId, 70, gridY + 64);

  // Column 2: Access Level
  ctx.font = '500 11px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
  ctx.fillStyle = theme.subtextColor;
  ctx.fillText('CLEARANCE', 250, gridY + 38);
  ctx.font = '600 15px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
  ctx.fillStyle = theme.primaryColor;
  ctx.fillText(badge.accessLevel, 250, gridY + 64);

  // Column 3: Valid Thru
  ctx.font = '500 11px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
  ctx.fillStyle = theme.subtextColor;
  ctx.fillText('VALID THRU', 440, gridY + 38);
  ctx.font = '600 15px "JetBrains Mono", monospace';
  ctx.fillStyle = theme.textColor;
  ctx.fillText(badge.expiryDate, 440, gridY + 64);
  ctx.restore();

  // 6. Bottom Bar: Clean Security Verification & Minimal Barcode
  const bottomY = 710;

  // Clean minimal micro barcode
  ctx.save();
  ctx.fillStyle = isLight ? '#1c1c1e' : '#e4e4e7';
  const numBars = 45;
  const barW = (W - 140) / numBars;
  for (let i = 0; i < numBars; i++) {
    const isThick = (i * 7 + 3) % 4 === 0;
    const isSkip = (i * 13) % 7 === 0 && i > 2 && i < numBars - 2;
    if (!isSkip) {
      const bw = isThick ? barW * 1.4 : barW * 0.7;
      ctx.fillRect(70 + i * barW, bottomY, bw, 36);
    }
  }

  // Serial text below barcode
  ctx.textAlign = 'center';
  ctx.font = '500 11px "JetBrains Mono", monospace';
  ctx.fillStyle = theme.subtextColor;
  ctx.fillText(`• ${badge.employeeId} • SECURE BIOMETRIC NFC-ID •`, W / 2, bottomY + 58);

  // Legal footer
  ctx.font = '400 10px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
  ctx.fillStyle = isLight ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.3)';
  ctx.fillText('OFFICIAL IDENTITY CREDENTIAL • PROPERTY OF ISSUING CORPORATION', W / 2, bottomY + 115);
  ctx.restore();

  return canvas.toDataURL('image/png');
}

/**
 * Generate High-Res Minimalist Back Face (600 x 900)
 */
export async function generateBackBadge(badge: BadgeData): Promise<string> {
  const W = 600;
  const H = 900;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  const isLight = badge.styleMode === 'light';
  const { theme } = badge;

  // Background
  const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
  bgGrad.addColorStop(0, theme.cardBgGradient[1]);
  bgGrad.addColorStop(1, isLight ? '#e4e4e7' : '#050507');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // Frosted edge border
  ctx.strokeStyle = theme.borderColor || (isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.1)');
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, W - 2, H - 2);

  // 1. Sleek Magnetic Stripe across the top
  ctx.fillStyle = isLight ? '#27272a' : '#141416';
  ctx.fillRect(0, 50, W, 85);

  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.font = '500 10px "JetBrains Mono", monospace';
  ctx.fillText('MAGNETIC TRACK 1 & 2 • ENCRYPTED NFC 13.56 MHz • DESFIRE EV3', 40, 98);
  ctx.restore();

  // 2. Authorized Signature Strip & Security Token
  const sigY = 175;
  ctx.save();
  ctx.fillStyle = isLight ? '#ffffff' : 'rgba(255, 255, 255, 0.95)';
  ctx.beginPath();
  ctx.roundRect(45, sigY, 340, 68, 8);
  ctx.fill();

  ctx.font = 'italic 22px "Brush Script MT", cursive, sans-serif';
  ctx.fillStyle = '#0f172a';
  ctx.fillText(badge.name, 65, sigY + 44);

  ctx.font = '500 9px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.fillText('AUTHORIZED SIGNATURE', 65, sigY + 60);
  ctx.restore();

  // Security CVC code block
  ctx.save();
  ctx.fillStyle = isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.06)';
  ctx.beginPath();
  ctx.roundRect(405, sigY, 150, 68, 8);
  ctx.fill();

  ctx.font = '500 10px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
  ctx.fillStyle = theme.subtextColor;
  ctx.fillText('SECURITY CODE', 420, sigY + 26);

  ctx.font = '600 20px "JetBrains Mono", monospace';
  ctx.fillStyle = theme.textColor;
  ctx.fillText(badge.employeeId.slice(-4), 420, sigY + 54);
  ctx.restore();

  // 3. Apple / OpenAI Official Terms of Use
  const termsY = 285;
  ctx.save();
  ctx.fillStyle = theme.textColor;
  ctx.font = '600 14px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
  ctx.fillText('TERMS & NOTICE OF POSSESSION', 45, termsY);

  const lines = [
    `This badge is the property of ${badge.company} and is issued for identification only.`,
    'It is non-transferable and must be presented upon request by authorized personnel.',
    'Unauthorized use, copying, or possession is strictly prohibited.',
    '',
    `If found, please return to security at:`,
    `${badge.companyEn}`,
    `or call 24/7 Security Operations at +1 (800) 555-0199.`
  ];

  ctx.font = '400 12px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
  ctx.fillStyle = theme.subtextColor;
  let curY = termsY + 26;
  for (const l of lines) {
    ctx.fillText(l, 45, curY);
    curY += 21;
  }
  ctx.restore();

  // 4. Verification QR Code & Portal Box
  const qrY = 475;
  const qrSize = 140;
  drawMinimalQRCode(ctx, 45, qrY, qrSize, isLight ? '#000000' : '#ffffff', isLight ? '#f4f4f5' : '#18181b');

  ctx.save();
  ctx.fillStyle = isLight ? 'rgba(0, 0, 0, 0.03)' : 'rgba(255, 255, 255, 0.04)';
  ctx.beginPath();
  ctx.roundRect(205, qrY, W - 250, qrSize, 12);
  ctx.fill();

  ctx.font = '500 10px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
  ctx.fillStyle = theme.subtextColor;
  ctx.fillText('DIGITAL VERIFICATION URL', 225, qrY + 32);

  ctx.font = '600 13px "JetBrains Mono", monospace';
  ctx.fillStyle = theme.textColor;
  ctx.fillText('verify.corp.identity/pass', 225, qrY + 54);

  ctx.font = '500 10px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
  ctx.fillStyle = theme.subtextColor;
  ctx.fillText('EMERGENCY HOTLINE', 225, qrY + 86);

  ctx.font = '600 14px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
  ctx.fillStyle = theme.primaryColor;
  ctx.fillText('+1 (800) 555-0199', 225, qrY + 106);

  ctx.font = '400 10px "JetBrains Mono", monospace';
  ctx.fillStyle = theme.subtextColor;
  ctx.fillText('NFC-V • FIPS 201 COMPLIANT', 225, qrY + 126);
  ctx.restore();

  // 5. Bottom Brand Watermark
  ctx.save();
  ctx.textAlign = 'center';
  ctx.font = '600 12px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
  ctx.fillStyle = theme.subtextColor;
  ctx.fillText(`${badge.company.toUpperCase()} CONFIDENTIAL • NON-TRANSFERABLE`, W / 2, 700);

  ctx.font = '400 10px "JetBrains Mono", monospace';
  ctx.fillStyle = isLight ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.2)';
  ctx.fillText('P/N 820-0492-A • ASSEMBLED IN USA', W / 2, 725);
  ctx.restore();

  return canvas.toDataURL('image/png');
}

/**
 * Generate Apple / OpenAI Style Woven Lanyard Strap Texture (512 x 128)
 * Mimics high-end woven nylon / matte twill with crisp typography
 */
export function generateLanyardStrap(theme: BadgeTheme, text?: string): string {
  const W = 512;
  const H = 128;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  // 1. Base Strap Color
  ctx.fillStyle = theme.lanyardColor || '#1c1c1e';
  ctx.fillRect(0, 0, W, H);

  // 2. Micro Twill Weave Texture
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.lineWidth = 1;
  for (let x = -H; x < W + H; x += 3) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + H, H);
    ctx.stroke();
  }
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.12)';
  for (let x = W + H; x > -H; x -= 3) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x - H, H);
    ctx.stroke();
  }
  ctx.restore();

  // 3. Delicate Edge Seam
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(0, 8);
  ctx.lineTo(W, 8);
  ctx.moveTo(0, H - 8);
  ctx.lineTo(W, H - 8);
  ctx.stroke();
  ctx.restore();

  // 4. Subtle, High-Definition Typography
  const displayText = (text || theme.strapText || 'APPLE PARK • CUPERTINO • DESIGN STUDIO').toUpperCase();
  ctx.save();
  ctx.font = '600 30px -apple-system, BlinkMacSystemFont, "SF Pro Display", "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = theme.lanyardTextColor || '#e5e7eb';
  ctx.textBaseline = 'middle';

  const metrics = ctx.measureText(displayText);
  const textWidth = metrics.width + 70;
  const count = Math.ceil(W / textWidth) + 1;

  for (let i = 0; i < count; i++) {
    ctx.fillText(displayText, i * textWidth, H / 2);
  }
  ctx.restore();

  return canvas.toDataURL('image/png');
}
