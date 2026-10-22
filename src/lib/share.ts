import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "lz-string";
import { GuideSchema, type Guide } from "./schema";

/**
 * Shareable links carry the whole guide in the URL fragment. No database,
 * nothing leaves the browser when you open a shared link, and links never
 * expire. Typical guide ≈ 8-12 KB JSON → ≈ 4-6 KB compressed, well inside
 * browser URL limits.
 */
export function encodeGuide(guide: Guide): string {
  return compressToEncodedURIComponent(JSON.stringify(guide));
}

export function decodeGuide(payload: string): Guide | null {
  try {
    const json = decompressFromEncodedURIComponent(payload);
    if (!json) return null;
    const parsed = GuideSchema.safeParse(JSON.parse(json));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}
