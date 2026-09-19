/**
 * Generates airy, sparse, delicate pixel density matrices for iconic animal silhouettes.
 * Uses fine contours, delicate cross-hatching and pointillism instead of solid blobs,
 * capping peak density so it renders as refined, breathable Bayer halftones on a white background.
 */

export type AnimalType = 'deer' | 'whale' | 'fox';

export function createAnimalDensity(
  animal: AnimalType,
  width: number,
  height: number,
  cols: number,
  rows: number,
  sparsity = 0.32 // Controls maximum dot density (0.15 to 0.45 for airy, sparse aesthetic)
): Float32Array {
  const canvas = document.createElement('canvas');
  canvas.width = cols;
  canvas.height = rows;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return new Float32Array(cols * rows);

  ctx.clearRect(0, 0, cols, rows);

  // 1. Draw Delicate Line & Stipple Animal Contours
  if (animal === 'deer') {
    drawSparseStag(ctx, cols, rows);
  } else if (animal === 'whale') {
    drawSparseWhale(ctx, cols, rows);
  } else {
    drawSparseFox(ctx, cols, rows);
  }

  // 2. Clear Central Badge Breathing Area (Generous whitespace around card & strap)
  ctx.save();
  ctx.globalCompositeOperation = 'destination-out';

  const cx = cols / 2;
  const cy = rows / 2;
  const safeW = cols * 0.22; // ~450px wide safe corridor
  const safeH = rows * 0.42; // ~650px high

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const dx = Math.abs(x - cx) / safeW;
      const dy = Math.abs(y - cy) / safeH;
      const dist = dx * dx + dy * dy;

      if (dist < 1.0) {
        ctx.fillRect(x, y, 1, 1);
      } else if (dist < 1.6) {
        const fade = 1 - (dist - 1.0) / 0.6;
        ctx.fillStyle = `rgba(0, 0, 0, ${fade})`;
        ctx.fillRect(x, y, 1, 1);
      }

      // Vertical lanyard strap channel from top down to center
      if (Math.abs(x - cx) <= 3 && y <= cy) {
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }
  ctx.restore();

  // 3. Extract and Scale Density Values for Sparse Bayer Rendering
  const imgData = ctx.getImageData(0, 0, cols, rows);
  const data = imgData.data;
  const count = cols * rows;
  const density = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const gx = i % cols;
    const gy = Math.floor(i / cols);
    const flippedIndex = (gy * cols + gx) * 4;
    const alpha = data[flippedIndex + 3];

    // Cap at sparsity so it NEVER becomes solid blobs; stays airy, delicate, and sparse
    if (alpha > 5) {
      density[i] = Math.min(sparsity, (alpha / 255) * sparsity);
    } else {
      density[i] = 0.0;
    }
  }

  return density;
}

/**
 * Draw Sparse, Fine-Lined Forest Stag (林间神鹿)
 * Features delicate branching antlers and slender contour lines
 */
