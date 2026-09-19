// TouchDesigner Progressive_Restore_25px with Custom Density, Airy Sparsity & Color support.
// Simulation is fixed at 60 Hz; cells remain 25 CSS pixels at every viewport/DPR.
export const BLOCK = 25;
export const STEP = 1 / 60;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smoothstep = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };
const hash = (x, y) => { const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453; return n - Math.floor(n); };

// A digital line, one cell per dominant-axis step, including fast pointer moves.
export function cellsOnPath(a, b, visit) {
  const ax = Math.floor(a.x), ay = Math.floor(a.y), bx = Math.floor(b.x), by = Math.floor(b.y);
  const dx = bx - ax, dy = by - ay, steps = Math.max(Math.abs(dx), Math.abs(dy));
  if (!steps) { visit(ax, ay); return; }
  for (let i = 0; i <= steps; i++) visit(Math.floor(ax + dx * i / steps + .5), Math.floor(ay + dy * i / steps + .5));
}

export class PixelMouseEngine {
  constructor(meta, frames) {
    this.meta = meta;
    this.frames = frames;
    this.customDensity = null;
    this.densityProvider = null;
    this.resize(1280, 720);
  }

  setDensityProvider(provider) {
    this.densityProvider = provider;
    if (this.densityProvider && this.cols && this.rows) {
      this.customDensity = this.densityProvider(this.cols, this.rows, this.width, this.height);
      if (this.customDensity && this.source) {
        this.source.set(this.customDensity);
        this.compose();
      }
    }
  }

  setCustomDensity(density) {
    this.customDensity = density;
    if (density && this.source && density.length === this.count) {
      this.source.set(density);
      this.compose();
    }
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
    this.cols = Math.max(1, Math.floor(width / BLOCK));
    this.rows = Math.max(1, Math.floor(height / BLOCK));
    this.ox = Math.floor((width - this.cols * BLOCK) / 2);
    const sampleOriginY = Math.floor((height - this.rows * BLOCK) / 2);
    this.oy = 0;
    this.count = this.cols * this.rows;

    for (const key of ['source', 'ink', 'trail', 'px', 'py', 'vx', 'vy', 'order', 'random', 'variation']) {
      this[key] = new Float32Array(this.count);
    }
    this.mapping = new Int32Array(this.count);
    this.visible = new Uint8Array(this.count);
    this.restored = new Uint8Array(this.count);

    for (let i = 0; i < this.count; i++) {
      const x = i % this.cols, y = Math.floor(i / this.cols);
      const sx = Math.floor((((x + .5) * BLOCK + this.ox) / width * 1280 - 2) / BLOCK);
      const sy = Math.max(0, Math.floor((((y + .5) * BLOCK + sampleOriginY) / height * 720 - 10) / BLOCK));
      this.mapping[i] = sx < 0 || sy < 0 || sx >= 51 || sy >= 28 ? -1 : sy * 51 + sx;
      const r = hash(x, y);
      this.random[i] = r;
      this.variation[i] = .9 + .1 * Math.sin(x * .48 + Math.sin(y * .37));
      this.order[i] = .035 + .93 * (.72 * r + .28 * (.5 + .5 * Math.sin(x * .39 + y * .61)));
    }
    this.life = 0;
    this.quiet = 2;
    this.lastPointer = null;
    this.pending = [];
    this.lastContact = null;

    if (this.densityProvider) {
      this.customDensity = this.densityProvider(this.cols, this.rows, this.width, this.height);
      if (this.customDensity) this.source.set(this.customDensity);
    } else {
      this.sample(0);
    }
    this.compose();
  }

  sample(seconds) {
    if (this.customDensity) {
      return;
    }
    if (!this.frames || !this.meta) return;
    const frame = Math.floor(seconds * this.meta.fps) % this.meta.frames;
    const offset = frame * this.meta.width * this.meta.height;
    for (let i = 0; i < this.count; i++) {
      this.source[i] = this.mapping[i] < 0 ? 0 : this.frames[offset + this.mapping[i]];
    }
  }

  pointer(x, y, time = performance.now()) {
    const next = { x: (x - this.ox) / BLOCK, y: (this.height - y - this.oy) / BLOCK, time };
    if (this.lastPointer) this.pending.push([this.lastPointer, next]);
    this.lastPointer = next;
  }

  leave() {
    this.lastPointer = null;
  }

