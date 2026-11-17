"use client";

import { useState } from "react";
import type { AdminEnquiry, AdminPiece } from "@/components/admin/types";
import { looksAutomated } from "@/lib/spamSignals";

/**
 * The enquiries tab: newest first. Reply opens a short composer under the
 * enquiry; Send emails the buyer from sales@ in the House of Chairs layout,
 * with their message quoted and a copy to sales@ (app/api/admin/enquiries).
 * "Mail app" is the fallback: it opens the owner's own mail app with the same
 * subject and quote. Enquiries matching the known bot pattern
 * (lib/spamSignals) fold away below, with one press to clear them all.
 */

function subjectFor(pieceTitle: string | null): string {
  return pieceTitle
    ? `Your enquiry about the ${pieceTitle}`
    : "Your enquiry to House of Chairs";
}

function firstName(en: AdminEnquiry): string {
  return en.name.trim().split(/\s+/)[0] || "there";
}

function draftFor(en: AdminEnquiry): string {
  return `Hello ${firstName(en)},\n\nThank you for getting in touch.\n\n\n\nBest wishes,\nHouse of Chairs`;
}

function shortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

function replyHref(en: AdminEnquiry, pieceTitle: string | null): string {
  const subject = subjectFor(pieceTitle);
  const first = firstName(en);
  const quoted = en.message
    .split("\n")
    .map((l) => `> ${l}`)
    .join("\n");
  const sent = new Date(en.created_at).toLocaleDateString("en-GB");
  const body = `Hello ${first},\n\nThank you for getting in touch.\n\n\n\nHouse of Chairs\n\nOn ${sent} you wrote:\n${quoted}\n`;
  return `mailto:${encodeURIComponent(en.email)}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;
}

function Composer({
  en,
  pieceTitle,
  onSent,
  onClose,
}: {
  en: AdminEnquiry;
  pieceTitle: string | null;
  onSent: (at: string) => void;
  onClose: () => void;
}) {
  const [subject, setSubject] = useState(subjectFor(pieceTitle));
  const [message, setMessage] = useState(draftFor(en));
  const [state, setState] = useState<"idle" | "sending" | "error">("idle");
  const [error, setError] = useState("");

  async function send() {
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/admin/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: en.id, subject, message }),
      });
      const d = (await res.json().catch(() => ({}))) as {
        error?: string;
        repliedAt?: string;
      };
      if (!res.ok) {
        setState("error");
        setError(d.error ?? "That did not send. Please try again.");
        return;
      }
      onSent(d.repliedAt ?? new Date().toISOString());
    } catch {
      setState("error");
      setError("That did not send. Please check the connection and try again.");
    }
  }

  return (
    <div className="admin-reply">
      <p className="dash-sub">
        To {en.name} ({en.email}), from sales@houseofchairs.co.uk. Their
        message is quoted underneath and sales@ gets a copy.
      </p>
      <div className="field">
        <label htmlFor={`subject-${en.id}`}>Subject</label>
        <input
          id={`subject-${en.id}`}
          value={subject}
          maxLength={150}
          onChange={(e) => setSubject(e.target.value)}
        />
      </div>
      <div className="field">
        <label htmlFor={`message-${en.id}`}>Message</label>
        <textarea
          id={`message-${en.id}`}
          value={message}
          rows={9}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      {error ? (
        <p className="admin-reply-error" role="alert">
          {error}
        </p>
      ) : null}
      <div className="admin-enquiry-actions">
        <button
          className="enquire"
          type="button"
          disabled={state === "sending"}
          onClick={send}
        >
          {state === "sending" ? "Sending" : "Send"}
        </button>
        <a className="enquire" href={replyHref(en, pieceTitle)}>
          Mail app
        </a>
        <button className="enquire" type="button" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}

function Row({
  en,
  pieceTitle,
  onDelete,
}: {
  en: AdminEnquiry;
  pieceTitle: string | null;
  onDelete: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [repliedAt, setRepliedAt] = useState(en.replied_at ?? null);
  return (
    <li className="admin-enquiry-item">
      <div className="admin-enquiry">
        <div>
          <span className="mono">
            {pieceTitle ?? en.kind} ·{" "}
            {new Date(en.created_at).toLocaleDateString("en-GB")}
            {repliedAt ? ` · Replied ${shortDate(repliedAt)}` : ""}
          </span>
          <p>
            <strong>{en.name}</strong> {en.email}
          </p>
          <p style={{ opacity: 0.85 }}>{en.message}</p>
        </div>
        {open ? null : (
          <div className="admin-enquiry-actions">
            <button
              className="enquire"
              type="button"
              onClick={() => setOpen(true)}
            >
              Reply
            </button>
            <button
              className="enquire"
              type="button"
              onClick={() => onDelete(en.id)}
            >
              Clear
            </button>
          </div>
        )}
      </div>
      {open ? (
        <Composer
          en={en}
          pieceTitle={pieceTitle}
          onSent={(at) => {
            setRepliedAt(at);
            setOpen(false);
          }}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </li>
  );
}

export default function EnquiriesPanel({
  enquiries,
  pieces = [],
  onDelete,
}: {
  enquiries: AdminEnquiry[];
  pieces?: AdminPiece[];
  onDelete: (id: string) => void;
}) {
  const [confirmAll, setConfirmAll] = useState(false);
  const titles = new Map(pieces.map((p) => [p.id, p.title]));
  const titleOf = (en: AdminEnquiry) =>
    en.piece_id ? (titles.get(en.piece_id) ?? null) : null;

  const buyers = enquiries.filter((en) => !looksAutomated(en));
  const automated = enquiries.filter((en) => looksAutomated(en));

  return (
    <section className="dash-panel">
      <div className="dash-panel-head">
        <div>
          <h2 className="dash-h">Enquiries</h2>
          <p className="dash-sub">
            Buyers who have written in, newest first. Reply writes back from
            sales@ with their message quoted, and their answer comes back to
            sales@. Clear the row when it is dealt with.
          </p>
        </div>
      </div>
      {buyers.length === 0 ? (
        <p className="dash-clear">
          No buyers waiting. Enquiries from every piece page land here.
        </p>
      ) : (
        <ul className="admin-list">
          {buyers.map((en) => (
            <Row
              key={en.id}
              en={en}
              pieceTitle={titleOf(en)}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}

      {automated.length > 0 ? (
        <details className="admin-automated">
          <summary className="mono">
            Looks automated ({automated.length})
          </summary>
          <div className="admin-automated-head">
            <p className="dash-sub">
              A random string for a name and a Gmail address full of dots: the
              pattern of a form-filling bot. These are not emailed to you. Open
              any that look real.
            </p>
            {confirmAll ? (
              <div className="admin-enquiry-actions">
                <button
                  className="enquire"
                  type="button"
                  onClick={() => {
                    automated.forEach((en) => onDelete(en.id));
                    setConfirmAll(false);
                  }}
                >
                  Clear {automated.length}
                </button>
                <button
                  className="enquire"
                  type="button"
                  onClick={() => setConfirmAll(false)}
                >
                  Keep
                </button>
              </div>
            ) : (
              <button
                className="enquire"
                type="button"
                onClick={() => setConfirmAll(true)}
              >
                Clear all
              </button>
            )}
          </div>
          <ul className="admin-list">
            {automated.map((en) => (
              <Row
                key={en.id}
                en={en}
                pieceTitle={titleOf(en)}
                onDelete={onDelete}
              />
            ))}
          </ul>
        </details>
      ) : null}
    </section>
  );
}
