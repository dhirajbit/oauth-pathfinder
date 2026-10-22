"use client";

import { useState } from "react";
import type { Guide } from "@/lib/schema";
import { encodeGuide } from "@/lib/share";
import { guideToMarkdown } from "@/lib/markdown";

/** Copy a permanent link (guide lives in the URL fragment) or the markdown. */
export function ShareBar({ guide, shareHref }: { guide: Guide; shareHref?: string }) {
  const [done, setDone] = useState<string | null>(null);

  const flash = (what: string) => {
    setDone(what);
    setTimeout(() => setDone(null), 1600);
  };

  const link = () => {
    const base = window.location.origin;
    return shareHref ? `${base}${shareHref}` : `${base}/g#${encodeGuide(guide)}`;
  };

  const copy = async (text: string, what: string) => {
    try { await navigator.clipboard.writeText(text); flash(what); } catch { flash("Copy failed"); }
  };

  const download = () => {
    const blob = new Blob([JSON.stringify(guide, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${guide.slug}-oauth-guide.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="rounded-lg border border-line bg-surface p-4 text-sm">
      <div className="font-medium">Share this guide</div>
      <div className="mt-3 flex flex-col gap-2">
        <button onClick={() => copy(link(), "Link copied")} className="rounded-md bg-primary text-primary-ink px-3 py-2 text-left font-medium hover:opacity-90">Copy link</button>
        <button onClick={() => copy(guideToMarkdown(guide), "Markdown copied")} className="rounded-md border border-line px-3 py-2 text-left hover:bg-wash">Copy as markdown</button>
        <button onClick={download} className="rounded-md border border-line px-3 py-2 text-left hover:bg-wash">Download JSON</button>
      </div>
      <div className="mt-2 h-5 text-muted" aria-live="polite">{done}</div>
    </div>
  );
}
