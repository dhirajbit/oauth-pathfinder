import Link from "next/link";

export default function About() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 space-y-10 prose-tight">
      <section>
        <h1 className="text-3xl font-semibold tracking-tight">How this works</h1>
        <p className="mt-4 text-muted leading-relaxed">
          When you build an agent that acts on a user&apos;s Gmail, Slack or CRM, each user connects their account through OAuth. That consent screen is shown by an
          <em> OAuth app</em> you registered with the provider. Some providers let you register and ship in ten minutes; others cap unverified apps at a handful of users
          and want a security assessment, a business verification, or a partner contract before real users can connect.
        </p>
        <p className="mt-3 text-muted leading-relaxed">
          Composio can supply a managed OAuth app for many toolkits so you skip this entirely. When it can&apos;t — or you want your own branding, scopes and quota — you
          need to go through the provider yourself. These guides are for that path.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold tracking-tight">What a guide tells you</h2>
        <ul className="mt-3 space-y-2 text-muted">
          <li><span className="text-ink font-medium">Verdict</span> — difficulty, hands-on minutes, approval wait in days, and time to first token, on one bar.</li>
          <li><span className="text-ink font-medium">Steps</span> — in order, each tagged with who can do it: the agent alone, agent plus you, or only you.</li>
          <li><span className="text-ink font-medium">Scopes, approval, nuances, blockers</span> — what triggers a review, what reviewers ask for, why apps get rejected, and how to proceed when stuck.</li>
          <li><span className="text-ink font-medium">Evidence</span> — every source read, what was confirmed on those pages, and what remains unverified.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold tracking-tight">Where guides come from</h2>
        <p className="mt-3 text-muted leading-relaxed">
          Full guides were produced by research agents that read provider documentation, then checked by a person against the cited pages; corrections and open questions
          are recorded in each guide&apos;s evidence section. Everything else in the library carries a triage estimate until you generate it.
        </p>
        <p className="mt-3 text-muted leading-relaxed">
          Live generation runs one investigator agent with web search. It streams every query and page it opens so you can judge the evidence yourself, then writes a guide
          that is validated against the same schema as the library. Generated guides are marked as such and have not been checked by a person.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold tracking-tight">Sharing</h2>
        <p className="mt-3 text-muted leading-relaxed">
          Library guides have permanent URLs. Generated guides are encoded into the link itself (the part after <code className="font-mono text-sm">#</code>), so sharing needs no account
          and nothing is stored on a server. You can also copy a guide as markdown for a ticket or README, or download the JSON.
        </p>
      </section>

      <p><Link className="text-primary underline underline-offset-4" href="/">Back to the library</Link></p>
    </div>
  );
}
