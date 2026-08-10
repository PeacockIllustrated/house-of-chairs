"use client";

import { useState } from "react";
import RoomVisual from "@/components/canvas/RoomVisual";
import { ROOM_VISUALS, asRoomVisual } from "@/content/landing";
import type { AdminCategory, AdminPiece } from "@/components/admin/types";

/**
 * Eras, and the drawing that stands for each one. Every era is a card showing
 * the study it currently carries; opening one offers the whole set to choose
 * from, drawn live rather than as flat thumbnails, so what you pick is what
 * the site shows. Only one picker is open at a time, which keeps the number of
 * running canvases to the five on offer.
 *
 * Nothing else about an era is editable here. Names, stories and facts are
 * written straight to the database, and the route this panel posts to accepts
 * the visual and nothing else.
 */
export default function CategoriesPanel({
  categories,
  pieces,
  onReload,
}: {
  categories: AdminCategory[];
  pieces: AdminPiece[];
  onReload: () => void;
}) {
  const [open, setOpen] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState("");

  // Pieces per era, so an era standing empty is obvious while choosing.
  const counts = new Map<string, number>();
  for (const piece of pieces) {
    counts.set(piece.category_id, (counts.get(piece.category_id) ?? 0) + 1);
  }

  async function choose(id: string, visual: string) {
    setSaving(id);
    setError("");
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, visual }),
    });
    setSaving(null);
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      setError(body.error ?? "Could not save the era.");
      return;
    }
    setOpen(null);
    onReload();
  }

  return (
    <section className="dash-panel">
      <div className="dash-panel-head">
        <div>
          <h2 className="dash-h">Eras</h2>
          <p className="dash-sub">
            Each era carries a drawing until photography takes its place. Choose
            the one that suits, and it changes on the home page row and at the
            top of the era&apos;s own page.
          </p>
        </div>
      </div>

      {error ? (
        <p className="form-note mono" data-tone="error" role="status">
          {error}
        </p>
      ) : null}

      <ul className="admin-era-grid">
        {categories.map((category) => {
          const count = counts.get(category.id) ?? 0;
          const isOpen = open === category.id;
          return (
            <li key={category.id} className="admin-era">
              <div className="admin-era-figure">
                <RoomVisual
                  visual={asRoomVisual(category.visual)}
                  label=""
                  scrollBound={false}
                />
              </div>
              <div className="admin-era-main">
                <p>
                  <strong>{category.name}</strong>
                </p>
                <span className="mono admin-era-meta">
                  {ROOM_VISUALS.find((v) => v.kind === category.visual)?.name ??
                    category.visual}
                  {" · "}
                  {count === 0
                    ? "nothing listed"
                    : `${count} ${count === 1 ? "piece" : "pieces"}`}
                </span>
              </div>
              <button
                className="enquire"
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : category.id)}
              >
                {isOpen ? "Close" : "Change"}
              </button>

              {isOpen ? (
                <div className="admin-era-picker">
                  <p className="admin-hint">
                    Pick a drawing for {category.name}.
                  </p>
                  <ul
                    className="admin-visual-grid"
                    aria-label={`Drawings for ${category.name}`}
                  >
                    {ROOM_VISUALS.map((option) => {
                      const current = option.kind === category.visual;
                      return (
                        <li key={option.kind}>
                          <button
                            type="button"
                            className="admin-visual"
                            aria-pressed={current}
                            disabled={saving === category.id}
                            onClick={() => choose(category.id, option.kind)}
                          >
                            <span className="admin-visual-figure">
                              <RoomVisual
                                visual={option.kind}
                                label=""
                                scrollBound={false}
                              />
                            </span>
                            <span className="mono admin-visual-name">
                              {option.name}
                              {current ? " · in use" : ""}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
