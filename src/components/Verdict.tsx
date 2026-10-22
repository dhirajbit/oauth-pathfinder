import type { Guide } from "@/lib/schema";

const LABEL: Record<Guide["verdict"]["difficulty"], string> = {
  easy: "Easy",
  moderate: "Moderate",
  hard: "Hard",
  "very-hard": "Very hard",
};

/**
 * The verdict strip. One proportional bar answers "an hour or weeks?":
 * hands-on time (solid) vs approval wait (hatched), on a shared time axis.
 */
export function Verdict({ guide }: { guide: Guide }) {
  const v = guide.verdict;
  const handsOnDays = v.handsOnMinutes.max / (60 * 8); // working days
  const waitDays = v.approvalWait.maxDays;
  const total = Math.max(handsOnDays + waitDays, 0.05);
  // Keep hands-on visible even when the wait dwarfs it.
  const handsPct = Math.max((handsOnDays / total) * 100, 6);
  const waitPct = waitDays > 0 ? Math.max(100 - handsPct, 10) : 0;

  return (
    <section aria-label="Verdict" className="rounded-lg border border-line bg-surface p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span className={`inline-flex items-center gap-2 text-lg font-semibold text-${v.difficulty}`}>
          <span className={`blaze blaze-${v.difficulty}`} aria-hidden />
          {LABEL[v.difficulty]}
        </span>
        <span className="text-muted">{v.difficultyReason}</span>
      </div>

      <div className="mt-5">
        <div className="flex h-3 w-full overflow-hidden rounded-sm bg-wash" role="img" aria-label={`Hands-on ${v.handsOnMinutes.min}–${v.handsOnMinutes.max} minutes; approval wait ${waitDays} days max`}>
          <div className="h-full bg-primary" style={{ width: `${handsPct}%` }} />
          {waitPct > 0 && (
            <div
              className="h-full"
              style={{
                width: `${waitPct}%`,
                backgroundImage: "repeating-linear-gradient(135deg, var(--line-strong) 0 4px, transparent 4px 8px)",
              }}
            />
          )}
        </div>
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-2 text-sm">
          <div>
            <div className="font-medium">Hands-on: {v.handsOnMinutes.min}–{v.handsOnMinutes.max} min</div>
            <div className="text-muted">Registering, scopes, redirect URIs, first test token</div>
          </div>
          <div>
            <div className="font-medium">
              {v.approvalWait.required === "none"
                ? "No approval wait"
                : `Approval wait: ${v.approvalWait.minDays}–${v.approvalWait.maxDays} days`}
              {v.approvalWait.required === "conditional" && <span className="text-muted font-normal"> (only in some cases)</span>}
            </div>
            <div className="text-muted">{v.approvalWait.note}</div>
          </div>
          <div>
            <div className="font-medium">Time to first token</div>
            <div className="text-muted">{v.timeToFirstToken}</div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        <Tag>
          {guide.composio.managedAuthAvailable === null
            ? "No third-party OAuth registration for this provider"
            : guide.composio.managedAuthAvailable
              ? `Composio-managed OAuth available${guide.composio.toolkitSlug ? ` (${guide.composio.toolkitSlug})` : ""}`
              : "Composio: bring your own OAuth app"}
        </Tag>
        <Tag>
          {guide.meta.generatedBy === "live-agent" ? "Generated live by the agent" : guide.meta.generatedBy === "research-agent" ? "Researched by agent, checked by a person" : "Written by a person"}
          {" · "}
          {guide.meta.generatedAt.slice(0, 10)}
        </Tag>
      </div>
    </section>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full border border-line px-2.5 py-1 text-muted">{children}</span>;
}
