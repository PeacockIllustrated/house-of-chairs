import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { rateLimit } from "@/lib/rateLimit";
import { notifyOwner } from "@/lib/email";
import { SITE_URL } from "@/lib/emailTemplate";
import { looksLikeBot } from "@/lib/botCheck";
import { looksAutomated } from "@/lib/spamSignals";
import { passesTurnstile, TURNSTILE_REFUSAL } from "@/lib/turnstile";
import type { Database, EnquiryKind } from "@/lib/supabase/types";

const KINDS: EnquiryKind[] = ["piece", "sourcing", "selling"];

function clientKey(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // A bot is told it succeeded, so it learns nothing, and nothing is kept.
  if (looksLikeBot(body)) {
    return NextResponse.json({ ok: true, stored: true });
  }

  // Cloudflare Turnstile, once its keys are set. A person who fails it is told
  // so plainly and can send again; a fresh token comes with the next try.
  if (!(await passesTurnstile(body, clientKey(req)))) {
    return NextResponse.json({ error: TURNSTILE_REFUSAL }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const message = String(body.message ?? "").trim();
  const kind = (
    KINDS.includes(body.kind as EnquiryKind) ? body.kind : "piece"
  ) as EnquiryKind;
  const pieceSlug =
    typeof body.pieceSlug === "string" && body.pieceSlug ? body.pieceSlug : null;

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Please give your name, email and a short message." },
      { status: 400 },
    );
  }
  if (name.length > 200 || email.length > 320) {
    return NextResponse.json(
      { error: "That name or email is too long." },
      { status: 400 },
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "That email address does not look right." },
      { status: 400 },
    );
  }
  if (message.length > 4000) {
    return NextResponse.json(
      { error: "That message is a little long; please trim it." },
      { status: 400 },
    );
  }

  // Rate limit per client. Production can move this to a Supabase edge function
  // backed by a shared store; the interface stays the same.
  const limit = rateLimit(clientKey(req));
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Thank you, we have your note. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  // Without a database, accept gracefully and point at the mailto fallback.
  if (!isSupabaseConfigured) {
    return NextResponse.json({
      ok: true,
      stored: false,
      note: "Your enquiry was received. Email sales@houseofchairs.co.uk if you would like a faster reply.",
    });
  }

  try {
    const { formsDb } = await import("@/lib/supabase/formsDb");
    const supabase = await formsDb();

    let pieceId: string | null = null;
    let pieceTitle: string | null = null;
    if (pieceSlug) {
      const { data } = await supabase
        .from("modern_pieces")
        .select("id, title")
        .eq("slug", pieceSlug)
        .maybeSingle();
      const piece = data as { id: string; title: string } | null;
      pieceId = piece?.id ?? null;
      pieceTitle = piece?.title ?? null;
    }

    // The payload is type-checked against the Insert type; the insert call is
    // asserted because the hand-written Database types do not satisfy
    // postgrest 2.110's builder generics (regenerate with the Supabase CLI once
    // a project is provisioned to restore full inference).
    const payload: Database["public"]["Tables"]["modern_enquiries"]["Insert"] = {
      piece_id: pieceId,
      name,
      email,
      message,
      kind,
    };
    const { error } = await supabase
      .from("modern_enquiries")
      .insert(payload as never);
    if (error) {
      return NextResponse.json(
        { error: "We could not record that just now. Please email us instead." },
        { status: 502 },
      );
    }
    // Stored either way, so the dashboard keeps a record, but an enquiry that
    // matches the known bot pattern is not emailed on.
    if (!looksAutomated({ name, email })) {
      const subject = pieceTitle
        ? `Enquiry: ${pieceTitle}, from ${name}`
        : `New ${kind} enquiry from ${name}`;
      const first = name.split(/\s+/)[0] || name;
      await notifyOwner(
        "enquiry",
        subject,
        {
          preheader: `${name} wrote: ${message.slice(0, 90)}`,
          heading: pieceTitle
            ? `New enquiry about the ${pieceTitle}`
            : "New enquiry",
          body: `${name} has written in through the website. Reply to this email to answer ${first} directly, or reply from the dashboard.`,
          details: [
            ["Name", name],
            ["Email", email],
            ["About", pieceTitle ?? (kind === "piece" ? "No piece named" : kind)],
          ],
          quote: { intro: "Their message", text: message },
          button: pieceTitle
            ? { label: "View the piece", href: `${SITE_URL}/piece/${pieceSlug}` }
            : { label: "Open the dashboard", href: `${SITE_URL}/admin` },
        },
        email,
      );
    }
    return NextResponse.json({ ok: true, stored: true });
  } catch {
    return NextResponse.json(
      { error: "We could not record that just now. Please email us instead." },
      { status: 502 },
    );
  }
}
