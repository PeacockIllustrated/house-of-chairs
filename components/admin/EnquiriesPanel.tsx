"use client";

import { useState } from "react";
import type { AdminEnquiry, AdminPiece } from "@/components/admin/types";
import { looksAutomated } from "@/lib/spamSignals";

/**
 * The enquiries tab: newest first. Each buyer gets a Reply that opens the
 * owner's own mail app with the buyer, a subject naming the piece and their
 * message quoted, so the answer goes out from the shop's mailbox and the
 * buyer's reply comes back to it. Enquiries matching the known bot pattern
 * (lib/spamSignals) fold away below, with one press to clear them all.
 */

function replyHref(en: AdminEnquiry, pieceTitle: string | null): string {
  const subject = pieceTitle
    ? `Your enquiry about the ${pieceTitle}`
    : "Your enquiry to House of Chairs";
  const first = en.name.trim().split(/\s+/)[0] || "there";
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

function Row({
  en,
  pieceTitle,
  onDelete,
}: {
  en: AdminEnquiry;
  pieceTitle: string | null;
  onDelete: (id: string) => void;
}) {
  return (
    <li className="admin-enquiry">
      <div>
        <span className="mono">
          {pieceTitle ?? en.kind} ·{" "}
          {new Date(en.created_at).toLocaleDateString("en-GB")}
        </span>
        <p>
          <strong>{en.name}</strong> {en.email}
        </p>
        <p style={{ opacity: 0.85 }}>{en.message}</p>
      </div>
      <div className="admin-enquiry-actions">
        <a className="enquire" href={replyHref(en, pieceTitle)}>
          Reply
        </a>
        <button
          className="enquire"
          type="button"
          onClick={() => onDelete(en.id)}
        >
          Clear
        </button>
      </div>
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
            Buyers who have written in, newest first. Reply opens your mail
            app with their message quoted; send it from the shop address so
            their answer comes back there. Clear the row when it is dealt with.
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
