import type { MetadataRoute } from "next";
import { getCategories, getPieces } from "@/lib/collection";

const BASE = "https://houseofchairs.co.uk";

// Eras and pieces are edited in the dashboard, so the sitemap is read from the
// same source the pages are. getPieces already drops drafts, so a piece enters
// the sitemap on the revalidation after it is switched to available and leaves
// it again if it goes back to draft. Both fall back to the static catalogue
// when there is no database to read, so the file is never empty.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, pieces] = await Promise.all([getCategories(), getPieces()]);
  const now = new Date();

  const routes = ["", "/collection", "/sell", "/enquire"].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date("2026-07-05"),
  }));

  return [
    ...routes,
    ...categories.map((c) => ({
      url: `${BASE}/collection/${c.slug}`,
      lastModified: now,
    })),
    ...pieces.map((p) => ({
      url: `${BASE}/piece/${p.slug}`,
      lastModified: now,
    })),
  ];
}
