import OpenAI from "openai";
import { z } from "zod";
import { GuideSchema, type Guide } from "./schema";
import { CATALOG } from "../../data/catalog";

/**
 * The live investigation agent.
 *
 * One Responses API call with the hosted `web_search` tool: the model
 * searches the provider's developer docs, reads the pages it needs, and
 * writes a guide that validates against GuideSchema. We stream its progress
 * (searches, pages opened, citations) to the client so the developer can
 * watch what the agent is looking at and judge the evidence for themselves.
 */

export type AgentEvent =
  | { type: "status"; text: string }
  | { type: "search"; query: string }
  | { type: "open"; url: string }
  | { type: "source"; url: string; title: string }
  | { type: "progress"; chars: number }
  | { type: "guide"; guide: Guide }
  | { type: "error"; message: string };

const MODEL = process.env.OPENAI_MODEL ?? "gpt-5";

const COMPOSIO_MANAGED = CATALOG.filter((c) => c.managed)
  .map((c) => `${c.name} (${c.composioSlug})`)
  .join(", ");

function systemPrompt(today: string) {
  return `You are an OAuth-setup investigator for developers who build AI agents. A developer names an app; you investigate what it takes to register an OAuth app with that provider and get it approved for real users, then write a guide they can follow and share.

Work like an engineer doing due diligence, not a copywriter:
1. Identify the provider and its developer portal. Search the OFFICIAL developer docs first (OAuth/authorization guide, app registration, scopes/permissions, app review / verification / publishing / production access, rate limits, token lifetimes). Open and read the pages — do not rely on memory for numbers.
2. Look specifically for: app review or verification programs, user caps in development/testing mode, business/publisher verification, paid tiers, partner-only OAuth, redirect URI rules, token expiry, admin-consent or workspace-approval policies, and anything that makes the consent screen scary (unverified-app warnings).
3. Where official docs give no number (e.g. review turnaround), you may use one or two reputable community sources (provider forums, Stack Overflow, well-known engineering blogs), but mark every such claim as "inferred" and list it in evidence.unverified.
4. If the app has no OAuth at all (API keys only, or OAuth only for approved partners), say so plainly in the summary, set difficulty accordingly, and describe the real path (e.g. partner application) instead of inventing an OAuth flow.

Output rules:
- Return ONLY a JSON object that matches the provided schema. No prose outside the JSON.
- slug: lowercase kebab-case of the app name. website: the developer portal URL.
- verdict.handsOnMinutes: realistic minutes for the registration itself. approvalWait: minDays/maxDays as calendar days (0/0 if none); required = none | conditional (only for some scopes / public listing) | always. timeToFirstToken: one phrase, e.g. "~15 min for yourself; 2-6 weeks for public users with sensitive scopes".
- steps: 6-12 ordered, concrete steps. who = "agent" when an AI agent with a browser and API access could do it alone (drafting app descriptions, choosing scopes, generating manifests, filling forms), "assisted" when the agent prepares and a human must click/approve/log in, "human" when only the developer or company can do it (domain ownership, business verification, payment, contracts, admin consent in a customer tenant). Include portalUrl when a console page exists.
- scopes.examples: 4-8 REAL scope strings from the docs with triggersReview.
- nuances: 4-8 gotchas. blockers: 3-6 with a workaround each. agentPlan: what an agent does end to end vs where the human takes over.
- evidence.sources: every page you actually read (url, title, confidence = "documented" for official docs, "inferred" for third-party). evidence.tested: what you confirmed by reading the pages (phrase as "Confirmed on <page>: ..."). evidence.unverified: every number or claim you could not confirm. Be candid; an honest "unverified" is worth more than a confident guess.
- composio.managedAuthAvailable: true if the app is in this list of toolkits with Composio-managed OAuth: ${COMPOSIO_MANAGED}. Set toolkitSlug to the slug in parentheses. If it is not in the list set false and note "Bring your own OAuth app; register the redirect URI https://backend.composio.dev/api/v3/toolkits/auth/callback". If the provider offers NO third-party OAuth client registration (API keys only, or OAuth only for approved partners), set managedAuthAvailable to null, leave toolkitSlug empty, and make the note say what the real auth path is (e.g. "No third-party OAuth; per-account API key") — do not mention a redirect URI in that case.
- meta: generatedBy "live-agent", generatedAt "${today}", version 1.
Be specific. Numbers, URLs, scope strings. Short sentences.`;
}

type JsonNode = Record<string, unknown>;

/** OpenAI strict mode needs every property required and no extras; optional fields become nullable. */
function strictify(node: unknown): unknown {
  if (Array.isArray(node)) return node.map(strictify);
  if (node && typeof node === "object") {
    const out: JsonNode = {};
    for (const [k, v] of Object.entries(node as JsonNode)) out[k] = strictify(v);
    const props = out.properties as Record<string, JsonNode> | undefined;
    if (out.type === "object" && props) {
      const required = new Set((out.required as string[] | undefined) ?? []);
      for (const key of Object.keys(props)) {
        if (!required.has(key)) {
          const p = props[key];
          if (typeof p.type === "string") p.type = [p.type, "null"];
          else if (Array.isArray(p.type)) p.type = [...new Set([...(p.type as string[]), "null"])];
          else props[key] = { anyOf: [p, { type: "null" }] };
        }
      }
      out.required = Object.keys(props);
      out.additionalProperties = false;
    }
    return out;
  }
  return node;
}

function jsonSchema() {
  const schema = z.toJSONSchema(GuideSchema, { target: "draft-2020-12" }) as JsonNode;
  delete schema.$schema;
  return strictify(schema) as JsonNode;
}

