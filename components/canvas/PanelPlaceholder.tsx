import type { RoomVisual } from "@/content/landing";

// Only studies without a renderer of their own reach this file, so the map is
// partial by design: everything else is drawn rather than named. A study added
// to the union without a renderer falls back to its own key rather than
// failing to compile, which is the right trade for a stand-in.
const STUDY_NAME: Partial<Record<RoomVisual, string>> = {
  tide: "Tide, the grain of time",
};

/**
 * Static stand-in for a category panel, used in session 1 before the live
 * Canvas 2D visuals land in sessions 2 and 3. It keeps the panel's proportions
 * and a meaningful, labelled frame so the page reads complete and the reduced
 * motion contract (never a blank) already holds.
 */
export default function PanelPlaceholder({
  visual,
  label,
}: {
  visual: RoomVisual;
  label: string;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span className="mono" style={{ opacity: 0.4 }}>
        {STUDY_NAME[visual] ?? visual}
      </span>
    </div>
  );
}
