"use client";

import { useRef } from "react";
import { useCanvasScene } from "./useCanvasScene";
import { STONE, inkAt, AMBER, SEA, ROSE } from "./ground";

interface Chip {
  x: number;
  y: number;
  r: number;
  rot: number;
  sides: number;
  col: string;
  seed: number;
}

/**
 * Terrazzo, for the Italian rooms. Marble chips set in a ground and polished
 * flat, the floor under half the furniture that came out of Milan. The chips
 * are irregular polygons rather than circles, because ground stone never
 * breaks round, and they drift by a hair so the surface is never quite still.
 * Passing the cursor over a chip lifts and turns it. Under reduced motion the
 * whole floor is laid and still.
 */
export default function Terrazzo({ label }: { label: string }) {
  const chips = useRef<Chip[]>([]);

  const lay = () => {
    if (chips.current.length) return;
    const palette = [AMBER, SEA, ROSE, "#7A6E60", "#3A2E24"];
    const out: Chip[] = [];
    for (let i = 0; i < 46; i++) {
      out.push({
        x: Math.random(),
        y: Math.random(),
        r: 0.018 + Math.random() * 0.042,
        rot: Math.random() * Math.PI,
        sides: 5 + Math.floor(Math.random() * 3),
        col: palette[Math.floor(Math.random() * palette.length)],
        seed: Math.random() * 10,
      });
    }
    chips.current = out;
  };

  const canvasRef = useCanvasScene({
    init: lay,
    draw: (s) => {
      const { ctx, w, h, t, reduced } = s;
      ctx.fillStyle = STONE;
      ctx.fillRect(0, 0, w, h);

      const m = Math.min(w, h);
      const p = s.pointer;

      for (const c of chips.current) {
        const cx = c.x * w;
        const cy = c.y * h;
        const near =
          p.inside && !reduced
            ? Math.exp(
                -((cx - p.x) * (cx - p.x) + (cy - p.y) * (cy - p.y)) /
                  (m * m * 0.03),
              )
            : 0;
        const drift = reduced ? 0 : Math.sin(t * 0.4 + c.seed) * m * 0.004;
        const r = m * c.r * (1 + near * 0.22);
        const rot = c.rot + (reduced ? 0 : t * 0.05 * (c.seed % 2 ? 1 : -1)) + near * 0.5;

        ctx.save();
        ctx.translate(cx + drift, cy - near * m * 0.012);
        ctx.rotate(rot);
        ctx.beginPath();
        for (let k = 0; k < c.sides; k++) {
          // The radius wobbles per corner, which is what stops a polygon
          // reading as a polygon and starts it reading as a broken chip.
          const a = (k / c.sides) * Math.PI * 2;
          const rr = r * (0.72 + ((Math.sin(c.seed * 9 + k * 3) + 1) / 2) * 0.5);
          const x = Math.cos(a) * rr;
          const y = Math.sin(a) * rr;
          if (k === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fillStyle = c.col;
        ctx.globalAlpha = 0.72 + near * 0.28;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.strokeStyle = inkAt(0.16);
        ctx.lineWidth = 0.8;
        ctx.stroke();
        ctx.restore();
      }

      // The edge of the poured slab.
      ctx.strokeStyle = inkAt(0.6);
      ctx.lineWidth = 1.2;
      const pad = m * 0.06;
      ctx.strokeRect(pad, pad, w - pad * 2, h - pad * 2);
    },
  });

  return <canvas ref={canvasRef} aria-label={label} />;
}
