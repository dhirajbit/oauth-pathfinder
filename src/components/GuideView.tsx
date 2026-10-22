import type { Guide, Who } from "@/lib/schema";
import { Verdict } from "./Verdict";
import { ShareBar } from "./ShareBar";

const WHO: Record<Who, { label: string; cls: string; hint: string }> = {
  agent: { label: "Agent", cls: "text-agent border-agent/40", hint: "An agent with a browser and API access can do this alone" },
  assisted: { label: "Agent + you", cls: "text-assisted border-assisted/40", hint: "Agent prepares it; you log in, click or approve" },
  human: { label: "You", cls: "text-human border-human/40", hint: "Only you or your company can do this" },
};

export function GuideView({ guide, shareHref }: { guide: Guide; shareHref?: string }) {
  const sections = [
    ["prereqs", "Before you start"],
    ["steps", "Steps"],
    ["scopes", "Scopes"],
    ["approval", "Approval"],
    ["nuances", "Nuances"],
    ["blockers", "If you get blocked"],
    ["agent", "What an agent can do"],
    ["evidence", "Evidence"],
  ] as const;

  return (
    <article className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
      <header className="max-w-3xl">
        <div className="text-sm text-muted">{guide.category}</div>
        <h1 className="mt-1 text-3xl sm:text-4xl font-semibold tracking-tight">{guide.name}</h1>
        <p className="mt-3 text-lg text-muted leading-relaxed">{guide.summary}</p>
        <div className="mt-3 text-sm">
          <a className="text-primary underline underline-offset-4" href={guide.website} target="_blank" rel="noreferrer">{guide.website.replace(/^https?:\/\//, "")}</a>
        </div>
      </header>

      <div className="mt-8"><Verdict guide={guide} /></div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_16rem] gap-10">
        <div className="min-w-0 space-y-12">
          <Section id="prereqs" title="Before you start">
            <ul className="space-y-2">
              {guide.prerequisites.map((p, i) => (
                <li key={i} className="flex gap-3">
                  <span className={`mt-2 h-1.5 w-1.5 flex-none rounded-full ${p.blocking ? "bg-hard" : "bg-line-strong"}`} aria-hidden />
                  <span>{p.text}{p.blocking && <span className="text-muted"> — blocking</span>}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section id="steps" title="Steps">
            <ol className="space-y-5">
              {guide.steps.map((s, i) => (
                <li key={s.id} className="grid grid-cols-[2rem_1fr] gap-3">
                  <span className="text-muted tabular-nums pt-0.5">{i + 1}.</span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-medium">{s.title}</h3>
                      <span title={WHO[s.who].hint} className={`rounded-full border px-2 py-0.5 text-xs ${WHO[s.who].cls}`}>{WHO[s.who].label}</span>
                    </div>
                    <p className="mt-1 text-muted leading-relaxed">{s.detail}</p>
                    {s.portalUrl && (
                      <a className="mt-1 inline-block text-sm text-primary underline underline-offset-4 break-all" href={s.portalUrl} target="_blank" rel="noreferrer">
                        {s.portalUrl.replace(/^https?:\/\//, "")}
                      </a>
                    )}
                    {s.tips && s.tips.length > 0 && (
                      <ul className="mt-2 space-y-1 text-sm text-muted">
                        {s.tips.map((t, j) => <li key={j} className="pl-3 border-l border-line whitespace-pre-wrap">{t}</li>)}
                      </ul>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </Section>

          <Section id="scopes" title="Scopes">
            <p className="text-muted">{guide.scopes.note}</p>
            <table className="mt-4 w-full text-sm">
              <thead className="text-left text-muted">
                <tr><th className="py-1 pr-3 font-medium">Scope</th><th className="py-1 pr-3 font-medium">Purpose</th><th className="py-1 font-medium">Review</th></tr>
              </thead>
              <tbody>
                {guide.scopes.examples.map((s, i) => (
                  <tr key={i} className="border-t border-line align-top">
                    <td className="py-2 pr-3 font-mono text-xs break-all">{s.scope}</td>
                    <td className="py-2 pr-3">{s.purpose}</td>
                    <td className={`py-2 ${s.triggersReview ? "text-hard" : "text-muted"}`}>{s.triggersReview ? "Triggers review" : "No review"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>

          <Section id="approval" title="Approval">
            <dl className="grid grid-cols-1 sm:grid-cols-[10rem_1fr] gap-x-6 gap-y-3">
              <dt className="text-muted">Required</dt><dd>{guide.approval.required === "none" ? "No" : guide.approval.required === "always" ? "Yes, always" : "Only in some cases"}</dd>
              {guide.approval.triggers.length > 0 && (<><dt className="text-muted">Triggered by</dt><dd><List items={guide.approval.triggers} /></dd></>)}
              <dt className="text-muted">Process</dt><dd>{guide.approval.process}</dd>
              <dt className="text-muted">Review time</dt><dd>{guide.approval.reviewTime}</dd>
              {guide.approval.reviewerAsksFor.length > 0 && (<><dt className="text-muted">Reviewers ask for</dt><dd><List items={guide.approval.reviewerAsksFor} /></dd></>)}
              {guide.approval.commonRejections.length > 0 && (<><dt className="text-muted">Common rejections</dt><dd><List items={guide.approval.commonRejections} /></dd></>)}
            </dl>
          </Section>

          <Section id="nuances" title="Nuances">
            <ul className="space-y-3">
              {guide.nuances.map((n, i) => (
                <li key={i}><span className="font-medium">{n.title}.</span> <span className="text-muted">{n.detail}</span></li>
              ))}
            </ul>
          </Section>

          <Section id="blockers" title="If you get blocked">
            <ul className="space-y-3">
              {guide.blockers.map((b, i) => (
                <li key={i} className="rounded-md border border-line p-3">
                  <div className="font-medium">{b.blocker}</div>
                  <div className="mt-1 text-muted">{b.workaround}</div>
                </li>
              ))}
            </ul>
          </Section>

          <Section id="agent" title="What an agent can do">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-agent">Agent handles</h3>
                <List items={guide.agentPlan.agentDoes} className="mt-2" />
              </div>
              <div>
                <h3 className="font-medium text-human">You take over for</h3>
                <List items={guide.agentPlan.humanDoes} className="mt-2" />
              </div>
            </div>
          </Section>

          <Section id="evidence" title="Evidence">
            <p className="text-muted">Where this guide comes from, what was checked, and what is still a guess.</p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium">Checked</h3>
                {guide.evidence.tested.length ? <List items={guide.evidence.tested} className="mt-2 text-sm" /> : <p className="mt-2 text-sm text-muted">Nothing was tested beyond reading the sources.</p>}
              </div>
              <div>
                <h3 className="font-medium">Not verified</h3>
                {guide.evidence.unverified.length ? <List items={guide.evidence.unverified} className="mt-2 text-sm" /> : <p className="mt-2 text-sm text-muted">Nothing flagged.</p>}
              </div>
            </div>
            <h3 className="mt-6 font-medium">Sources</h3>
            <ul className="mt-2 space-y-1.5 text-sm">
              {guide.evidence.sources.map((s, i) => (
                <li key={i} className="flex flex-wrap items-baseline gap-x-2">
                  <span className={`text-xs ${s.confidence === "tested" ? "text-easy" : s.confidence === "documented" ? "text-primary" : "text-moderate"}`}>{s.confidence}</span>
                  <a className="underline underline-offset-4 break-all" href={s.url} target="_blank" rel="noreferrer">{s.title}</a>
                  {s.note && <span className="text-muted">— {s.note}</span>}
                </li>
              ))}
            </ul>
          </Section>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-6 space-y-6">
            <ShareBar guide={guide} shareHref={shareHref} />
            <nav aria-label="On this page" className="text-sm">
              <ul className="space-y-1.5 border-l border-line">
                {sections.map(([id, title]) => (
                  <li key={id}><a className="block pl-3 text-muted hover:text-ink" href={`#${id}`}>{title}</a></li>
                ))}
              </ul>
            </nav>
          </div>
        </aside>
      </div>

      <div className="lg:hidden mt-10"><ShareBar guide={guide} shareHref={shareHref} /></div>
    </article>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20 prose-tight">
      <h2 className="text-xl font-semibold tracking-tight mb-4">{title}</h2>
      {children}
    </section>
  );
}

function List({ items, className = "" }: { items: string[]; className?: string }) {
  return (
    <ul className={`space-y-1.5 ${className}`}>
      {items.map((t, i) => (
        <li key={i} className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-line-strong" aria-hidden />{t}</li>
      ))}
    </ul>
  );
}
