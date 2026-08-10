import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCategories,
  getCategoryBySlug,
  getPieces,
  getPieceHeroImages,
} from "@/lib/collection";
import { rooms } from "@/content/landing";
import CategoryBand from "@/components/collection/CategoryBand";
import PieceCard from "@/components/collection/PieceCard";
import FeatureBand from "@/components/gallery/FeatureBand";
import RevealObserver from "@/components/scroll/RevealObserver";

export const revalidate = 60;

// Eras come from the dashboard, so the params come from the database rather
// than the five the landing page happens to draw. getCategories falls back to
// the static list when there is no database to read.
export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const data = await getCategoryBySlug(category);
  if (!data) return { title: "Collection" };
  return { title: data.name, description: data.story };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const data = await getCategoryBySlug(category);
  if (!data) notFound();
  // The generative band is decoration, and only the five original eras have a
  // drawing of their own. An era added in the dashboard falls back to a
  // default rather than turning the whole page into a 404.
  const room = rooms.find((r) => r.slug === category);

  // The same cached read as getCategoryBySlug, so the count costs nothing.
  const categories = await getCategories();
  const pieces = await getPieces(category);
  const images = await getPieceHeroImages(pieces.map((p) => p.slug));

  return (
    <main className="page">
      <nav className="breadcrumb mono" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true">/</span>
        <Link href="/collection">Collection</Link>
        <span aria-hidden="true">/</span>
        <span>{data.name}</span>
      </nav>

      <CategoryBand
        visual={room?.visual ?? "rings"}
        label={room?.canvasLabel ?? data.name}
        dark={room?.variant === "dark"}
      />

      <div className="page-head">
        <span className="mono eyebrow">
          Era {String(data.position).padStart(2, "0")} of{" "}
          {String(categories.length).padStart(2, "0")}
        </span>
        <h1>{data.name}</h1>
        <p>{data.story}</p>
      </div>

      {pieces.length > 0 ? (
        <>
          <div className="shop-count mono" role="status">
            <span>
              {pieces.length} {pieces.length === 1 ? "piece" : "pieces"} in this
              era
            </span>
            <Link className="shop-clear" href="/collection">
              See every era
            </Link>
          </div>
          <div className="pc-grid">
            {pieces.map((piece, i) => (
              <PieceCard
                key={piece.slug}
                piece={piece}
                image={images[piece.slug] ?? null}
                priority={i < 3}
              />
            ))}
          </div>
        </>
      ) : (
        <p className="shop-empty">
          No pieces are listed here at the moment. The best pieces rarely reach
          the website, so tell us what you are after and we will find it.
        </p>
      )}

      <FeatureBand
        eyebrow="More chairs than reach the website"
        heading="Looking for something in particular"
        body="Tell us what you are after and we will find it. And if you have a piece the artists made, we buy."
        cta={{ label: "Make an enquiry", href: "/enquire" }}
        visual="rings"
      />

      <RevealObserver />
    </main>
  );
}
