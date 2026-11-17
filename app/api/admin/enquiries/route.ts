import { NextResponse } from "next/server";
import { isSignedIn } from "@/lib/admin/auth";
import { adminDbConfigured, createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

/** Clear an enquiry. Gated. */
export async function DELETE(req: Request) {
  if (!(await isSignedIn())) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  if (!adminDbConfigured) {
    return NextResponse.json(
      { error: "The database is not configured." },
      { status: 503 },
    );
  }
  const id = new URL(req.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "No enquiry given." }, { status: 400 });
  }
  const db = createAdminClient();
  const { error } = await db.from("modern_enquiries").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}

/**
 * Reply to an enquiry from the dashboard. Gated. The message is sent from the
 * sales@ mailbox in the House of Chairs layout, with the buyer's original
 * message quoted underneath and a blind copy to sales@ so the mailbox keeps
 * the thread. Their answer comes back to sales@ like any other email.
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
  const { emailConfigured, sendEmail, isPlainAddress } = await import(
    "@/lib/email"
  );
  if (!emailConfigured) {
    return NextResponse.json(
      {
        error:
          "Sending is not set up yet. Use your mail app for now; the button beside Send opens it.",
      },
      { status: 503 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }
  const id = String(body.id ?? "");
  const subject = String(body.subject ?? "").trim();
  const message = String(body.message ?? "").trim();
  if (!id || !subject || !message) {
    return NextResponse.json(
      { error: "Add a subject and a message first." },
      { status: 400 },
    );
  }
  if (subject.length > 150 || message.length > 8000) {
    return NextResponse.json(
      { error: "That is a little long to send." },
      { status: 400 },
    );
  }

  const db = createAdminClient();
  const { data: row } = await db
    .from("modern_enquiries")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  const en = row as {
    id: string;
    name: string;
    email: string;
    message: string;
    piece_id: string | null;
    created_at: string;
  } | null;
  if (!en) {
    return NextResponse.json({ error: "Enquiry not found." }, { status: 404 });
  }
  if (!isPlainAddress(en.email)) {
    return NextResponse.json(
      { error: "Their email address looks malformed, so it cannot be sent from here." },
      { status: 400 },
    );
  }

  let piece: { title: string; slug: string } | null = null;
  if (en.piece_id) {
    const { data } = await db
      .from("modern_pieces")
      .select("title, slug")
      .eq("id", en.piece_id)
      .maybeSingle();
    piece = data as { title: string; slug: string } | null;
  }

  const { renderEmail, SITE_URL } = await import("@/lib/emailTemplate");
  const sent = new Date(en.created_at).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/London",
  });
  const html = renderEmail({
    preheader: message.replace(/\s+/g, " ").slice(0, 110),
    body: message,
    button: piece
      ? { label: "View the piece", href: `${SITE_URL}/piece/${piece.slug}` }
      : undefined,
    quote: { intro: `On ${sent} you wrote:`, text: en.message },
  });

  const result = await sendEmail({
    kind: "reply",
    to: en.email,
    subject,
    html,
    copyShop: true,
  });
  if (!result.ok) {
    return NextResponse.json(
      { error: "That did not send. Please try again, or use your mail app." },
      { status: 502 },
    );
  }

  const repliedAt = new Date().toISOString();
  // Best-effort: before migration 0008 the column does not exist yet.
  await db
    .from("modern_enquiries")
    .update({ replied_at: repliedAt } as never)
    .eq("id", en.id);
  return NextResponse.json({ ok: true, repliedAt });
}
