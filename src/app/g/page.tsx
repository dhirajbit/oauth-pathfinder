"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Guide } from "@/lib/schema";
import { decodeGuide } from "@/lib/share";
import { GuideView } from "@/components/GuideView";

/** A shared guide: the whole guide is in the URL fragment, decoded client-side. */
export default function SharedGuidePage() {
  const [guide, setGuide] = useState<Guide | null | undefined>(undefined);

  useEffect(() => {
    const payload = window.location.hash.slice(1);
    setGuide(payload ? decodeGuide(payload) : null);
  }, []);

  if (guide === undefined) return <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16 text-muted">Opening shared guide…</div>;
  if (guide === null)
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
        <h1 className="text-2xl font-semibold tracking-tight">This link doesn&apos;t contain a guide</h1>
        <p className="mt-2 text-muted">The part after # may have been cut when the link was pasted. Ask for the link again, or <Link className="text-primary underline underline-offset-4" href="/">generate a new guide</Link>.</p>
      </div>
    );
  return <GuideView guide={guide} />;
}
