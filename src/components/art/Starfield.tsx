"use client";
import { useEffect, useRef } from "react";

/** Twinkling, slowly drifting canvas starfield with mouse parallax and occasional shooting stars. Static under reduced motion. */
export function Starfield({ density = 0.00018, className = "", shooting = true }: { density?: number; className?: string; shooting?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext("2d"); if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, raf = 0, visible = true;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    type S = { x: number; y: number; r: number; z: number; tw: number; sp: number; hue: number };
    let stars: S[] = [];
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    let shoot: { x: number; y: number; vx: number; vy: number; life: number } | null = null;
    const resize = () => {
      const r = cv.getBoundingClientRect(); w = r.width; h = r.height;
      cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.min(900, Math.round(w * h * density));
      stars = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, r: Math.random() ** 3 * 1.8 + 0.3, z: Math.random() * 0.9 + 0.1, tw: Math.random() * Math.PI * 2, sp: 0.5 + Math.random() * 1.5, hue: Math.random() }));
    };
    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      mouse.x += (mouse.tx - mouse.x) * 0.04; mouse.y += (mouse.ty - mouse.y) * 0.04;
      for (const s of stars) {
        const a = reduce ? 0.8 : 0.45 + 0.55 * Math.abs(Math.sin(s.tw + t * 0.0006 * s.sp));
        let x = s.x + mouse.x * s.z * 18; const y = s.y + mouse.y * s.z * 12;
        if (!reduce) { x = (x + t * 0.004 * s.z) % w; }
        ctx.globalAlpha = a;
        ctx.fillStyle = s.hue > 0.85 ? "#ffd6b8" : s.hue > 0.7 ? "#c9b8ff" : "#fffaf0";
        ctx.beginPath(); ctx.arc(x, y, s.r, 0, Math.PI * 2); ctx.fill();
        if (s.r > 1.5) { ctx.globalAlpha = a * 0.25; ctx.beginPath(); ctx.arc(x, y, s.r * 3.2, 0, Math.PI * 2); ctx.fill(); }
      }
      if (shooting && !reduce) {
        if (!shoot && Math.random() < 0.004) shoot = { x: Math.random() * w * 0.7, y: Math.random() * h * 0.4, vx: 7 + Math.random() * 4, vy: 2.5 + Math.random() * 2, life: 1 };
        if (shoot) {
          const g = ctx.createLinearGradient(shoot.x, shoot.y, shoot.x - shoot.vx * 14, shoot.y - shoot.vy * 14);
          g.addColorStop(0, "rgba(255,240,210,.95)"); g.addColorStop(1, "rgba(255,240,210,0)");
          ctx.globalAlpha = shoot.life; ctx.strokeStyle = g; ctx.lineWidth = 1.6;
          ctx.beginPath(); ctx.moveTo(shoot.x, shoot.y); ctx.lineTo(shoot.x - shoot.vx * 14, shoot.y - shoot.vy * 14); ctx.stroke();
          shoot.x += shoot.vx; shoot.y += shoot.vy; shoot.life -= 0.012;
          if (shoot.life <= 0 || shoot.x > w + 100) shoot = null;
        }
      }
      ctx.globalAlpha = 1;
      if (!reduce && visible) raf = requestAnimationFrame(draw);
    };
    const onMove = (e: PointerEvent) => { mouse.tx = e.clientX / window.innerWidth - 0.5; mouse.ty = e.clientY / window.innerHeight - 0.5; };
    const io = new IntersectionObserver(([en]) => { const v = en.isIntersecting; if (v && !visible && !reduce) { visible = true; raf = requestAnimationFrame(draw); } visible = v; });
    resize(); io.observe(cv); draw(0);
    window.addEventListener("resize", resize); window.addEventListener("pointermove", onMove, { passive: true });
    return () => { cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener("resize", resize); window.removeEventListener("pointermove", onMove); };
  }, [density, shooting]);
  return <canvas ref={ref} className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} aria-hidden />;
}
