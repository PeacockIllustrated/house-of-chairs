"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * The browser half of Cloudflare Turnstile (lib/turnstile checks the token).
 *
 * Off until configured: with no NEXT_PUBLIC_TURNSTILE_SITE_KEY nothing loads
 * and getToken resolves to an empty string.
 *
 * Nothing loads with the page either. The script is fetched the first time a
 * visitor focuses a field in the form, so it never touches the piece page's
 * first paint or its Lighthouse score. The widget runs as "interaction-only":
 * most people never see it; a doubtful visitor gets a single checkbox in the
 * slot above the submit button.
 */

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() ?? "";
const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

interface TurnstileApi {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let scriptPromise: Promise<TurnstileApi> | null = null;

function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = SCRIPT_SRC;
    s.async = true;
    s.onload = () =>
      window.turnstile
        ? resolve(window.turnstile)
        : reject(new Error("turnstile missing"));
    s.onerror = () => {
      scriptPromise = null;
      reject(new Error("turnstile failed to load"));
    };
    document.head.appendChild(s);
  });
  return scriptPromise;
}

export const turnstileOn = SITE_KEY !== "";

export function useTurnstile() {
  const slot = useRef<HTMLDivElement | null>(null);
  const widgetId = useRef<string | null>(null);
  const token = useRef("");
  const waiters = useRef<((t: string) => void)[]>([]);

  const settle = useCallback((t: string) => {
    token.current = t;
    const w = waiters.current;
    waiters.current = [];
    w.forEach((fn) => fn(t));
  }, []);

  /** Load and render the widget, once. Safe to call on every focus. */
  const arm = useCallback(() => {
    if (!turnstileOn || widgetId.current || !slot.current) return;
    widgetId.current = "pending";
    loadTurnstile()
      .then((api) => {
        if (!slot.current) return;
        widgetId.current = api.render(slot.current, {
          sitekey: SITE_KEY,
          appearance: "interaction-only",
          theme: "light",
          callback: (t: string) => settle(t),
          "expired-callback": () => (token.current = ""),
          "error-callback": () => settle(""),
        });
      })
      .catch(() => {
        widgetId.current = null;
        settle("");
      });
  }, [settle]);

  /**
   * The token to send. Waits up to eight seconds for one, which covers a
   * visitor who submits the instant the script arrives. An empty string means
   * no token; the server then refuses with a plain "send again" sentence.
   */
  const getToken = useCallback((): Promise<string> => {
    if (!turnstileOn) return Promise.resolve("");
    if (token.current) return Promise.resolve(token.current);
    arm();
    return new Promise((resolve) => {
      const timer = setTimeout(() => resolve(token.current), 8000);
      waiters.current.push((t) => {
        clearTimeout(timer);
        resolve(t);
      });
    });
  }, [arm]);

  /** Tokens are single use; fetch a fresh one after every send. */
  const reset = useCallback(() => {
    token.current = "";
    const id = widgetId.current;
    if (id && id !== "pending" && window.turnstile) window.turnstile.reset(id);
  }, []);

  useEffect(
    () => () => {
      const id = widgetId.current;
      if (id && id !== "pending" && window.turnstile) {
        window.turnstile.remove(id);
      }
    },
    [],
  );

  return { slot, arm, getToken, reset };
}
