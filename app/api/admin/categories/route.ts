import { NextResponse } from "next/server";
import { isSignedIn } from "@/lib/admin/auth";
import { adminDbConfigured, createAdminClient } from "@/lib/supabase/admin";
import { ROOM_VISUALS } from "@/content/landing";

export const runtime = "nodejs";

const ALLOWED = ROOM_VISUALS.map((v) => v.kind as string);

/**
 * Set which generative study stands for an era. The only field this route
 * touches is the visual: names, stories and facts are written elsewhere, and
 * a crafted payload cannot reach them from here. The value is checked against
 * the same list the picker renders, so an unknown study is refused before it
 * reaches the column's check constraint.
 */
export async function POST(req: Request) {
  if (!(await isSignedIn())) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  if (!adminDbConfigured) {
    return NextResponse.json(
      { error: "The database is not configured." },
      { status: 503 },
    );
  }

  let body: { id?: string; visual?: string };
  try {
    body = (await req.json()) as { id?: string; visual?: string };
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const id = typeof body.id === "string" ? body.id : "";
  const visual = typeof body.visual === "string" ? body.visual : "";
  if (!id) {
    return NextResponse.json({ error: "Which era?" }, { status: 400 });
  }
  if (!ALLOWED.includes(visual)) {
    return NextResponse.json(
      { error: "That is not one of the studies." },
      { status: 400 },
    );
  }

  const db = createAdminClient();
  const { error } = await db
    .from("modern_categories")
    // Cast as the other admin routes do; the generated table types resolve the
    // update payload to never.
    .update({ visual } as never)
    .eq("id", id);
  if (error) {
    return NextResponse.json(
      { error: "Could not save the era." },
      { status: 502 },
    );
  }
  return NextResponse.json({ ok: true });
}
