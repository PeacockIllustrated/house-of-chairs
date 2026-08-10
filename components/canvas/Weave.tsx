"use client";

import { useCanvasScene } from "./useCanvasScene";
import { STONE, inkAt } from "./ground";

/**
 * Weave, for the eras that seat you on something hand worked. Warp and weft
 * crossing in a paper cord lattice, the seat of half the Danish and
 * Scandinavian chairs we sell. Strands going one way are drawn broken where
 * the other way passes over, so the over and under is real rather than
 * suggested, and the whole cloth breathes as though under slight tension. The
 * cursor lifts the strands nearest it, the way a palm does on a cord seat.
 */
export default function Weave({ label }: { label: string }) {
  const N = 13;

  const canvasRef = useCanvasScene({
    draw: (s) => {
      const { ctx, w, h, t, reduced } = s;
      ctx.fillStyle = STONE;
      ctx.fillRect(0, 0, w, h);

      const m = Math.min(w, h);
      const pad = m * 0.14;
      const box = { x: pad, y: pad, w: w - pad * 2, h: h - pad * 2 };
      const stepX = box.w / (N - 1);
      const stepY = box.h / (N - 1);
      const cord = Math.max(1.4, m * 0.013);
      const p = s.pointer;

      // How far a strand rises where the hand is, falling off with distance.
      const lift = (x: number, y: number) => {
        if (!p.inside || reduced) return 0;
        const d2 = (x - p.x) * (x - p.x) + (y - p.y) * (y - p.y);
        return Math.exp(-d2 / (m * m * 0.045)) * m * 0.05;
      };

      const breathe = reduced ? 0 : Math.sin(t * 0.7) * m * 0.004;

      ctx.lineCap = "round";
      ctx.lineWidth = cord;

      // Warp, the strands running away from you, drawn whole.
      for (let i = 0; i < N; i++) {
        const x = box.x + i * stepX;
        ctx.strokeStyle = inkAt(i % 2 === 0 ? 0.52 : 0.34);
        ctx.beginPath();
        for (let j = 0; j <= N * 3; j++) {
          const y = box.y + (j / (N * 3)) * box.h;
          const dx = Math.sin(j * 0.5 + i) * breathe - lift(x, y) * 0.35;
          if (j === 0) ctx.moveTo(x + dx, y);
          else ctx.lineTo(x + dx, y);
        }
        ctx.stroke();
      }

      // Weft, drawn in gaps so the warp reads as passing over it every other
      // crossing. The gap is the cord gauge plus a hair, which is what makes
      // the lattice read as woven rather than as a grid.
      for (let j = 0; j < N; j++) {
        const y = box.y + j * stepY;
        ctx.strokeStyle = inkAt(j % 2 === 0 ? 0.34 : 0.52);
        for (let i = 0; i < N - 1; i++) {
          const over = (i + j) % 2 === 0;
          const x0 = box.x + i * stepX + (over ? cord * 1.6 : 0);
          const x1 = box.x + (i + 1) * stepX - (over ? cord * 1.6 : 0);
          const rise = lift((x0 + x1) / 2, y);
          ctx.beginPath();
          ctx.moveTo(x0, y - rise + breathe);
          ctx.lineTo(x1, y - rise + breathe);
          ctx.stroke();
        }
      }

      // The seat rail the cloth is stretched across.
      ctx.strokeStyle = inkAt(0.7);
      ctx.lineWidth = 1.2;
      ctx.strokeRect(box.x - cord, box.y - cord, box.w + cord * 2, box.h + cord * 2);
    },
  });

  return <canvas ref={canvasRef} aria-label={label} />;
}
