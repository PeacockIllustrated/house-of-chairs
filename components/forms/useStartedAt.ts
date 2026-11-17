"use client";

import { useEffect, useRef } from "react";

/**
 * When the form was first shown in this browser, for lib/botCheck. Set on
 * mount rather than at render, because a cached page's server render can be
 * hours old.
 */
export function useStartedAt() {
  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);
  return startedAt;
}
