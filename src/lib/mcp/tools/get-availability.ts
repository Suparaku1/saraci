import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "get_availability",
  title: "Get available appointment slots",
  description:
    "Return available 1-hour slots for the given date range. Dates are ISO strings (UTC). Clinic hours: Mon-Sat 09:00-19:00 Europe/Tirane; closed Sunday.",
  inputSchema: {
    from: z.string().describe("Start ISO datetime (UTC)."),
    to: z.string().describe("End ISO datetime (UTC)."),
  },
  annotations: { readOnlyHint: true, openWorldHint: false },
  handler: async ({ from, to }, ctx) => {
    const sb = supabaseForUser(ctx);
    try {
      const { loadSlots } = await import("@/lib/slots.server");
      const slots = await loadSlots(sb, from, to);
      const free = slots.filter((s) => !s.taken);
      return {
        content: [{ type: "text", text: JSON.stringify(free) }],
        structuredContent: { slots: free },
      };
    } catch (e) {
      return {
        content: [{ type: "text", text: e instanceof Error ? e.message : "Failed" }],
        isError: true,
      };
    }
  },
});
