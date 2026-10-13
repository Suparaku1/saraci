import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "create_booking",
  title: "Create an appointment",
  description:
    "Book a 1-hour appointment for the signed-in user. slotIso must be a whole-hour UTC ISO datetime within clinic hours (Mon-Sat 09:00-19:00 Europe/Tirane). All patient fields are required.",
  inputSchema: {
    slotIso: z.string().describe("UTC ISO datetime of the slot start."),
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    patientPhone: z.string().describe("Must start with 06 and be 10 digits"),
    patientEmail: z.string().describe("Valid email address"),
    service: z.string().min(3),
    notes: z.string().optional(),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async (input, ctx) => {
    if (!ctx.isAuthenticated())
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const sb = supabaseForUser(ctx);
    try {
      const { createBookingCore } = await import("@/lib/booking-core.server");
      const appt = await createBookingCore(sb, ctx.getUserId()!, {
        slotIso: input.slotIso,
        firstName: input.firstName,
        lastName: input.lastName,
        patientPhone: input.patientPhone,
        patientEmail: input.patientEmail,
        service: input.service,
        notes: input.notes ?? null,
      }, "mcp");
      return {
        content: [{ type: "text", text: `Booked. Code: ${appt.booking_code}` }],
        structuredContent: { appointment: appt },
      };
    } catch (e) {
      return {
        content: [{ type: "text", text: e instanceof Error ? e.message : "Booking failed" }],
        isError: true,
      };
    }
  },
});
