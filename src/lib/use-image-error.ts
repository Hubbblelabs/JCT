"use client";

import { useEffect, useState } from "react";

/**
 * Tracks whether an image failed to load, clearing the flag whenever the
 * source changes.
 *
 * Without the reset the flag is sticky. A component instance is reused when its
 * `src` prop changes, so an editor that replaces a broken image with a good one
 * keeps rendering the fallback — the error belongs to a source that is no
 * longer on screen. That reads as "the new upload is broken too", which is how
 * one bad asset (or one spell of misconfigured storage) gets mistaken for a
 * permanent failure.
 *
 * Returns the flag and the `onError` handler to hand to the element.
 */
export function useImageError(
  src: string | null | undefined,
): readonly [boolean, () => void] {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  return [failed, () => setFailed(true)] as const;
}
