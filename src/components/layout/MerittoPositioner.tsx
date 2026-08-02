"use client";

/**
 * Suppresses Meritto's built-in greeting bubble so ours is the only one.
 *
 * This used to walk every element in the document on every mutation — plus a
 * 5 s interval — measuring bounding boxes to guess which anonymous fixed-
 * position node was the launcher, which was the notification and which was the
 * chat window, then rewriting all three with `!important` inline styles. The
 * guessing was never needed: the widget ships stable ids and its own
 * stylesheet, which already anchors the launcher bottom-right at 30/30 and the
 * chat panel to the bottom-right edge. Overriding those coordinates is what
 * made this site's launcher sit somewhere other than it does on the reference
 * deployment.
 *
 * `#eeChatIndicator` is the wrapper around Meritto's "Hey! I am …" bubble, and
 * hiding it is what the widget's own `clickIconIndicator()` does. It is a
 * sibling of `#__eechatIcon` inside `.default-chatbot-indicator`, so the
 * launcher itself is untouched — hiding the wrapper instead would take the
 * launcher down with it.
 */
export function MerittoPositioner() {
  return <style>{`#eeChatIndicator { display: none !important; }`}</style>;
}
