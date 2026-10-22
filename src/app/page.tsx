import { getLibrary } from "@/lib/guides";
import { Library } from "@/components/Library";

export default function Home() {
  const items = getLibrary();
  const verified = items.filter((i) => i.hasGuide);
  const counts = { easy: 0, moderate: 0, hard: 0, "very-hard": 0 };
  for (const i of items) counts[i.tier]++;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-16">
      <section className="max-w-3xl">
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.05]">
          Will this OAuth app take an hour, or six weeks of waiting?
        </h1>
        <p className="mt-5 text-lg text-muted leading-relaxed">
          Before your agent&apos;s users can connect Gmail, Slack or Salesforce, you need an OAuth app with that provider — and sometimes their approval.
          Look up an app to get a step-by-step guide with time estimates, approval triggers, blockers, and what an agent can do for you.
        </p>
      </section>

      <div className="mt-10">
        <Library items={items} />
      </div>

      <section className="mt-16 grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-10 max-w-4xl">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">How to read the blaze</h2>
          <ul className="mt-4 space-y-3 text-muted">
            <li className="flex gap-3"><span className="blaze blaze-easy mt-1.5" /><span><span className="text-ink font-medium">Easy</span> — register, paste the redirect URI, done. No review. ({counts.easy})</span></li>
            <li className="flex gap-3"><span className="blaze blaze-moderate mt-1.5" /><span><span className="text-ink font-medium">Moderate</span> — works for you right away; reaching other users needs a form, an admin, or a short review. ({counts.moderate})</span></li>
            <li className="flex gap-3"><span className="blaze blaze-hard mt-1.5" /><span><span className="text-ink font-medium">Hard</span> — a review program with weeks of wait, or access that must be requested. ({counts.hard})</span></li>
            <li className="flex gap-3"><span className="blaze blaze-very-hard mt-1.5" /><span><span className="text-ink font-medium">Very hard</span> — business verification, security assessments, paid tiers, or partner-only access. ({counts["very-hard"]})</span></li>
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Two kinds of guide</h2>
          <p className="mt-4 text-muted">
            <span className="text-ink font-medium">Full guides ({verified.length})</span> were researched by an agent reading provider docs, then checked by a person against those sources. Each one lists what was confirmed and what still isn&apos;t.
          </p>
          <p className="mt-3 text-muted">
            <span className="text-ink font-medium">Estimates</span> are triage calls for the rest of the library. Generate the full guide and the agent investigates live; the result is shareable the moment it finishes.
          </p>
        </div>
      </section>
    </div>
  );
}
