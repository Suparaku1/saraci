import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

import { firstNameSchema, lastNameSchema, phoneSchema, emailSchema, serviceSchema } from "@/lib/booking-validation";

// Get available slots for a date range
export const getAvailability = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z.object({
      from: z.string(),
      to: z.string(),
      minHour: z.number().int().min(9).max(18).optional(),
    }).parse(raw),
  )
  .handler(async ({ data, context }) => {
    const { loadSlots } = await import("@/lib/slots.server");
    const slots = await loadSlots(context.supabase, data.from, data.to, data.minHour);
    return { slots };
  });

// Create booking
export const createBooking = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z.object({
      slotIso: z.string(),
      firstName: firstNameSchema,
      lastName: lastNameSchema,
      patientPhone: phoneSchema,
      patientEmail: emailSchema,
      service: serviceSchema,
      notes: z.string().optional(),
    }).parse(raw),
  )
  .handler(async ({ data, context }) => {
    const { createBookingCore } = await import("@/lib/booking-core.server");
    const appointment = await createBookingCore(context.supabase, context.userId, data, "web");
    return { appointment };
  });

// Cancel booking (with verification)
export const cancelBooking = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z.object({
      bookingCode: z.string().min(3),
      verify: z.string().min(3), // phone or email
      reason: z.string().optional(),
    }).parse(raw),
  )
  .handler(async ({ data, context }) => {
    const { cancelBookingCore } = await import("@/lib/booking-core.server");
    await cancelBookingCore(context.supabase, context.userId, data, "web");
    return { ok: true };
  });

// Reschedule
export const rescheduleBooking = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z.object({
      bookingCode: z.string(),
      verify: z.string(),
      newSlotIso: z.string(),
    }).parse(raw),
  )
  .handler(async ({ data, context }) => {
    const { rescheduleBookingCore } = await import("@/lib/booking-core.server");
    const { newAppointment } = await rescheduleBookingCore(context.supabase, context.userId, data, "web");
    return { newAppointment };
  });

export const listMyAppointments = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase.from("appointments")
      .select("*").eq("user_id", userId).order("slot_start", { ascending: false });
    if (error) throw new Error(error.message);
    return { appointments: data ?? [] };
  });

export const listServices = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const { data, error } = await supabase.from("service_catalog")
      .select("id, name, description, price_hint, duration_minutes")
      .eq("active", true)
      .order("name");
    if (error) throw new Error(error.message);
    return { services: data ?? [] };
  });
