"use client";

import { useCanvasScene } from "./useCanvasScene";
import { STONE, inkAt, AMBER } from "./ground";

/**
 * Arcade, for the eras that quoted the past on purpose. A colonnade of arches
 * receding, the motif postmodern designers took off Italian architecture and
 * put on cabinets, mirrors and chair backs through the eighties. Each arch is
 * a little shorter and paler than the one in front, so the row reads as depth
 * rather than as a pattern, and the one nearest the cursor fills. Under
 * reduced motion the fill rests on the middle arch.
 */
export default function Arcade({ label }: { label: string }) {
  const COUNT = 5;

  const canvasRef = useCanvasScene({
    draw: (s) => {
      const { ctx, w, h, t, reduced } = s;
      ctx.fillStyle = STONE;
      ctx.fillRect(0, 0, w, h);

      const m = Math.min(w, h);
      const pad = m * 0.1;
      const floor = h - pad;
      const span = (w - pad * 2) / COUNT;
      const p = s.pointer;

      // Which arch the eye is on: the cursor's column, or a slow sweep.
      const sweep = reduced
        ? (COUNT - 1) / 2
        : ((Math.sin(t * 0.35) + 1) / 2) * (COUNT - 1);
      const focus = p.inside && !reduced ? (p.x - pad) / span - 0.5 : sweep;

      for (let i = COUNT - 1; i >= 0; i--) {
        // Drawn back to front so the nearer arches overlap the further ones.
        const depth = i / (COUNT - 1);
        const cx = pad + span * (i + 0.5);
        const width = span * (0.78 - depth * 0.06);
        const height = (h - pad * 2) * (0.86 - depth * 0.1);
        const top = floor - height;
        const radius = width / 2;
        const near = Math.exp(-((i - focus) * (i - focus)) / 0.5);

        ctx.beginPath();
        ctx.moveTo(cx - radius, floor);
        ctx.lineTo(cx - radius, top + radius);
        ctx.arc(cx, top + radius, radius, Math.PI, 0);
        ctx.lineTo(cx + radius, floor);

        if (near > 0.04) {
          ctx.fillStyle = `rgba(201,123,61,${(near * 0.26).toFixed(3)})`;
          ctx.fill();
        }
        ctx.strokeStyle = inkAt(0.28 + (1 - depth) * 0.34 + near * 0.2);
        ctx.lineWidth = 1 + near * 0.6;
        ctx.stroke();

        // A keystone on the arch the eye is on, and nowhere else.
        if (near > 0.55) {
          ctx.fillStyle = AMBER;
          ctx.beginPath();
          ctx.arc(cx, top + radius * 0.12, Math.max(1.6, m * 0.012), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // The floor the colonnade stands on.
      ctx.strokeStyle = inkAt(0.7);
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(pad * 0.6, floor);
      ctx.lineTo(w - pad * 0.6, floor);
      ctx.stroke();
    },
  });

  return <canvas ref={canvasRef} aria-label={label} />;
}
