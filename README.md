# OAuth Pathfinder

**Will this OAuth app take an hour, or six weeks of waiting?**

A library of setup guides for 120+ OAuth providers, plus a live agent that investigates any app you name and writes a shareable guide while you watch.

- Live: **https://oauth-pathfinder.vercel.app** (replace if you fork)
- Built for the Composio APM (Integrations) take-home. Budget: ~7 hours.

## The problem, as I understand it

A developer building an agent wants users to connect Gmail, Slack or Salesforce. Their users' *connections* go through an *OAuth app* the developer registered with the *provider*. Composio's [managed OAuth directory](https://docs.composio.dev/toolkits/managed-auth) lets you skip registration for 124 toolkits — but 223 are bring-your-own, and even managed ones get swapped for your own app the moment you need your branding on the consent screen, custom scopes, or your own quota.

At that point the developer hits the hard question nobody answers up front: **is this a 10-minute form or a 6-week review?** Google wants a CASA security assessment for Gmail scopes. Dropbox freezes linking at 50 users. Salesforce quietly stopped letting you create Connected Apps in Spring '26. Slack is ten minutes. The information exists but is scattered across docs, forums and support emails, and it is never framed as *time, effort, and what will block me*.

## What I built

**One guide schema, three ways to get a guide.** Every guide (hand-researched or generated live) has the same shape, so a developer can read, compare and share them identically:

| Section | Answers |
|---|---|
| **Verdict strip** | difficulty, hands-on minutes, approval wait in days, time-to-first-token — on one proportional bar |
| Before you start | prerequisites, with blocking ones flagged |
| Steps | ordered, each tagged **Agent** / **Agent + you** / **You** with the portal URL |
| Scopes | real scope strings and whether each triggers review |
| Approval | triggers, process, review time, what reviewers ask for, common rejections |
| Nuances / Blockers | gotchas (redirect rules, token lifetimes, caps) and a workaround per blocker |
| What an agent can do | the handoff line between agent and human |
| **Evidence** | every source read, what was *confirmed on the page*, what is *still unverified* |

1. **Library (123 apps).** Every entry has a triage estimate (difficulty + the one thing that decides it) and a Composio managed/bring-your-own flag from the directory.
2. **10 full guides** for varied setup challenges — Google Workspace (restricted scopes + CASA), Meta (App Review + Business Verification), LinkedIn (request-only products), Microsoft Graph (admin consent + publisher verification), Salesforce (Connected App → External Client App), Dropbox (50-user production gate), HubSpot (scope/tier gating), Notion (page-sharing instead of scopes), Slack and GitHub (easy, manifest-driven). Produced by research agents reading provider docs, then spot-checked by a person — see [VERIFICATION.md](VERIFICATION.md).
3. **Live generation.** Type any app name or website. One investigator agent (OpenAI Responses API + hosted web search) reads the provider's docs, streams every search and page it opens, then writes a guide validated against the same schema. 1–3 minutes.
   A real run is saved at [`data/examples/lemlist-live.json`](data/examples/lemlist-live.json): the agent correctly found that lemlist has **no third-party OAuth** (API keys only) and said so instead of inventing a flow — 3 searches, 3 pages, 8 official sources, ~2 minutes.
4. **Sharing without accounts.** Library guides have permanent URLs. Generated guides are compressed into the URL fragment (`/g#…`) — nothing is stored server-side, links never expire. Every guide also copies as markdown or downloads as JSON.

## Key decisions

- **Time and effort are the headline, not the steps.** The verdict strip is the first thing on every page because "how long will this take?" is the question that decides whether to use a managed app, pick a different provider, or start the review now.
- **Tag each step with who can do it.** Agents can draft descriptions, pick scopes, write manifests, and fill forms. They cannot verify domain ownership, pay for CASA, or consent as a tenant admin. Making that line explicit per step is what lets a developer plan the work.
- **Evidence is a first-class section.** Provider policies change and docs are often silent on exact numbers. Every guide separates *documented* (official page), *inferred* (community), and *tested* (confirmed on the page), and lists what remains unverified. The live agent streams its searches so you can judge its sources before trusting the output.
- **One schema for library and live output.** Hand-researched guides are the quality bar; the live agent is held to the same shape and validated with Zod (with one automatic repair pass). This means the library can grow by generating and reviewing, not by writing from scratch.
- **No database.** Share links encode the guide itself. It keeps the submission credential-free and the shared artifact permanent. Trade-off: long URLs (~5 KB) and no "recently generated" list.
- **Scope cut:** I did not attempt to log into developer portals and register apps with the agent (would need real accounts, 2FA, and the time budget). The guides record what was confirmed by reading vs. what only registering would prove.

## Run it

```bash
npm install
cp .env.example .env.local   # add OPENAI_API_KEY
npm run dev                  # http://localhost:3000
```

`OPENAI_MODEL` defaults to `gpt-5`; any Responses-API model with the `web_search` tool works. Without a key the library works and live generation returns a clear error.

Deploy: `vercel` (set `OPENAI_API_KEY` in project env). The generate route sets `maxDuration = 300`.

## Layout

```
data/catalog.ts        123-app index: tier estimate, hook, Composio managed flag
data/guides/*.json     10 full guides (schema-validated at build)
src/lib/schema.ts      the Guide schema (Zod) — shared by library, agent, share links
src/lib/agent.ts       live investigator: Responses API + web_search, streamed events, repair pass
src/app/api/generate   SSE endpoint
src/app/generate       live-generation page (log + guide)
src/app/guide/[slug]   library guide pages (static)
src/app/g              shared guide (decoded from URL fragment)
VERIFICATION.md        spot-check of claims against sources: confirmed / corrected / unverifiable
```

## Limitations

- 10 of 123 apps have full guides; the rest are triage estimates until generated. Estimates are my judgment, not sourced.
- Live guides are not reviewed by a person and inherit the model's search quality; review turnaround numbers in particular are often community-sourced.
- Nothing was verified by actually completing a provider review; claims about reviewer behaviour come from docs and forums.
- Share URLs are long; some chat apps truncate them. Markdown copy is the fallback.
- No rate limiting on `/api/generate` — fine for a demo, not for public traffic.
