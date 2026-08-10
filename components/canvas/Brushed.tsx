"use client";

import { useRef } from "react";
import { useCanvasScene } from "./useCanvasScene";
import { STONE, inkAt } from "./ground";

/**
 * Brushed, for the aluminium eras. The grain left by a linishing belt on a
 * hand finished frame, and the band of light that runs along it as you move
 * past. Brushed metal has no colour of its own, so this study is the only one
 * in the set drawn without any: it is entirely grain and specular. That suits
 * the pieces it stands for, which were made for public rooms and sold on how
 * they wear rather than on how they look. Under reduced motion the band of
 * light sits a third of the way down and holds.
 */
export default function Brushed({ label }: { label: string }) {
  const grain = useRef<{ y: number; a: number; len: number; off: number }[]>([]);

  const linish = () => {
    if (grain.current.length) return;
    const out = [];
    for (let i = 0; i < 150; i++) {
      out.push({
        y: Math.random(),
        a: 0.04 + Math.random() * 0.16,
        len: 0.3 + Math.random() * 0.7,
        off: Math.random(),
      });
    }
    grain.current = out;
  };

  const canvasRef = useCanvasScene({
    init: linish,
    draw: (s) => {
      const { ctx, w, h, t, reduced } = s;
      ctx.fillStyle = STONE;
      ctx.fillRect(0, 0, w, h);

      const m = Math.min(w, h);
      const pad = m * 0.1;
      const box = { x: pad, y: pad, w: w - pad * 2, h: h - pad * 2 };
      const p = s.pointer;

      ctx.save();
      ctx.beginPath();
      ctx.rect(box.x, box.y, box.w, box.h);
      ctx.clip();

      // The plate, a shade off the ground so the grain has something to sit in.
      ctx.fillStyle = "#D8D6CF";
      ctx.fillRect(box.x, box.y, box.w, box.h);

      // Where the light is: the cursor's height, a slow travel otherwise.
      const sweep = reduced ? 0.34 : (Math.sin(t * 0.42) + 1) / 2;
      const at =
        p.inside && !reduced
          ? Math.max(0, Math.min(1, (p.y - box.y) / box.h))
          : sweep;
      const band = box.y + at * box.h;

      // Specular first, so the grain draws over it and stays legible.
      const glare = ctx.createLinearGradient(0, band - box.h * 0.3, 0, band + box.h * 0.3);
      glare.addColorStop(0, "rgba(255,255,255,0)");
      glare.addColorStop(0.5, "rgba(255,255,255,0.55)");
      glare.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = glare;
      ctx.fillRect(box.x, box.y, box.w, box.h);

      // The grain itself: fine horizontal scratches, brighter in the light.
      ctx.lineWidth = 1;
      for (const g of grain.current) {
        const y = box.y + g.y * box.h;
        const near = Math.exp(-((y - band) * (y - band)) / (box.h * box.h * 0.02));
        const x0 = box.x + g.off * box.w * 0.4;
        const x1 = Math.min(box.x + box.w, x0 + g.len * box.w);
        ctx.strokeStyle =
          near > 0.4
            ? `rgba(255,255,255,${(g.a * 2.4 * near).toFixed(3)})`
            : inkAt(g.a * 0.7);
        ctx.beginPath();
        ctx.moveTo(x0, y);
        ctx.lineTo(x1, y);
        ctx.stroke();
      }
      ctx.restore();

      // The edge of the plate, and the weld line down it.
      ctx.strokeStyle = inkAt(0.7);
      ctx.lineWidth = 1.2;
      ctx.strokeRect(box.x, box.y, box.w, box.h);
      ctx.strokeStyle = inkAt(0.18);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(box.x + box.w * 0.68, box.y);
      ctx.lineTo(box.x + box.w * 0.68, box.y + box.h);
      ctx.stroke();
    },
  });

  return <canvas ref={canvasRef} aria-label={label} />;
}