/** Undo the nullable-for-optional trick and fill the fields models most often drop. */
function normalize(raw: unknown): unknown {
  const strip = (v: unknown): unknown => {
    if (Array.isArray(v)) return v.map(strip);
    if (v && typeof v === "object") {
      const out: JsonNode = {};
      for (const [k, val] of Object.entries(v as JsonNode)) if (val !== null) out[k] = strip(val);
      return out;
    }
    return v;
  };
  const g = strip(raw) as JsonNode;
  const composio = (g.composio ?? {}) as JsonNode;
  const rawComposio = ((raw as JsonNode)?.composio ?? {}) as JsonNode;
  if (!("managedAuthAvailable" in composio)) composio.managedAuthAvailable = rawComposio.managedAuthAvailable === null ? null : false;
  g.composio = composio;
  const scopes = (g.scopes ?? {}) as JsonNode;
  scopes.examples = ((scopes.examples as JsonNode[] | undefined) ?? []).map((s) => ({ triggersReview: false, ...s }));
  g.scopes = scopes;
  g.prerequisites = ((g.prerequisites as JsonNode[] | undefined) ?? []).map((p) => ({ blocking: false, ...p }));
  const approval = (g.approval ?? {}) as JsonNode;
  for (const k of ["triggers", "reviewerAsksFor", "commonRejections"]) approval[k] ??= [];
  g.approval = approval;
  const evidence = (g.evidence ?? {}) as JsonNode;
  for (const k of ["sources", "tested", "unverified"]) evidence[k] ??= [];
  g.evidence = evidence;
  g.meta ??= { generatedBy: "live-agent", generatedAt: new Date().toISOString(), version: 1 };
  return g;
}

/** Try to pull a JSON object out of model text even if it added stray prose. */
function extractJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start >= 0 && end > start) return JSON.parse(text.slice(start, end + 1));
    throw new Error("No JSON object in model output");
  }
}

export async function* investigate(appQuery: string, signal?: AbortSignal): AsyncGenerator<AgentEvent> {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const today = new Date().toISOString().slice(0, 10);

  yield { type: "status", text: `Investigating "${appQuery}" with ${MODEL} + web search` };

  const stream = await client.responses.create(
    {
      model: MODEL,
      instructions: systemPrompt(today),
      input: `App to investigate: ${appQuery}\n\nProduce the OAuth app setup guide JSON.`,
      tools: [{ type: "web_search" }],
      tool_choice: "auto",
      reasoning: { effort: "low" },
      text: { format: { type: "json_schema", name: "oauth_setup_guide", schema: jsonSchema(), strict: true } },
      stream: true,
      max_output_tokens: 12000,
    },
    { signal }
  );

  let text = "";
  const seen = new Set<string>();

  for await (const event of stream) {
    switch (event.type) {
      case "response.web_search_call.searching":
        yield { type: "status", text: "Searching the web…" };
        break;
      case "response.output_item.done": {
        const item = event.item as { type: string; action?: { type?: string; query?: string; url?: string } };
        if (item.type === "web_search_call" && item.action) {
          if (item.action.type === "search" && item.action.query) yield { type: "search", query: item.action.query };
          else if (item.action.type === "open_page" && item.action.url) yield { type: "open", url: item.action.url };
        }
        break;
      }
      case "response.output_text.annotation.added": {
        const a = event.annotation as { type: string; url?: string; title?: string };
        if (a.type === "url_citation" && a.url && !seen.has(a.url)) {
          seen.add(a.url);
          yield { type: "source", url: a.url, title: a.title ?? a.url };
        }
        break;
      }
      case "response.output_text.delta":
        if (text.length === 0) yield { type: "status", text: "Writing the guide…" };
        text += event.delta;
        if (text.length % 400 < event.delta.length) yield { type: "progress", chars: text.length };
        break;
      case "response.failed":
        yield { type: "error", message: event.response.error?.message ?? "Model run failed" };
        return;
      case "response.incomplete":
        yield { type: "error", message: `Model stopped early: ${event.response.incomplete_details?.reason ?? "unknown"}` };
        return;
      default:
        break;
    }
  }

  yield { type: "status", text: "Validating against the guide schema…" };
  let parsed = GuideSchema.safeParse(normalize(extractJson(text)));
  if (!parsed.success) {
    // One repair pass: hand the validation errors back to the model without tools.
    yield { type: "status", text: "Schema mismatch — asking the model to repair its output" };
    const repair = await client.responses.create(
      {
        model: MODEL,
        instructions: "Fix the JSON so it validates against the schema. Return only the corrected JSON.",
        input: `Validation errors:\n${JSON.stringify(parsed.error.issues.slice(0, 20), null, 1)}\n\nJSON:\n${text}`,
        text: { format: { type: "json_schema", name: "oauth_setup_guide", schema: jsonSchema(), strict: true } },
        reasoning: { effort: "low" },
      },
      { signal }
    );
    parsed = GuideSchema.safeParse(normalize(extractJson(repair.output_text)));
    if (!parsed.success) {
      yield { type: "error", message: `Guide failed validation: ${parsed.error.issues[0]?.path.join(".")} ${parsed.error.issues[0]?.message}` };
      return;
    }
  }

  const guide = parsed.data;
  // Merge streamed citations the model forgot to list, so the evidence panel is complete.
  const listed = new Set(guide.evidence.sources.map((s) => s.url));
  for (const url of seen) if (!listed.has(url)) guide.evidence.sources.push({ url, title: url, confidence: "documented", note: "cited during search; not listed by the model" });
  guide.meta.generatedBy = "live-agent";
  guide.meta.generatedAt = new Date().toISOString();
  yield { type: "guide", guide };
}
