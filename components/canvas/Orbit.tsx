"use client";

import { useCanvasScene } from "./useCanvasScene";
import { STONE, inkAt, AMBER, SEA } from "./ground";

/**
 * Orbit, for the years when the future felt close. Tilted ellipses turning at
 * their own rates around a small filled nucleus, the atomic motif that ended
 * up on everything from clock faces to room dividers between the fifties and
 * the early seventies. Each shell carries one bead, so the drawing has
 * somewhere for the eye to land. Under reduced motion the shells hold at a
 * spread where none of them overlap and the beads sit apart.
 */
export default function Orbit({ label }: { label: string }) {
  const SHELLS = [
    { r: 0.46, tilt: -0.35, rate: 0.19, bead: AMBER },
    { r: 0.34, tilt: 0.55, rate: -0.27, bead: SEA },
    { r: 0.22, tilt: 1.15, rate: 0.38, bead: AMBER },
  ];

  const canvasRef = useCanvasScene({
    draw: (s) => {
      const { ctx, w, h, t, reduced } = s;
      ctx.fillStyle = STONE;
      ctx.fillRect(0, 0, w, h);

      const m = Math.min(w, h);
      const cx = w / 2;
      const cy = h / 2;
      const p = s.pointer;

      // The cursor tips the whole system a little, as though you were looking
      // at the model from slightly to one side.
      const tipX = p.inside && !reduced ? ((p.x - cx) / w) * 0.5 : 0;
      const tipY = p.inside && !reduced ? ((p.y - cy) / h) * 0.28 : 0;

      for (let i = 0; i < SHELLS.length; i++) {
        const sh = SHELLS[i];
        const rx = m * sh.r;
        const ry = m * sh.r * (0.34 + Math.abs(Math.sin(sh.tilt + tipY)) * 0.3);
        const rot = sh.tilt + tipX + (reduced ? 0 : t * sh.rate);

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rot);
        ctx.strokeStyle = inkAt(0.34 + i * 0.08);
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        ctx.stroke();

        // One bead per shell, held apart from its neighbours at rest.
        const phase = reduced
          ? i * 2.1
          : t * (sh.rate * 2.4) + i * 2.1;
        ctx.fillStyle = sh.bead;
        ctx.beginPath();
        ctx.arc(
          Math.cos(phase) * rx,
          Math.sin(phase) * ry,
          Math.max(2, m * 0.018),
          0,
          Math.PI * 2,
        );
        ctx.fill();
        ctx.restore();
      }

      // The nucleus, the one solid in the drawing.
      ctx.fillStyle = inkAt(0.85);
      ctx.beginPath();
      ctx.arc(cx, cy, Math.max(3, m * 0.035), 0, Math.PI * 2);
      ctx.fill();
    },
  });

  return <canvas ref={canvasRef} aria-label={label} />;
}
