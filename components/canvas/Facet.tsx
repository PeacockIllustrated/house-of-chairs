"use client";

import { useCanvasScene } from "./useCanvasScene";
import { STONE, inkAt } from "./ground";

/**
 * Facet, for the chairs you can see through. Overlapping planes of tinted
 * polycarbonate, turning slowly against each other so the places they cross
 * darken and clear the way a moulded transparent chair does when you walk past
 * it. Nothing here is opaque: the drawing is made entirely of what the
 * overlaps do, which is the honest description of the material. Under reduced
 * motion the planes hold at an angle where three overlaps are visible.
 */
export default function Facet({ label }: { label: string }) {
  const PLANES = [
    { n: 6, r: 0.42, rate: 0.09, phase: 0.0, tint: [94, 122, 107] },
    { n: 5, r: 0.36, rate: -0.13, phase: 1.2, tint: [201, 123, 61] },
    { n: 4, r: 0.3, rate: 0.17, phase: 2.4, tint: [122, 110, 96] },
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

      // The cursor leans the stack, so the overlaps move under the hand.
      const leanX = p.inside && !reduced ? ((p.x - cx) / w) * 0.6 : 0;
      const leanY = p.inside && !reduced ? ((p.y - cy) / h) * 0.22 : 0;

      // Multiply is what makes the crossings darken rather than simply stack,
      // which is the whole point of the study.
      ctx.globalCompositeOperation = "multiply";
      for (const pl of PLANES) {
        const rot = pl.phase + leanX + (reduced ? 0 : t * pl.rate);
        const squash = 1 - Math.abs(leanY) * 0.5;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rot);
        ctx.beginPath();
        for (let k = 0; k < pl.n; k++) {
          const a = (k / pl.n) * Math.PI * 2;
          const x = Math.cos(a) * m * pl.r;
          const y = Math.sin(a) * m * pl.r * squash;
          if (k === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fillStyle = `rgba(${pl.tint[0]},${pl.tint[1]},${pl.tint[2]},0.3)`;
        ctx.fill();
        ctx.restore();
      }
      ctx.globalCompositeOperation = "source-over";

      // Edges last, drawn over the tints, so each plane keeps a drawn outline
      // the way a moulded edge catches a line of light.
      for (const pl of PLANES) {
        const rot = pl.phase + leanX + (reduced ? 0 : t * pl.rate);
        const squash = 1 - Math.abs(leanY) * 0.5;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rot);
        ctx.beginPath();
        for (let k = 0; k < pl.n; k++) {
          const a = (k / pl.n) * Math.PI * 2;
          const x = Math.cos(a) * m * pl.r;
          const y = Math.sin(a) * m * pl.r * squash;
          if (k === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = inkAt(0.34);
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
      }
    },
  });

  return <canvas ref={canvasRef} aria-label={label} />;
}
