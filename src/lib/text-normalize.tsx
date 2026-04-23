import * as React from "react";

const MOJIBAKE_RE = /(?:Ã.|Â.|â.|Ä.|áº|á»|Æ°|ðŸ|â€”|â€“|â€|â„¢)/;
const VIETNAMESE_RE = /[\u00C0-\u1EF9\u0110\u0111]/;

const PROPS_TO_NORMALIZE = new Set([
  "placeholder",
  "title",
  "alt",
  "aria-label",
  "aria-description",
  "aria-placeholder",
]);

export function normalizeMojibakeText(input: string): string {
  if (!MOJIBAKE_RE.test(input)) return input;

  const bytes = Uint8Array.from(input, (ch) => ch.charCodeAt(0) & 0xff);
  const decoded = new TextDecoder("utf-8", { fatal: false }).decode(bytes);

  if (!decoded || decoded.includes("\uFFFD")) return input;
  if (!VIETNAMESE_RE.test(decoded) && VIETNAMESE_RE.test(input)) return input;

  return decoded;
}

export function normalizeMojibakeNode(node: React.ReactNode): React.ReactNode {
  if (typeof node === "string") {
    return normalizeMojibakeText(node);
  }

  if (Array.isArray(node)) {
    return node.map((child) => normalizeMojibakeNode(child));
  }

  if (!React.isValidElement(node)) {
    return node;
  }

  const props = node.props as Record<string, unknown>;
  let changed = false;
  const nextProps: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(props)) {
    if (key === "children") continue;

    if (typeof value === "string" && PROPS_TO_NORMALIZE.has(key)) {
      const normalized = normalizeMojibakeText(value);
      nextProps[key] = normalized;
      changed = changed || normalized !== value;
      continue;
    }

    nextProps[key] = value;
  }

  const normalizedChildren = normalizeMojibakeNode(props.children as React.ReactNode);
  changed = changed || normalizedChildren !== props.children;

  return changed ? React.cloneElement(node, nextProps, normalizedChildren) : node;
}
