import { defineTool } from "@lovable.dev/mcp-js";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_services",
  title: "List clinic services",
  description: "List all available dental services at Saraci Dental Clinic with prices and durations.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    const sb = supabaseForUser(ctx);
    const { data, error } = await sb
      .from("service_catalog")
      .select("name, description, price_hint, duration_minutes")
      .eq("active", true)
      .order("name");
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data) }],
      structuredContent: { services: data },
    };
  },
});
