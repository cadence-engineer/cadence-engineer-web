"use client";

import { useEffect, useRef } from "react";

type NodePoint = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
};

const NODE_COUNT = 26;
const LINK_DISTANCE = 170;

export function NodeNetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let width = 0;
    let height = 0;
    let animationFrameId = 0;

    const nodes: NodePoint[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = rect.width;
      height = rect.height;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const seedNodes = () => {
      nodes.length = 0;
      for (let i = 0; i < NODE_COUNT; i += 1) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          r: 1.8 + Math.random() * 2,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < nodes.length; i += 1) {
        const a = nodes[i];

        if (!reducedMotion) {
          a.x += a.vx;
          a.y += a.vy;

          if (a.x <= 0 || a.x >= width) a.vx *= -1;
          if (a.y <= 0 || a.y >= height) a.vy *= -1;
        }

        for (let j = i + 1; j < nodes.length; j += 1) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distance = Math.hypot(dx, dy);

          if (distance < LINK_DISTANCE) {
            const alpha = (1 - distance / LINK_DISTANCE) * 0.22;
            ctx.strokeStyle =
              i % 4 === 0
                ? `rgba(255,45,85,${alpha})`
                : `rgba(0,0,0,${alpha * 0.55})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        const pinkNode = i % 5 === 0;
        ctx.fillStyle = pinkNode
          ? "rgba(255,45,85,0.85)"
          : "rgba(0,0,0,0.45)";
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!reducedMotion) {
        animationFrameId = window.requestAnimationFrame(draw);
      }
    };

    resize();
    seedNodes();
    if (reducedMotion) {
      draw();
    } else {
      animationFrameId = window.requestAnimationFrame(draw);
    }

    const onResize = () => {
      resize();
      seedNodes();
      if (reducedMotion) {
        draw();
      }
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
