import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

export const School3DBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    // 3D Particles & Nodes
    const particleCount = Math.min(width > 768 ? 65 : 35, 75);
    interface Particle3D {
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;
      size: number;
      color: string;
      shape: 'circle' | 'square' | 'triangle';
    }

    const particles: Particle3D[] = [];
    const colorsDark = ['#38bdf8', '#60a5fa', '#818cf8', '#a855f7', '#34d399'];
    const colorsLight = ['#2563eb', '#0284c7', '#4f46e5', '#7c3aed', '#059669'];
    const activeColors = isDark ? colorsDark : colorsLight;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: (Math.random() - 0.5) * width * 1.5,
        y: (Math.random() - 0.5) * height * 1.5,
        z: Math.random() * 800 + 200,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        vz: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 3.5 + 1.5,
        color: activeColors[Math.floor(Math.random() * activeColors.length)],
        shape: i % 5 === 0 ? 'triangle' : i % 3 === 0 ? 'square' : 'circle',
      });
    }

    // Mouse Parallax Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetMouseX = (e.clientX - rect.left - width / 2) * 0.08;
      targetMouseY = (e.clientY - rect.top - height / 2) * 0.08;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 3D Geometric Ring Rotation
    let ringAngleX = 0;
    let ringAngleY = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse damping
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      const fov = 400;
      const centerX = width / 2 + mouseX;
      const centerY = height / 2 + mouseY;

      // Draw Rotating 3D Futuristic Wireframe Globe Ring (Academy Halo)
      ringAngleX += 0.003;
      ringAngleY += 0.002;
      const ringRadius = Math.min(width, height) * 0.32;
      const ringSegments = 24;

      ctx.save();
      ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.12)' : 'rgba(37, 99, 235, 0.1)';
      ctx.lineWidth = 1.2;

      for (let lat = -2; lat <= 2; lat++) {
        const r = ringRadius * Math.cos((lat * Math.PI) / 6);
        const yOffset = ringRadius * Math.sin((lat * Math.PI) / 6);
        ctx.beginPath();
        for (let i = 0; i <= ringSegments; i++) {
          const theta = (i * 2 * Math.PI) / ringSegments + ringAngleY;
          const x3d = r * Math.cos(theta);
          const z3d = r * Math.sin(theta) + 700;
          const y3d = yOffset * Math.cos(ringAngleX) - (r * Math.sin(theta)) * Math.sin(ringAngleX);

          const scale = fov / (fov + z3d);
          const x2d = centerX + x3d * scale;
          const y2d = centerY + y3d * scale;

          if (i === 0) ctx.moveTo(x2d, y2d);
          else ctx.lineTo(x2d, y2d);
        }
        ctx.stroke();
      }
      ctx.restore();

      // Update and project 3D particles
      const projected: { x: number; y: number; size: number; alpha: number; color: string; shape: string }[] = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        // Boundaries wrap
        if (p.x < -width) p.x = width;
        if (p.x > width) p.x = -width;
        if (p.y < -height) p.y = height;
        if (p.y > height) p.y = -height;
        if (p.z < 100) p.z = 900;
        if (p.z > 900) p.z = 100;

        const scale = fov / (fov + p.z);
        const x2d = centerX + p.x * scale;
        const y2d = centerY + p.y * scale;
        const alpha = Math.max(0.1, Math.min(0.85, (1 - p.z / 900) * (isDark ? 0.9 : 0.6)));

        projected.push({
          x: x2d,
          y: y2d,
          size: p.size * scale,
          alpha,
          color: p.color,
          shape: p.shape,
        });

        // Draw individual 3D node
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;

        if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(x2d, y2d, Math.max(1, p.size * scale), 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === 'square') {
          const s = Math.max(2, p.size * scale * 1.5);
          ctx.fillRect(x2d - s / 2, y2d - s / 2, s, s);
        } else {
          // Triangle (STEM icon node)
          const s = Math.max(2, p.size * scale * 1.8);
          ctx.beginPath();
          ctx.moveTo(x2d, y2d - s);
          ctx.lineTo(x2d - s, y2d + s);
          ctx.lineTo(x2d + s, y2d + s);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      }

      // Draw constellation laser links between nearby 3D nodes
      ctx.lineWidth = 0.8;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const p1 = projected[i];
          const p2 = projected[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const linkAlpha = (1 - dist / 110) * Math.min(p1.alpha, p2.alpha) * (isDark ? 0.45 : 0.25);
            ctx.save();
            ctx.globalAlpha = linkAlpha;
            ctx.strokeStyle = isDark ? '#38bdf8' : '#2563eb';
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* 3D Atmospheric Video Loop Layer */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
          isDark ? 'opacity-25 mix-blend-screen' : 'opacity-10 mix-blend-multiply'
        }`}
      >
        <source
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
          type="video/mp4"
        />
      </video>

      {/* Real-time 3D Interactive WebGL/Canvas Matrix Layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* Cybernetic Grid & Volumetric Glow Overlays */}
      <div
        className={`absolute inset-0 transition-colors duration-500 ${
          isDark
            ? 'bg-gradient-to-b from-slate-950/75 via-slate-950/85 to-slate-950'
            : 'bg-gradient-to-b from-white/80 via-slate-50/90 to-slate-50'
        }`}
      />

      {/* Glowing Orb Accents */}
      <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-brand-500/10 rounded-full blur-[140px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[130px] pointer-events-none" />
    </div>
  );
};
