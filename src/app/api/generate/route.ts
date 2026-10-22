import { NextRequest } from "next/server";
import { investigate } from "@/lib/agent";

export const maxDuration = 300;

/** Server-sent events: one JSON AgentEvent per `data:` line. */
export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return new Response(JSON.stringify({ error: "OPENAI_API_KEY is not configured on the server" }), { status: 500 });
  }
  const body = (await req.json().catch(() => ({}))) as { app?: string };
  const app = (body.app ?? "").trim().slice(0, 120);
  if (app.length < 2) return new Response(JSON.stringify({ error: "Tell me an app name or website" }), { status: 400 });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (obj: unknown) => controller.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`));
      const keepalive = setInterval(() => controller.enqueue(encoder.encode(": ping\n\n")), 15000);
      try {
        for await (const ev of investigate(app, req.signal)) send(ev);
      } catch (err) {
        send({ type: "error", message: err instanceof Error ? err.message : String(err) });
      } finally {
        clearInterval(keepalive);
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache, no-transform", Connection: "keep-alive" },
  });
}
