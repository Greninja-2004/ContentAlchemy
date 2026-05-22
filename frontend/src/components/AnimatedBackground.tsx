"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let lastScrollY = typeof window !== "undefined" ? window.scrollY : 0;
    let scrollSpeed = 0;

    const mouse = { x: -1000, y: -1000, active: false };

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      baseVx: number;
      baseVy: number;
      size: number;
      opacity: number;
      color: string;
    }

    let particles: Particle[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const getColors = (theme: string | undefined) => {
      if (theme === "dark") {
        return [
          "rgba(99, 102, 241,", // Indigo
          "rgba(168, 85, 247,", // Purple
          "rgba(6, 182, 212,"   // Cyan
        ];
      }
      return [
        "rgba(79, 70, 229,",  // Indigo-600
        "rgba(139, 92, 246,", // Violet-500
        "rgba(8, 145, 178,"   // Cyan-600
      ];
    };

    const createParticles = () => {
      particles = [];
      const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 100);
      const colorPalettes = getColors(resolvedTheme);
      for (let i = 0; i < count; i++) {
        const vx = (Math.random() - 0.5) * 0.4;
        const vy = (Math.random() - 0.5) * 0.4;
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx,
          vy,
          baseVx: vx,
          baseVy: vy,
          size: Math.random() * 2.5 + 0.5,
          opacity: Math.random() * 0.4 + 0.1,
          color: colorPalettes[Math.floor(Math.random() * colorPalettes.length)],
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
      mouse.active = false;
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const diff = currentScrollY - lastScrollY;
      scrollSpeed = Math.min(Math.abs(diff) * 0.15, 8);
      lastScrollY = currentScrollY;
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      scrollSpeed *= 0.95;

      const isDark = resolvedTheme === "dark";

      particles.forEach((p, i) => {
        const currentVx = p.vx + (p.vx > 0 ? scrollSpeed * 0.4 : -scrollSpeed * 0.4);
        const currentVy = p.vy + (p.vy > 0 ? scrollSpeed * 0.4 : -scrollSpeed * 0.4);

        p.x += currentVx;
        p.y += currentVy;

        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 200) {
            const force = (200 - dist) / 200;
            p.x += (dx / dist) * force * 0.8;
            p.y += (dy / dist) * force * 0.8;
          }
        }

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.opacity})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = p.x - particles[j].x;
          const dy = p.y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const lineOpacity = 0.08 * (1 - dist / 120);
            ctx.strokeStyle = isDark
              ? `rgba(168, 85, 247, ${lineOpacity})`
              : `rgba(99, 102, 241, ${lineOpacity})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }

        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 160) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            const mouseLineOpacity = 0.12 * (1 - dist / 160);
            ctx.strokeStyle = isDark
              ? `rgba(6, 182, 212, ${mouseLineOpacity})`
              : `rgba(79, 70, 229, ${mouseLineOpacity})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      });

      animationId = requestAnimationFrame(draw);
    };

    resize();
    createParticles();
    draw();

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("scroll", handleScroll);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [resolvedTheme]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ opacity: resolvedTheme === "dark" ? 0.75 : 0.5 }}
      />
      <div className="absolute inset-0 canvas-bg-overlay pointer-events-none" />
    </div>
  );
}
