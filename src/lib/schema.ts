import { z } from "zod";

/**
 * The single guide schema shared by the hand-researched library, the
 * live-generation agent and the share/export surfaces.
 *
 * Every factual field that could be wrong carries a `source` or `confidence`
 * so a developer can tell "we tested this" from "the docs say this" from
 * "the agent inferred this".
 */

export const Confidence = z.enum(["tested", "documented", "inferred"]);
export type Confidence = z.infer<typeof Confidence>;

export const Who = z.enum(["agent", "assisted", "human"]);
export type Who = z.infer<typeof Who>;

export const Difficulty = z.enum(["easy", "moderate", "hard", "very-hard"]);
export type Difficulty = z.infer<typeof Difficulty>;

export const SourceSchema = z.object({
  url: z.string(),
  title: z.string(),
  confidence: Confidence,
  note: z.string().optional(),
});

export const StepSchema = z.object({
  id: z.string(),
  title: z.string(),
  detail: z.string(),
  who: Who,
  portalUrl: z.string().optional(),
  tips: z.array(z.string()).optional(),
  source: z.string().optional(),
});

export const GuideSchema = z.object({
  slug: z.string(),
  name: z.string(),
  website: z.string(),
  category: z.string(),
  summary: z.string(),
  composio: z.object({
    managedAuthAvailable: z.boolean().nullable(),
    toolkitSlug: z.string().optional(),
    note: z.string().optional(),
  }),
  verdict: z.object({
    difficulty: Difficulty,
    difficultyReason: z.string(),
    handsOnMinutes: z.object({ min: z.number(), max: z.number() }),
    approvalWait: z.object({
      required: z.enum(["none", "conditional", "always"]),
      minDays: z.number(),
      maxDays: z.number(),
      note: z.string(),
    }),
    timeToFirstToken: z.string(),
  }),
  prerequisites: z.array(
    z.object({ text: z.string(), blocking: z.boolean(), source: z.string().optional() })
  ),
  steps: z.array(StepSchema),
  scopes: z.object({
    note: z.string(),
    examples: z.array(
      z.object({ scope: z.string(), purpose: z.string(), triggersReview: z.boolean() })
    ),
  }),
  approval: z.object({
    required: z.enum(["none", "conditional", "always"]),
    triggers: z.array(z.string()),
    process: z.string(),
    reviewTime: z.string(),
    reviewerAsksFor: z.array(z.string()),
    commonRejections: z.array(z.string()),
    source: z.string().optional(),
  }),
  nuances: z.array(
    z.object({ title: z.string(), detail: z.string(), source: z.string().optional() })
  ),
  blockers: z.array(z.object({ blocker: z.string(), workaround: z.string() })),
  agentPlan: z.object({
    agentDoes: z.array(z.string()),
    humanDoes: z.array(z.string()),
  }),
  evidence: z.object({
    sources: z.array(SourceSchema),
    tested: z.array(z.string()),
    unverified: z.array(z.string()),
  }),
  meta: z.object({
    generatedBy: z.enum(["research-agent", "live-agent", "human"]),
    generatedAt: z.string(),
    reviewedBy: z.string().optional(),
    version: z.number(),
  }),
});

export type Guide = z.infer<typeof GuideSchema>;
export type Step = z.infer<typeof StepSchema>;
export type Source = z.infer<typeof SourceSchema>;
