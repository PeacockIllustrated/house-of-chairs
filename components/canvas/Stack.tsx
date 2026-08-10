"use client";

import { useCanvasScene } from "./useCanvasScene";
import { STONE, inkAt, AMBER } from "./ground";

/**
 * Stack, for the chairs that were designed to be bought by the dozen. Moulded
 * shells nested one into the next, which is the shape a stackable chair makes
 * in a store room and half the reason so many of them survived to be sold
 * again.
 *
 * Each shell is drawn as a closed lozenge rather than an open curve: a shell
 * seen from the side has thickness, and stroking a bare curve reads as a leaf.
 * Filling with the ground colour is what makes the one in front hide the one
 * behind, which is the whole of the effect.
 */
export default function Stack({ label }: { label: string }) {
  const COUNT = 8;

  const canvasRef = useCanvasScene({
    draw: (s) => {
      const { ctx, w, h, t, reduced } = s;
      ctx.fillStyle = STONE;
      ctx.fillRect(0, 0, w, h);

      const m = Math.min(w, h);
      const pad = m * 0.14;
      const cx = w / 2;
      const base = h - pad * 1.2;
      const pitch = (h - pad * 2.4) / COUNT;
      const half = m * 0.3;
      const thick = pitch * 0.42;
      const p = s.pointer;

      // Back of the stack first, so each shell in front overlaps the last.
      for (let i = COUNT - 1; i >= 0; i--) {
        const settle = reduced ? 0 : Math.sin(t * 0.5 + i * 0.5) * m * 0.003;
        const y = base - i * pitch + settle;
        const near =
          p.inside && !reduced
            ? Math.exp(-((y - p.y) * (y - p.y)) / (pitch * pitch * 2))
            : 0;
        const top = y - near * pitch * 0.8;
        const lean = near * m * 0.035;

        // A shell in section: a shallow dish, closed round its own thickness.
        ctx.beginPath();
        ctx.moveTo(cx - half + lean, top);
        ctx.quadraticCurveTo(cx + lean, top + pitch * 0.62, cx + half + lean, top);
        ctx.lineTo(cx + half + lean, top - thick);
        ctx.quadraticCurveTo(
          cx + lean,
          top + pitch * 0.62 - thick,
          cx - half + lean,
          top - thick,
        );
        ctx.closePath();

        ctx.fillStyle = STONE;
        ctx.fill();
        ctx.strokeStyle = near > 0.6 ? AMBER : inkAt(0.3 + (i / COUNT) * 0.3);
        ctx.lineWidth = near > 0.6 ? 1.5 : 1.1;
        ctx.lineJoin = "round";
        ctx.stroke();
      }

      // The floor the stack stands on.
      ctx.strokeStyle = inkAt(0.7);
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(cx - half * 1.4, base + pitch * 0.7);
      ctx.lineTo(cx + half * 1.4, base + pitch * 0.7);
      ctx.stroke();
    },
  });

  return <canvas ref={canvasRef} aria-label={label} />;
}
