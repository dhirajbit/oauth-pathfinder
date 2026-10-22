"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Guide } from "@/lib/schema";
import type { AgentEvent } from "@/lib/agent";
import { GuideView } from "@/components/GuideView";
import { encodeGuide } from "@/lib/share";

type LogLine = { kind: "status" | "search" | "open" | "source"; text: string; url?: string };

export function GenerateClient({ app }: { app: string }) {
  const [log, setLog] = useState<LogLine[]>([]);
  const [chars, setChars] = useState(0);
  const [guide, setGuide] = useState<Guide | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!app || started.current) return;
    started.current = true;
    const ctrl = new AbortController();
    const t0 = Date.now();
    const timer = setInterval(() => setElapsed(Math.floor((Date.now() - t0) / 1000)), 1000);

    (async () => {
      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ app }),
          signal: ctrl.signal,
        });
        if (!res.ok || !res.body) {
          const j = await res.json().catch(() => ({}));
          throw new Error(j.error ?? `Request failed (${res.status})`);
        }
        const reader = res.body.getReader();
        const dec = new TextDecoder();
        let buf = "";
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buf += dec.decode(value, { stream: true });
          let idx;
          while ((idx = buf.indexOf("\n\n")) >= 0) {
            const chunk = buf.slice(0, idx);
            buf = buf.slice(idx + 2);
            const line = chunk.split("\n").find((l) => l.startsWith("data: "));
            if (!line) continue;
            const ev = JSON.parse(line.slice(6)) as AgentEvent;
            if (ev.type === "status") setLog((l) => [...l, { kind: "status", text: ev.text }]);
            else if (ev.type === "search") setLog((l) => [...l, { kind: "search", text: ev.query }]);
            else if (ev.type === "open") setLog((l) => [...l, { kind: "open", text: ev.url, url: ev.url }]);
            else if (ev.type === "source") setLog((l) => [...l, { kind: "source", text: ev.title, url: ev.url }]);
            else if (ev.type === "progress") setChars(ev.chars);
            else if (ev.type === "guide") {
              setGuide(ev.guide);
              // Put the guide in the URL so the tab itself is the shareable link.
              history.replaceState(null, "", `/g#${encodeGuide(ev.guide)}`);
            } else if (ev.type === "error") setError(ev.message);
          }
        }
      } catch (e) {
        if (!ctrl.signal.aborted) setError(e instanceof Error ? e.message : String(e));
      } finally {
        clearInterval(timer);
      }
    })();
    // Reset the guard on cleanup so StrictMode's second effect run (dev) restarts the stream.
    return () => { started.current = false; ctrl.abort(); clearInterval(timer); };
  }, [app]);

  if (!app) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
        <h1 className="text-2xl font-semibold tracking-tight">Which app?</h1>
        <p className="mt-2 text-muted">Go back to the <Link className="text-primary underline underline-offset-4" href="/">library</Link> and type an app name or website.</p>
      </div>
    );
  }

  if (guide) {
    return (
      <div>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-6">
          <details className="rounded-lg border border-line bg-surface text-sm">
            <summary className="cursor-pointer px-4 py-3 font-medium">Investigation log — {log.filter((l) => l.kind === "search").length} searches, {log.filter((l) => l.kind === "open" || l.kind === "source").length} pages read, {elapsed}s</summary>
            <div className="px-4 pb-4"><Log log={log} /></div>
          </details>
        </div>
        <GuideView guide={guide} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
      <div className="text-sm text-muted">Live investigation</div>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">{app}</h1>
      {error ? (
        <div className="mt-6 rounded-lg border border-hard/40 bg-surface p-5">
          <div className="font-medium text-hard">The agent couldn&apos;t finish</div>
          <p className="mt-1 text-muted">{error}</p>
          <div className="mt-4 flex gap-3 text-sm">
            <button onClick={() => location.reload()} className="rounded-md bg-primary text-primary-ink px-3 py-2 font-medium">Try again</button>
            <Link href="/" className="rounded-md border border-line px-3 py-2">Back to library</Link>
          </div>
        </div>
      ) : (
        <div className="mt-6 rounded-lg border border-line bg-surface p-5">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2"><span className="blaze blaze-moderate pulse" aria-hidden />The agent is reading the provider&apos;s docs</span>
            <span className="text-muted tabular-nums">{elapsed}s{chars > 0 && ` · ${chars.toLocaleString()} chars written`}</span>
          </div>
          <div className="mt-4"><Log log={log} /></div>
          <p className="mt-4 text-sm text-muted">Typically 1–3 minutes. Searches and pages appear here as the agent opens them, so you can see what the guide is based on.</p>
        </div>
      )}
    </div>
  );
}

function Log({ log }: { log: LogLine[] }) {
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ block: "nearest" }); }, [log.length]);
  if (log.length === 0) return <p className="text-sm text-muted">Starting…</p>;
  return (
    <ol className="max-h-72 overflow-y-auto space-y-1.5 text-sm">
      {log.map((l, i) => (
        <li key={i} className="grid grid-cols-[5.5rem_1fr] gap-2">
          <span className={`text-xs pt-0.5 ${l.kind === "search" ? "text-agent" : l.kind === "source" ? "text-primary" : "text-muted"}`}>
            {l.kind === "search" ? "searched" : l.kind === "open" ? "opened" : l.kind === "source" ? "cited" : "status"}
          </span>
          {l.url ? <a className="underline underline-offset-4 break-all" href={l.url} target="_blank" rel="noreferrer">{l.text}</a> : <span>{l.text}</span>}
        </li>
      ))}
      <div ref={endRef} />
    </ol>
  );
}
