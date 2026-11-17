import { HONEYPOT_FIELD } from "@/lib/botCheck";

/**
 * The honeypot field for lib/botCheck. Moved off-screen rather than set to
 * display:none, which some bots skip, and kept out of the tab order and the
 * accessibility tree so no person ever meets it. The label wraps the input so
 * several forms on one page never share an id.
 */
export default function Honeypot() {
  return (
    <div className="hp-field" aria-hidden="true">
      <label>
        Leave this empty
        <input
          name={HONEYPOT_FIELD}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </label>
    </div>
  );
}
