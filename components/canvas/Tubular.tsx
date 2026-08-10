"use client";

import { useCanvasScene } from "./useCanvasScene";
import { STONE, inkAt, AMBER } from "./ground";

/**
 * Tubular, for the eras drawn in bent steel. A cantilever traced as one
 * continuous run of pipe, the way Bauhaus and modernist seating actually is:
 * no back legs, the frame returning to the floor in a single loop.
 *
 * The pipe is drawn as a wide dark stroke with a narrower pale one laid over
 * it, which is what gives chrome its hard centre line. An earlier version
 * offset two thin strokes sideways instead, which only reads as pipe on the
 * vertical runs and collapses to a single line on the horizontals.
 */
export default function Tubular({ label }: { label: string }) {
  const canvasRef = useCanvasScene({
    draw: (s) => {
      const { ctx, w, h, t, reduced } = s;
      ctx.fillStyle = STONE;
      ctx.fillRect(0, 0, w, h);

      const m = Math.min(w, h);
      const pad = m * 0.14;
      const sx = (u: number) => pad + u * (w - pad * 2);
      const sy = (v: number) => pad + v * (h - pad * 2);
      const gauge = Math.max(4, m * 0.05);
      const r = m * 0.09;

      // One path: floor runner forward, up the front, back along the seat,
      // then up into the back. Arcs at the corners because the tube is bent,
      // not mitred.
      const path = new Path2D();
      path.moveTo(sx(0.86), sy(0.94));
      path.lineTo(sx(0.3), sy(0.94));
      path.arcTo(sx(0.12), sy(0.94), sx(0.12), sy(0.72), r);
      path.arcTo(sx(0.12), sy(0.56), sx(0.34), sy(0.56), r);
      path.lineTo(sx(0.84), sy(0.56));
      path.arcTo(sx(0.94), sy(0.56), sx(0.94), sy(0.36), r * 0.7);
      path.lineTo(sx(0.9), sy(0.1));

      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // The pipe body, then its centre line.
      ctx.lineWidth = gauge;
      ctx.strokeStyle = inkAt(0.8);
      ctx.stroke(path);
      ctx.lineWidth = gauge * 0.34;
      ctx.strokeStyle = "rgba(255,255,255,0.5)";
      ctx.stroke(path);

      // The seat and back planes slung between the runs, hairline so the tube
      // stays the subject and the whole still reads as a chair.
      ctx.lineWidth = 1;
      ctx.strokeStyle = inkAt(0.24);
      ctx.beginPath();
      ctx.moveTo(sx(0.16), sy(0.62));
      ctx.lineTo(sx(0.88), sy(0.62));
      ctx.moveTo(sx(0.16), sy(0.68));
      ctx.lineTo(sx(0.88), sy(0.68));
      ctx.stroke();

      // A band of light travelling the run, resting where the cursor is.
      const p = s.pointer;
      const sweep = reduced ? 0.5 : (Math.sin(t * 0.5) + 1) / 2;
      const at = p.inside && !reduced
        ? Math.max(0, Math.min(1, (p.x - pad) / (w - pad * 2)))
        : sweep;
      const gx = sx(0.12 + at * 0.8);
      const gy = sy(0.56);
      const glow = ctx.createRadialGradient(gx, gy, 0, gx, gy, gauge * 2.6);
      glow.addColorStop(0, AMBER);
      glow.addColorStop(1, "rgba(201,123,61,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(gx, gy, gauge * 2.6, 0, Math.PI * 2);
      ctx.fill();
    },
  });

  return <canvas ref={canvasRef} aria-label={label} />;
}
