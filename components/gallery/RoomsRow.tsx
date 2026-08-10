import Link from "next/link";
import { visualLabel } from "@/content/landing";
import { getCategories, getPieces } from "@/lib/collection";
import RoomVisual from "@/components/canvas/RoomVisual";
import Plinth from "@/components/gallery/Plinth";

/**
 * The collection compressed to one shopping row: an era tile each, keeping the
 * era's generative study as a quiet placeholder until photography lands. The
 * eras come from the database rather than a fixed list, so one added in the
 * dashboard appears here with the study chosen for it. The count line comes
 * from the one cached getPieces read, so the row costs no extra queries; an
 * era with nothing in simply drops the line rather than reading empty.
 */
export default async function RoomsRow() {
  const [categories, pieces] = await Promise.all([
    getCategories(),
    getPieces(),
  ]);
  const counts = new Map<string, number>();
  for (const piece of pieces) {
    counts.set(piece.categorySlug, (counts.get(piece.categorySlug) ?? 0) + 1);
  }

  return (
    <section className="rooms" aria-labelledby="rooms-title">
      <div className="rooms-head">
        <span className="mono eyebrow">The collection, era by era</span>
        <h2 id="rooms-title">Shop by era</h2>
      </div>
      <div className="rooms-grid">
        {categories.map((category, i) => {
          const count = counts.get(category.slug) ?? 0;
          return (
            <Link
              key={category.slug}
              href={`/collection/${category.slug}`}
              className="room-tile reveal"
            >
              <div
                className="room-tile-figure"
                data-ground={i % 2 === 1 ? "dark" : "light"}
              >
                <RoomVisual
                  visual={category.visual}
                  label={visualLabel(category.name, category.visual)}
                  scrollBound={false}
                />
                <Plinth />
              </div>
              <h3>{category.name}</h3>
              {count > 0 ? (
                <span className="room-tile-count mono">
                  {count} {count === 1 ? "piece" : "pieces"}
                </span>
              ) : null}
              <span className="room-tile-view mono">View pieces</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
