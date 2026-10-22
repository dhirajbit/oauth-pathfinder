import fs from "node:fs";
import path from "node:path";
import { GuideSchema, type Guide } from "./schema";
import { CATALOG, type CatalogEntry } from "../../data/catalog";

const GUIDES_DIR = path.join(process.cwd(), "data", "guides");

let cache: Map<string, Guide> | null = null;

/** All hand-researched guides on disk, validated against the schema. */
export function loadGuides(): Map<string, Guide> {
  if (cache) return cache;
  const map = new Map<string, Guide>();
  if (fs.existsSync(GUIDES_DIR)) {
    for (const file of fs.readdirSync(GUIDES_DIR)) {
      if (!file.endsWith(".json")) continue;
      const raw = JSON.parse(fs.readFileSync(path.join(GUIDES_DIR, file), "utf8"));
      const parsed = GuideSchema.safeParse(raw);
      if (parsed.success) map.set(parsed.data.slug, parsed.data);
      else console.warn(`guide ${file} failed validation`, parsed.error.issues.slice(0, 3));
    }
  }
  cache = map;
  return map;
}

export function getGuide(slug: string): Guide | undefined {
  return loadGuides().get(slug);
}

export interface LibraryItem extends CatalogEntry {
  hasGuide: boolean;
}

export function getLibrary(): LibraryItem[] {
  const guides = loadGuides();
  // A verified guide's verdict replaces the triage estimate.
  return CATALOG.map((c) => {
    const g = guides.get(c.slug);
    return g
      ? { ...c, hasGuide: true, tier: g.verdict.difficulty, hook: g.verdict.difficultyReason }
      : { ...c, hasGuide: false };
  });
}
