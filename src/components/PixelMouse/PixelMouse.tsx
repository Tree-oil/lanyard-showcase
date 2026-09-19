import React, { useEffect, useRef } from 'react';
import { PixelMouseEngine, STEP } from './pixelMouseEngine';
import { createPixelRenderer } from './pixelMouseRenderer';
import { AnimalType, createAnimalDensity } from './animalDensity';

const assets = `${import.meta.env.BASE_URL}assets/home/pixel-mouse/`;

export interface PixelMouseProps {
  animal?: AnimalType;
  /** Normalized RGB [r, g, b] where each is 0.0 to 1.0. Defaults to Deep Forest Emerald [0.05, 0.28, 0.20] */
  color?: [number, number, number];
  opacity?: number;
  className?: string;
}

export const PixelMouse: React.FC<PixelMouseProps> = ({
  animal = 'deer',
  color = [0.05, 0.28, 0.20], // Deep Forest Emerald
  opacity = 1,
  className = ''
}) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);
  const colorRef = useRef(color);
  const animalRef = useRef(animal);

  colorRef.current = color;
  animalRef.current = animal;

  // When animal type changes, update the density provider
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setDensityProvider((cols: number, rows: number, w: number, h: number) =>
        createAnimalDensity(animal, w, h, cols, rows)
      );
    }
  }, [animal]);

  // When color changes, force an immediate draw
  useEffect(() => {
    if (rendererRef.current && engineRef.current) {
      rendererRef.current.draw(engineRef.current, color);
    }
  }, [color]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const host = canvas.parentElement || document.body;

    const abort = new AbortController();
    let disposed = false;
    let raf = 0;
    let resizeObserver: ResizeObserver | null = null;
    let intersection: IntersectionObserver | null = null;

    let visible = true;
    let elapsed = 0;
    let last = 0;
    let accumulator = 0;
    let lastDraw = 0;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

    const pointer = (event: PointerEvent) => {
      if (!engineRef.current || reduced.matches) return;
      const rect = canvas.getBoundingClientRect();
      const coalesced = (event as any).getCoalescedEvents?.();
      for (const sample of coalesced?.length ? coalesced : [event]) {
        const x = sample.clientX - rect.left;
        const y = sample.clientY - rect.top;
        if (x < 0 || y < 0 || x >= rect.width || y >= rect.height) {
          engineRef.current.leave();
          continue;
        }
        engineRef.current.pointer(x, y, sample.timeStamp);
      }
    };

    const leave = () => engineRef.current?.leave();
    const visibility = () => {
      last = 0;
      accumulator = 0;
      leave();
    };

    const resize = () => {
      const rect = host.getBoundingClientRect();
      if (!rect.width || !rect.height || !engineRef.current || !rendererRef.current) return;
      engineRef.current.resize(rect.width, rect.height);
      rendererRef.current.draw(engineRef.current, colorRef.current);
    };

    const frame = (now: number) => {
      if (disposed) return;
      raf = requestAnimationFrame(frame);
      if (!visible || document.hidden || reduced.matches) {
        last = 0;
        return;
      }
      const dt = last ? Math.min((now - last) / 1000, 0.05) : STEP;
      last = now;
      accumulator += dt;
      while (accumulator >= STEP) {
        elapsed += STEP;
        engineRef.current.tick(elapsed);
        accumulator -= STEP;
      }
      if (rendererRef.current.kind === 'canvas2d' && now - lastDraw < 50) return;
      rendererRef.current.draw(engineRef.current, colorRef.current);
      lastDraw = now;
    };

    // Load Bayer metadata (8x8 Bayer matrix)
    fetch(`${assets}body-density.json`, { signal: abort.signal })
      .then(r => (r.ok ? r.json() : null))
      .catch(() => null)
      .then(loadedMeta => {
        if (disposed) return;
        // Provide standard 8x8 Bayer matrix if network/json unavailable
        const meta = loadedMeta || {
          bayer: [
            [0, 32, 8, 40, 2, 34, 10, 42],
            [48, 16, 56, 24, 50, 18, 58, 26],
            [12, 44, 4, 36, 14, 46, 6, 38],
            [60, 28, 52, 20, 62, 30, 54, 22],
            [3, 35, 11, 43, 1, 33, 9, 41],
            [51, 19, 59, 27, 49, 17, 57, 25],
            [15, 47, 7, 39, 13, 45, 5, 37],
            [63, 31, 55, 23, 61, 29, 53, 21]
          ].map(row => row.map(v => v / 64))
        };

        const engine = new PixelMouseEngine(meta, null);
        engine.setDensityProvider((cols: number, rows: number, w: number, h: number) =>
          createAnimalDensity(animalRef.current, w, h, cols, rows)
        );
        const renderer = createPixelRenderer(canvas, meta);

        engineRef.current = engine;
        rendererRef.current = renderer;

        resize();

        canvas.dataset.renderer = renderer.kind;
        canvas.dataset.ready = 'true';

        resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(host);

        intersection = new IntersectionObserver(entries => {
          visible = entries[0].isIntersecting;
          visibility();
        });
        intersection.observe(host);

        window.addEventListener('pointermove', pointer, { passive: true });
        window.addEventListener('pointerleave', leave);
        window.addEventListener('blur', leave);
        document.addEventListener('visibilitychange', visibility);
        reduced.addEventListener('change', resize);

        raf = requestAnimationFrame(frame);
      });

    return () => {
      disposed = true;
      abort.abort();
      cancelAnimationFrame(raf);
      resizeObserver?.disconnect();
      intersection?.disconnect();
      rendererRef.current?.dispose();
      window.removeEventListener('pointermove', pointer);
      window.removeEventListener('pointerleave', leave);
      window.removeEventListener('blur', leave);
      document.removeEventListener('visibilitychange', visibility);
      reduced.removeEventListener('change', resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className={`block w-full h-full pointer-events-none select-none bg-white ${className}`}
      role="img"
      aria-label="极简全屏像素动物鼠标交互背景"
      style={{ opacity }}
    />
  );
};