  index(x, y) {
    return x >= 0 && y >= 0 && x < this.cols && y < this.rows ? y * this.cols + x : -1;
  }

  occupancy() {
    this.visible.fill(0);
    for (let i = 0; i < this.count; i++) {
      if (this.source[i] < .02) continue;
      if (this.restored[i]) this.visible[i] = 1;
      if (this.life > .008) {
        const k = this.index(i % this.cols + Math.round(this.px[i]), Math.floor(i / this.cols) + Math.round(this.py[i]));
        if (k >= 0) this.visible[k] = 1;
      }
    }
  }

  tick(seconds) {
    this.sample(seconds);
    this.occupancy();
    for (let i = 0; i < this.count; i++) {
      this.trail[i] *= .92;
      if (this.trail[i] < .01) this.trail[i] = 0;
    }
    let dx = 0, dy = 0, cx = 0, cy = 0, hits = 0;
    for (const [a, b] of this.pending) {
      const sx = b.x - a.x, sy = b.y - a.y, speed = Math.hypot(sx, sy);
      if (speed < .025) continue;
      const frameSpeed = speed * (1000 / 60) / Math.max(1, b.time - a.time);
      // Gentle airy trail darkness (capped at 0.28 so it never creates solid dark clumps)
      const darkness = .12 + .16 * clamp(frameSpeed / .96);
      let touched = false;
      cellsOnPath(a, b, (x, y) => {
        const i = this.index(x, y);
        if (i < 0) return;
        this.trail[i] = Math.max(this.trail[i], darkness);
        if (this.visible[i]) {
          cx += x + .5;
          cy += y + .5;
          hits++;
          touched = true;
        }
      });
      if (touched) {
        dx += sx;
        dy += sy;
      }
    }
    this.pending.length = 0;
    const magnitude = Math.hypot(dx, dy);
    if (magnitude > 4) {
      dx *= 4 / magnitude;
      dy *= 4 / magnitude;
    }
    const moving = hits > 0 && magnitude > .001;
    if (moving) {
      cx /= hits;
      cy /= hits;
      this.life = 1;
      this.quiet = 0;
      this.lastContact = { x: cx, y: cy, dx, dy };
    } else {
      this.quiet += STEP;
      if (this.quiet > .18) this.life *= .956;
      if (this.life < .008) this.life = 0;
    }
    for (let i = 0; i < this.count; i++) {
      if (!this.life) {
        this.px[i] = this.py[i] = this.vx[i] = this.vy[i] = 0;
        continue;
      }
      let vx = this.vx[i], vy = this.vy[i];
      if (moving) {
        const x = i % this.cols + .5 + this.px[i] - cx;
        const y = Math.floor(i / this.cols) + .5 + this.py[i] - cy;
        const local = Math.exp(-(x * x + y * y) / 38);
        const response = (.13 + 1.12 * local) * this.variation[i] + .12 * this.random[i] * local * clamp(Math.hypot(dx, dy));
        vx += (dx * response - vx) * .38;
        vy += (dy * response - vy) * .38;
      } else {
        vx *= .88;
        vy *= .88;
      }
      const speed = Math.hypot(vx, vy);
      if (speed > 1.25) {
        vx *= 1.25 / speed;
        vy *= 1.25 / speed;
      }
      this.vx[i] = vx;
      this.vy[i] = vy;
      this.px[i] += vx;
      this.py[i] += vy;
    }
    this.compose();
  }

  compose() {
    const progress = smoothstep(.18, 1.6, this.quiet);
    for (let i = 0; i < this.count; i++) {
      this.restored[i] = !this.life || progress >= this.order[i] ? 1 : 0;
      this.ink[i] = this.restored[i] ? this.source[i] : 0;
    }
    if (this.life > 0) {
      for (let i = 0; i < this.count; i++) {
        const value = this.source[i];
        if (value < .001) continue;
        const k = this.index(i % this.cols + Math.round(this.px[i]), Math.floor(i / this.cols) + Math.round(this.py[i]));
        if (k < 0) continue;
        const force = clamp(Math.hypot(this.vx[i], this.vy[i]) / 1.2);
        // Soft airy displacement: never amplify ink past 0.35
        this.ink[k] = Math.max(this.ink[k], Math.min(0.35, value + 0.12 * force) * this.life);
      }
    }
    for (let i = 0; i < this.count; i++) {
      if (this.source[i] < .01) {
        this.ink[i] = Math.max(this.ink[i], this.trail[i]);
      }
    }
  }
}
