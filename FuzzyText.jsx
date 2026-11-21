import { useEffect, useRef } from 'react';

const FONT_FAMILY = 'system-ui, "Segoe UI", Roboto, Arial, sans-serif';
const MIN_FONT_PX = 96;
const MAX_FONT_PX = 230;
const FONT_VIEWPORT_RATIO = 0.24;
const FUZZ_RANGE_PX = 30;
const MAX_DEVICE_PIXEL_RATIO = 2;

function fontSizeForViewport() {
  return Math.round(Math.min(MAX_FONT_PX, Math.max(MIN_FONT_PX, window.innerWidth * FONT_VIEWPORT_RATIO)));
}

/**
 * Big text drawn on a canvas, where every pixel row is jittered sideways,
 * giving a glitchy "fuzz". The jitter gets stronger while hovered.
 */
export default function FuzzyText({
  text,
  color = '#f8fafc',
  fontWeight = 900,
  baseIntensity = 0.18,
  hoverIntensity = 0.55,
  paused = false,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return undefined;

    const offscreen = document.createElement('canvas');
    const offCtx = offscreen.getContext('2d');
    if (!offCtx) return undefined;

    let frameId = 0;
    let intensity = baseIntensity;
    let textWidth = 0;
    let textHeight = 0;
    let fuzzRange = 0;

    const renderTextToOffscreen = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DEVICE_PIXEL_RATIO);
      const fontPx = fontSizeForViewport() * dpr;
      const font = `${fontWeight} ${fontPx}px ${FONT_FAMILY}`;

      offCtx.font = font;
      const metrics = offCtx.measureText(text);
      const ascent = metrics.actualBoundingBoxAscent || fontPx * 0.8;
      const descent = metrics.actualBoundingBoxDescent || fontPx * 0.2;
      const padding = Math.ceil(fontPx * 0.06);

      textWidth = Math.ceil(metrics.width) + padding * 2;
      textHeight = Math.ceil(ascent + descent) + padding * 2;
      fuzzRange = FUZZ_RANGE_PX * dpr;

      offscreen.width = textWidth;
      offscreen.height = textHeight;
      offCtx.font = font; // resizing a canvas resets its context state
      offCtx.fillStyle = color;
      offCtx.textBaseline = 'alphabetic';
      offCtx.fillText(text, padding, padding + ascent);

      canvas.width = textWidth + fuzzRange * 2;
      canvas.height = textHeight;
      canvas.style.width = `${canvas.width / dpr}px`;
      canvas.style.height = `${canvas.height / dpr}px`;
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let row = 0; row < textHeight; row += 1) {
        const offsetX = paused ? 0 : Math.floor(intensity * (Math.random() - 0.5) * fuzzRange);
        ctx.drawImage(offscreen, 0, row, textWidth, 1, fuzzRange + offsetX, row, textWidth, 1);
      }
      if (!paused) frameId = window.requestAnimationFrame(draw);
    };

    const handlePointerEnter = () => {
      intensity = hoverIntensity;
    };
    const handlePointerLeave = () => {
      intensity = baseIntensity;
    };
    const handleResize = () => {
      renderTextToOffscreen();
      if (paused) draw();
    };

    renderTextToOffscreen();
    draw();
    canvas.addEventListener('pointerenter', handlePointerEnter);
    canvas.addEventListener('pointerleave', handlePointerLeave);
    window.addEventListener('resize', handleResize);

    return () => {
      window.cancelAnimationFrame(frameId);
      canvas.removeEventListener('pointerenter', handlePointerEnter);
      canvas.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, [text, color, fontWeight, baseIntensity, hoverIntensity, paused]);

  return <canvas ref={canvasRef} className="fuzzy-text" role="img" aria-label={text} />;
}
