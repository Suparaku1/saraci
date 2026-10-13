import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const schema = z.object({
  message: z.string().min(1).max(500),
  stack: z.string().max(2000).optional(),
  path: z.string().max(300).optional(),
  userAgent: z.string().max(300).optional(),
});

// Kufi i thjeshtë kundër abuzimit: sa gabime pranohen brenda një minute.
const MAX_PER_MINUTE = 60;

export const Route = createFileRoute("/api/public/hooks/errors")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const len = Number(request.headers.get("content-length") ?? 0);
        if (len > 8000) return new Response("Payload too large", { status: 413 });

        let parsed;
        try {
          parsed = schema.parse(await request.json());
        } catch {
          return new Response("Bad request", { status: 400 });
        }
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const since = new Date(Date.now() - 60_000).toISOString();
        const { count } = await supabaseAdmin
          .from("error_log")
          .select("id", { count: "exact", head: true })
          .gte("created_at", since);
        if ((count ?? 0) >= MAX_PER_MINUTE) {
          return new Response("Too many requests", { status: 429 });
        }

        const { error } = await supabaseAdmin.from("error_log").insert({
          message: parsed.message,
          stack: parsed.stack ?? null,
          path: parsed.path ?? null,
          user_agent: parsed.userAgent ?? request.headers.get("user-agent")?.slice(0, 300) ?? null,
        });
        if (error) return new Response("Insert failed", { status: 500 });
        return Response.json({ ok: true });
      },
    },
  },
});
