'use client';

import { useEffect, useRef } from 'react';

/**
 * DitherBackground — full-bleed canvas that renders a photo as an animated
 * Bayer ordered-dither (black & white dot pattern), in the style of
 * Aceternity's "Hero Section With Dither Background".
 *
 * - Renders at a low internal resolution and scales up with `image-rendering:
 *   pixelated` for the chunky retro look and cheap per-frame cost.
 * - Animates via a slow drift/zoom of the sampled image and a subtle
 *   time-based threshold wobble, so the pattern feels alive without churn.
 * - Honors prefers-reduced-motion by drawing a single static frame.
 * - Falls back to a plain <img>-style background (no dither) if the image
 *   fails to load, so the hero is never blank.
 */
export const DitherBackground: React.FC<{
  src: string;
  className?: string;
  /** Base brightness multiplier applied before dithering (0.5–2). */
  brightness?: number;
  /** Pixel size of one dither cell in internal-resolution px. */
  cellSize?: number;
  /** Light theme: render dark dots on a light base instead of white on black. */
  invert?: boolean;
}> = ({ src, className, brightness = 1.25, cellSize = 2, invert = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;
    let disposed = false;

    // 8x8 Bayer matrix, normalized to 0..1
    const BAYER = [
      [0, 32, 8, 40, 2, 34, 10, 42],
      [48, 16, 56, 24, 50, 18, 58, 26],
      [12, 44, 4, 36, 14, 46, 6, 38],
      [60, 28, 52, 20, 62, 30, 54, 22],
      [3, 35, 11, 43, 1, 33, 9, 41],
      [51, 19, 59, 27, 49, 17, 57, 25],
      [15, 47, 7, 39, 13, 45, 5, 37],
      [63, 31, 55, 23, 61, 29, 53, 21],
    ].map((row) => row.map((v) => (v + 0.5) / 64));

    let raf = 0;
    let last = 0;
    const offscreen = document.createElement('canvas');

    const draw = (time: number) => {
      if (disposed || !ctx) return;
      const w = canvas.width;
      const h = canvas.height;

      // Slow drift + breathing zoom of the sampled source.
      const t = time / 1000;
      const zoom = 1.12 + 0.04 * Math.sin(t * 0.18);
      const driftX = Math.sin(t * 0.11) * 14;
      const driftY = Math.cos(t * 0.09) * 10;

      const base = invert ? '#f2f6ec' : '#000';
      const dot = invert ? '#14210d' : '#fff';

      ctx.fillStyle = base;
      ctx.fillRect(0, 0, w, h);

      // Sample the image into an offscreen buffer at cell resolution.
      const gw = Math.ceil(w / cellSize);
      const gh = Math.ceil(h / cellSize);
      const off = offscreen;
      const octx = off.getContext('2d', {
        alpha: false,
        willReadFrequently: true,
      })!;
      off.width = gw;
      off.height = gh;
      octx.imageSmoothingEnabled = true;

      // Cover-fit math: scale source to fill the grid, centered.
      const iw = img.width || 1;
      const ih = img.height || 1;
      const scale = Math.max(gw / iw, gh / ih) * zoom;
      const dw = iw * scale;
      const dh = ih * scale;
      const dx = (gw - dw) / 2 + driftX / cellSize;
      const dy = (gh - dh) / 2 + driftY / cellSize;
      octx.drawImage(img, dx, dy, dw, dh);

      const data = octx.getImageData(0, 0, gw, gh).data;

      ctx.fillStyle = base;
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = dot;

      const wobble = reduced ? 0 : Math.sin(t * 1.7) * 0.06;

      for (let gy = 0; gy < gh; gy++) {
        for (let gx = 0; gx < gw; gx++) {
          const i = (gy * gw + gx) * 4;
          // Luma 0..1, gently lifted so midtones keep detail like the ref.
          const luma =
            (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) /
            255 *
            brightness;
          const threshold =
            BAYER[gy & 7][gx & 7] + wobble * Math.sin(gx * 0.35 + gy * 0.22);
          if (luma > threshold) {
            ctx.fillRect(gx * cellSize, gy * cellSize, cellSize, cellSize);
          }
        }
      }
    };

    const loop = (time: number) => {
      if (disposed) return;
      // ~24fps cap — plenty for a slow drift, halves the cost.
      if (time - last > 1000 / 24) {
        last = time;
        draw(time);
      }
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (disposed) return;
      const resize = () => {
        if (!canvas || !ctx) return;
        const rect = canvas.getBoundingClientRect();
        // Internal resolution: low for chunky cells + cheap dither pass.
        canvas.width = Math.max(2, Math.round(rect.width / 2));
        canvas.height = Math.max(2, Math.round(rect.height / 2));
        if (reduced) draw(0); // redraw static frame after resize
      };
      resize();
      window.addEventListener('resize', resize);

      if (reduced) {
        draw(0); // single static frame
      } else {
        raf = requestAnimationFrame(loop);
      }
      cleanupFns.push(() => window.removeEventListener('resize', resize));
    };

    const cleanupFns: Array<() => void> = [];

    if (img.complete && img.naturalWidth > 0) {
      start();
    } else {
      img.onload = start;
      img.onerror = () => {
        // Fallback: solid dark canvas so hero text stays readable.
        if (disposed || !ctx) return;
        ctx.fillStyle = '#111';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      };
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      cleanupFns.forEach((fn) => fn());
    };
  }, [src, brightness, cellSize, invert]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{ imageRendering: 'pixelated' }}
    />
  );
};

export default DitherBackground;
