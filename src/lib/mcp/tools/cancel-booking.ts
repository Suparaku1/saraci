import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "cancel_booking",
  title: "Cancel an appointment",
  description: "Cancel an existing appointment by its booking code. Only the owner can cancel.",
  inputSchema: {
    bookingCode: z.string().min(3).describe("The 6-8 char booking code (e.g. AB12CD)."),
    reason: z.string().optional(),
  },
  annotations: { readOnlyHint: false, destructiveHint: true, openWorldHint: false },
  handler: async ({ bookingCode, reason }, ctx) => {
    if (!ctx.isAuthenticated())
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const sb = supabaseForUser(ctx);
    try {
      const { cancelBookingCore } = await import("@/lib/booking-core.server");
      const appt = await cancelBookingCore(sb, ctx.getUserId()!, {
        bookingCode,
        reason: reason ?? null,
      }, "mcp");
      return {
        content: [{ type: "text", text: `Cancelled ${appt.booking_code}` }],
        structuredContent: { ok: true, booking_code: appt.booking_code },
      };
    } catch (e) {
      return {
        content: [{ type: "text", text: e instanceof Error ? e.message : "Cancel failed" }],
        isError: true,
      };
    }
  },
});