function drawSparseStag(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.save();
  ctx.strokeStyle = '#000000';
  ctx.fillStyle = '#000000';
  ctx.lineWidth = 1.0;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const deerX = w * 0.18;
  const deerY = h * 0.55;

  // 1. Torso Outline (Not solid fill)
  ctx.beginPath();
  ctx.ellipse(deerX, deerY + 4, 7, 10, -0.15, 0, Math.PI * 2);
  ctx.stroke();

  // Subtle interior rib lines for contour depth
  for (let r = -4; r <= 6; r += 3) {
    ctx.beginPath();
    ctx.moveTo(deerX - 5, deerY + r);
    ctx.lineTo(deerX + 4, deerY + r + 2);
    ctx.stroke();
  }

  // 2. Neck & Head Contour
  ctx.beginPath();
  ctx.moveTo(deerX - 4, deerY);
  ctx.quadraticCurveTo(deerX - 5, deerY - 8, deerX - 2, deerY - 14);
  ctx.lineTo(deerX + 2, deerY - 13);
  ctx.quadraticCurveTo(deerX + 3, deerY - 6, deerX + 4, deerY + 2);
  ctx.stroke();

  // Head
  ctx.beginPath();
  ctx.ellipse(deerX - 3, deerY - 14, 3.5, 2.5, -0.4, 0, Math.PI * 2);
  ctx.stroke();

  // Ears
  ctx.beginPath();
  ctx.moveTo(deerX, deerY - 16);
  ctx.lineTo(deerX + 3, deerY - 21);
  ctx.lineTo(deerX + 1, deerY - 18);
  ctx.stroke();

  // 3. Delicate Branching Antlers (Spread wide across top-left)
  ctx.lineWidth = 1.1;

  // Left Antler Main Beam
  ctx.beginPath();
  ctx.moveTo(deerX - 1, deerY - 16);
  ctx.quadraticCurveTo(deerX - 8, deerY - 22, deerX - 14, deerY - 27);
  ctx.stroke();

  const leftTines = [
    [deerX - 4, deerY - 19, deerX - 8, deerY - 25],
    [deerX - 8, deerY - 23, deerX - 13, deerY - 29],
    [deerX - 11, deerY - 25, deerX - 16, deerY - 25],
    [deerX - 13, deerY - 27, deerX - 17, deerY - 30]
  ];
  for (const [x1, y1, x2, y2] of leftTines) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  // Right Antler Main Beam (arching gracefully)
  ctx.beginPath();
  ctx.moveTo(deerX + 1, deerY - 16);
  ctx.quadraticCurveTo(deerX + 5, deerY - 23, deerX + 9, deerY - 28);
  ctx.stroke();

  const rightTines = [
    [deerX + 3, deerY - 19, deerX + 7, deerY - 25],
    [deerX + 6, deerY - 23, deerX + 11, deerY - 27],
    [deerX + 8, deerY - 26, deerX + 12, deerY - 31]
  ];
  for (const [x1, y1, x2, y2] of rightTines) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  // 4. Slender Legs
  ctx.lineWidth = 1.0;
  const legs = [
    [deerX - 3, deerY + 13, deerX - 4, deerY + 24],
    [deerX + 1, deerY + 13, deerX + 1, deerY + 24],
    [deerX + 5, deerY + 11, deerX + 7, deerY + 24]
  ];
  for (const [lx1, ly1, lx2, ly2] of legs) {
    ctx.beginPath();
    ctx.moveTo(lx1, ly1);
    ctx.lineTo(lx2, ly2);
    ctx.stroke();
  }

  // 5. Right Side Forest Canopy: Delicate pine outlines & sparse mountain strokes
  ctx.lineWidth = 0.9;
  for (let px = w * 0.74; px < w - 4; px += 6) {
    const py = h * 0.68 + Math.sin(px * 0.35) * 4;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(px + 3, py - 8);
    ctx.lineTo(px + 6, py);
    ctx.stroke();
  }

  // Moon ring outline in upper right
  ctx.beginPath();
  ctx.arc(w * 0.85, h * 0.22, 7, 0, Math.PI * 2);
  ctx.stroke();

  // Subtle scattered star points in peripheral corners
  const stars = [
    [w * 0.08, h * 0.15],
    [w * 0.14, h * 0.22],
    [w * 0.06, h * 0.32],
    [w * 0.88, h * 0.12],
    [w * 0.93, h * 0.25],
    [w * 0.82, h * 0.35],
    [w * 0.76, h * 0.16]
  ];
  for (const [sx, sy] of stars) {
    ctx.beginPath();
    ctx.arc(sx, sy, 0.9, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * Draw Sparse, Architectural Whale (深海巨鲸)
 * Outlines of whale body, delicate ventral pleat lines, and fluked tail
 */
function drawSparseWhale(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.save();
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 1.0;
  ctx.lineCap = 'round';

  const cy = h * 0.66;
  const wx = w * 0.10;
  const whaleLen = w * 0.80;

  // 1. Whale Body Outline
  ctx.beginPath();
  ctx.moveTo(wx, cy);
  ctx.quadraticCurveTo(wx + 10, cy - 14, wx + whaleLen * 0.35, cy - 10);
  ctx.quadraticCurveTo(wx + whaleLen * 0.7, cy - 8, wx + whaleLen * 0.9, cy - 15);
  ctx.lineTo(wx + whaleLen, cy - 22);
  ctx.lineTo(wx + whaleLen * 0.95, cy - 12);
  ctx.lineTo(wx + whaleLen, cy - 2);
  ctx.quadraticCurveTo(wx + whaleLen * 0.7, cy + 4, wx + whaleLen * 0.4, cy + 12);
  ctx.quadraticCurveTo(wx + 15, cy + 14, wx, cy);
  ctx.closePath();
  ctx.stroke();

  // 2. Ventral Grooves (delicate parallel lines along throat/belly)
  for (let g = 2; g <= 8; g += 2) {
    ctx.beginPath();
    ctx.moveTo(wx + 8, cy + g * 0.8);
    ctx.quadraticCurveTo(wx + whaleLen * 0.2, cy + g, wx + whaleLen * 0.38, cy + g * 0.6);
    ctx.stroke();
  }

  // 3. Pectoral Flipper
  ctx.beginPath();
  ctx.moveTo(wx + 22, cy + 4);
  ctx.quadraticCurveTo(wx + 18, cy + 18, wx + 12, cy + 24);
  ctx.quadraticCurveTo(wx + 22, cy + 18, wx + 28, cy + 8);
  ctx.stroke();

  // 4. Subtle Water Mist / Sparse Spout Dots
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.arc(wx + 15 + i * 2, cy - 18 - i * 2.5, 0.8, 0, Math.PI * 2);
    ctx.stroke();
  }

  // 5. Sparse Floating Ocean Bubble Rings
  const bubbles = [
    [w * 0.08, h * 0.22, 2.5],
    [w * 0.14, h * 0.32, 1.8],
    [w * 0.88, h * 0.28, 2.2],
    [w * 0.92, h * 0.38, 1.5],
    [w * 0.80, h * 0.18, 1.2]
  ];
  for (const [bx, by, r] of bubbles) {
    ctx.beginPath();
    ctx.arc(bx, by, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * Draw Sparse, Wireframe Fox (极光灵狐)
 * Elegant sitting posture with fluffy tail outline and star constellations
 */
function drawSparseFox(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.save();
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 1.0;
  ctx.lineCap = 'round';

  const fx = w * 0.80;
  const fy = h * 0.58;

  // 1. Torso Outline
  ctx.beginPath();
  ctx.ellipse(fx, fy, 6, 11, 0.25, 0, Math.PI * 2);
  ctx.stroke();

  // 2. Neck & Head
  ctx.beginPath();
  ctx.moveTo(fx - 4, fy - 6);
  ctx.quadraticCurveTo(fx - 7, fy - 14, fx - 3, fy - 18);
  ctx.lineTo(fx + 2, fy - 16);
  ctx.quadraticCurveTo(fx + 2, fy - 8, fx + 4, fy);
  ctx.stroke();

  // Head & Muzzle
  ctx.beginPath();
  ctx.ellipse(fx - 3, fy - 18, 3.5, 2.5, -0.3, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(fx - 5, fy - 18);
  ctx.lineTo(fx - 9, fy - 17);
  ctx.lineTo(fx - 6, fy - 15);
  ctx.stroke();

  // Ears
  ctx.beginPath();
  ctx.moveTo(fx - 2, fy - 20);
  ctx.lineTo(fx - 4, fy - 26);
  ctx.lineTo(fx - 1, fy - 22);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(fx, fy - 19);
  ctx.lineTo(fx + 2, fy - 25);
  ctx.lineTo(fx + 3, fy - 21);
  ctx.stroke();

  // 3. Curved Bushy Tail Outline
  ctx.beginPath();
  ctx.moveTo(fx + 5, fy + 8);
  ctx.quadraticCurveTo(fx + 15, fy + 14, fx + 17, fy + 4);
  ctx.quadraticCurveTo(fx + 17, fy - 6, fx + 11, fy - 2);
  ctx.quadraticCurveTo(fx + 13, fy + 6, fx + 3, fy + 8);
  ctx.stroke();

  // Tail interior fur lines
  ctx.beginPath();
  ctx.moveTo(fx + 8, fy + 4);
  ctx.quadraticCurveTo(fx + 14, fy + 7, fx + 13, fy + 2);
  ctx.stroke();

  // 4. Left Side: Star Constellations
  const stars = [
    [w * 0.10, h * 0.22],
    [w * 0.15, h * 0.16],
    [w * 0.22, h * 0.18],
    [w * 0.26, h * 0.26]
  ];
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(stars[0][0], stars[0][1]);
  for (let i = 1; i < stars.length; i++) {
    ctx.lineTo(stars[i][0], stars[i][1]);
  }
  ctx.stroke();

  for (const [sx, sy] of stars) {
    ctx.beginPath();
    ctx.arc(sx, sy, 1.2, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Moon ring on left
  ctx.beginPath();
  ctx.arc(w * 0.16, h * 0.32, 6, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}
