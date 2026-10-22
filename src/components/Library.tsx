"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { LibraryItem } from "@/lib/guides";

const TIER_LABEL = { easy: "Easy", moderate: "Moderate", hard: "Hard", "very-hard": "Very hard" } as const;

/**
 * Search box + filterable list. The same box submits an unknown app to the
 * live agent, so "look it up" and "generate it" are one gesture.
 */
export function Library({ items }: { items: LibraryItem[] }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [tier, setTier] = useState<string>("all");
  const [onlyGuides, setOnlyGuides] = useState(false);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return items
      .filter((i) => tier === "all" || i.tier === tier)
      .filter((i) => !onlyGuides || i.hasGuide)
      .filter((i) => !needle || i.name.toLowerCase().includes(needle) || i.category.toLowerCase().includes(needle) || i.website.includes(needle) || i.slug.includes(needle))
      .sort((a, b) => Number(b.hasGuide) - Number(a.hasGuide) || a.name.localeCompare(b.name));
  }, [items, q, tier, onlyGuides]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    const exact = filtered.find((i) => i.hasGuide && i.name.toLowerCase() === term.toLowerCase());
    if (exact) router.push(`/guide/${exact.slug}`);
    else router.push(`/generate?app=${encodeURIComponent(term)}`);
  };

  const guideCount = items.filter((i) => i.hasGuide).length;

  return (
    <div>
      <form onSubmit={submit} id="generate" className="scroll-mt-20">
        <label htmlFor="app" className="sr-only">App name or website</label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            id="app"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="App name or website, e.g. Gmail or canva.com"
            autoComplete="off"
            className="flex-1 rounded-md border border-line-strong bg-surface px-4 py-3 text-base placeholder:text-muted focus:border-primary"
          />
          <button type="submit" className="rounded-md bg-primary text-primary-ink px-5 py-3 font-medium hover:opacity-90">
            {filtered.length === 0 || !q ? "Generate a guide" : "Look it up"}
          </button>
        </div>
        <p className="mt-2 text-sm text-muted">
          Not in the library? Press enter and an agent reads the provider&apos;s docs and writes the guide while you watch — usually 1–3 minutes.
        </p>
      </form>

      <div id="library" className="mt-10 scroll-mt-20">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold tracking-tight">
            Library <span className="text-muted font-normal">· {items.length} apps, {guideCount} with full verified guides</span>
          </h2>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <select value={tier} onChange={(e) => setTier(e.target.value)} className="rounded-md border border-line bg-surface px-2 py-1.5" aria-label="Filter by difficulty">
              <option value="all">All difficulties</option>
              <option value="easy">Easy</option>
              <option value="moderate">Moderate</option>
              <option value="hard">Hard</option>
              <option value="very-hard">Very hard</option>
            </select>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={onlyGuides} onChange={(e) => setOnlyGuides(e.target.checked)} />
              Full guides only
            </label>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="mt-6 rounded-lg border border-dashed border-line-strong p-8 text-center">
            <p className="font-medium">&ldquo;{q}&rdquo; isn&apos;t in the library yet.</p>
            <p className="mt-1 text-muted">Press enter or the button above and the agent will investigate it live.</p>
          </div>
        ) : (
          <ul className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
            {filtered.map((i) => (
              <li key={i.slug} className="border-t border-line">
                <Link
                  href={i.hasGuide ? `/guide/${i.slug}` : `/generate?app=${encodeURIComponent(i.name)}`}
                  className="group grid grid-cols-[1rem_1fr_auto] items-start gap-3 py-3 hover:bg-wash -mx-2 px-2 rounded-md"
                >
                  <span className={`blaze blaze-${i.tier} mt-1.5`} title={TIER_LABEL[i.tier]} aria-label={TIER_LABEL[i.tier]} />
                  <span className="min-w-0">
                    <span className="font-medium group-hover:underline underline-offset-4">{i.name}</span>
                    <span className="block text-sm text-muted leading-snug line-clamp-2">{i.hook}</span>
                  </span>
                  <span className="text-xs text-muted whitespace-nowrap pt-1">
                    {i.hasGuide ? <span className="text-primary">Full guide</span> : "Estimate · generate"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
