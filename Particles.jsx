import { useEffect, useRef } from 'react';

const PARTICLES_PER_PIXEL = 1 / 14000;
const MAX_PARTICLES = 140;
const MAX_SPEED = 0.35;
const LINK_DISTANCE = 120;
const MOUSE_RADIUS = 140;
const MOUSE_PUSH = 2;
const MAX_DEVICE_PIXEL_RATIO = 2;

function createParticle(width, height) {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 2 * MAX_SPEED,
    vy: (Math.random() - 0.5) * 2 * MAX_SPEED,
    radius: Math.random() * 1.6 + 0.6,
  };
}

/**
 * Full-screen constellation of drifting dots that link up when close
 * and get pushed away by the pointer.
 * @param {string} rgb   colour as "r, g, b"
 * @param {boolean} paused  render one static frame (reduced motion)
 */
export default function Particles({ rgb = '249, 115, 22', paused = false }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return undefined;

    let width = 0;
    let height = 0;
    let particles = [];
    let frameId = 0;
    const pointer = { x: -Infinity, y: -Infinity };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DEVICE_PIXEL_RATIO);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(MAX_PARTICLES, Math.round(width * height * PARTICLES_PER_PIXEL));
      particles = Array.from({ length: count }, () => createParticle(width, height));
    };

    const moveParticle = (particle) => {
      const dx = particle.x - pointer.x;
      const dy = particle.y - pointer.y;
      const distance = Math.hypot(dx, dy);
      if (distance > 0 && distance < MOUSE_RADIUS) {
        const force = (MOUSE_RADIUS - distance) / MOUSE_RADIUS;
        particle.x += (dx / distance) * force * MOUSE_PUSH;
        particle.y += (dy / distance) * force * MOUSE_PUSH;
      }

      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x <= 0 || particle.x >= width) particle.vx *= -1;
      if (particle.y <= 0 || particle.y >= height) particle.vy *= -1;
      particle.x = Math.min(Math.max(particle.x, 0), width);
      particle.y = Math.min(Math.max(particle.y, 0), height);
    };

    const drawLinks = () => {
      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const a = particles[i];
          const b = particles[j];
          const distance = Math.hypot(a.x - b.x, a.y - b.y);
          if (distance >= LINK_DISTANCE) continue;

          ctx.strokeStyle = `rgba(${rgb}, ${(1 - distance / LINK_DISTANCE) * 0.25})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (const particle of particles) {
        if (!paused) moveParticle(particle);
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb}, 0.75)`;
        ctx.fill();
      }
      drawLinks();
      if (!paused) frameId = window.requestAnimationFrame(draw);
    };

    const handlePointerMove = (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    };
    const handlePointerLeave = () => {
      pointer.x = -Infinity;
      pointer.y = -Infinity;
    };
    const handleResize = () => {
      resize();
      if (paused) draw();
    };

    resize();
    draw();
    window.addEventListener('resize', handleResize);
    window.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [rgb, paused]);

  return <canvas ref={canvasRef} className="particles" aria-hidden="true" />;
}
