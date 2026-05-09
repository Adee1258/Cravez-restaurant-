import { useEffect, useRef } from 'react';

const FOOD_EMOJIS = ['🍛', '🫓', '☕', '🥩', '🍗', '🥘', '🍚', '🫘', '🥛', '🍮', '🫕', '🥙'];

export default function HeroCanvas() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef([]);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let W, H;

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      mouseRef.current = { x: W / 2, y: H / 2 };
    };
    resize();
    window.addEventListener('resize', resize);

    // Init particles
    particlesRef.current = Array.from({ length: 20 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.4 - 0.15,
      size: Math.random() * 28 + 16,
      emoji: FOOD_EMOJIS[Math.floor(Math.random() * FOOD_EMOJIS.length)],
      opacity: Math.random() * 0.12 + 0.04,
      rot: Math.random() * Math.PI * 2,
      rotV: (Math.random() - 0.5) * 0.008,
    }));

    const onMouse = (e) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('mousemove', onMouse);

    const draw = () => {
      W = canvas.width; H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Dark gradient bg
      const gr = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W * 0.75);
      gr.addColorStop(0, 'rgba(28,8,2,0.97)');
      gr.addColorStop(1, 'rgba(13,13,13,0.99)');
      ctx.fillStyle = gr;
      ctx.fillRect(0, 0, W, H);

      // Grid lines
      ctx.strokeStyle = 'rgba(232,84,26,0.04)';
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 60) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y < H; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

      // Mouse glow
      const { x: mx, y: my } = mouseRef.current;
      const mg = ctx.createRadialGradient(mx, my, 0, mx, my, 320);
      mg.addColorStop(0, 'rgba(232,84,26,0.1)');
      mg.addColorStop(1, 'rgba(232,84,26,0)');
      ctx.fillStyle = mg;
      ctx.fillRect(0, 0, W, H);

      // Floating emoji particles
      particlesRef.current.forEach((p) => {
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.font = `${p.size}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.emoji, 0, 0);
        ctx.restore();

        p.x += p.vx; p.y += p.vy; p.rot += p.rotV;
        if (p.y < -80) p.y = H + 80;
        if (p.x < -80) p.x = W + 80;
        if (p.x > W + 80) p.x = -80;

        const dx = p.x - mx, dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 160) { p.vx += (dx / dist) * 0.25; p.vy += (dy / dist) * 0.25; }
        p.vx *= 0.97; p.vy *= 0.97;
      });

      rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, zIndex: 0, display: 'block' }}
    />
  );
}
