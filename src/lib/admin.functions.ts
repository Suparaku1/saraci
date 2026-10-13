import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

// Every admin write goes through here: the role is verified on the server,
// never inferred from the browser.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function assertAdmin(supabase: any, userId: string) {
  const { data } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (!data) throw new Error("Vetëm administratorët mund të kryejnë këtë veprim.");
  return true;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function audit(supabase: any, userId: string, action: string, entity: string, entityId: string | null, payload: Record<string, unknown> = {}) {
  await supabase.from("audit_log").insert({ user_id: userId, action, entity, entity_id: entityId, payload });
}

export const adminUpdateAppointmentStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z.object({
      id: z.string().uuid(),
      status: z.enum(["booked", "cancelled", "completed", "no_show", "rescheduled"]),
    }).parse(raw),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);
    const { error } = await supabase.from("appointments").update({ status: data.status }).eq("id", data.id);
    if (error) throw new Error(error.message);
    await audit(supabase, userId, "admin.appointment.status", "appointment", data.id, { status: data.status });
    return { ok: true };
  });

export const adminUpdateComplaint = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z.object({
      id: z.string().uuid(),
      status: z.string().min(2).optional(),
      resolution: z.string().max(4000).optional(),
    }).parse(raw),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);
    const patch: { status?: string; resolution?: string } = {};
    if (data.status !== undefined) patch.status = data.status;
    if (data.resolution !== undefined) patch.resolution = data.resolution;
    const { error } = await supabase.from("complaints").update(patch as never).eq("id", data.id);
    if (error) throw new Error(error.message);
    await audit(supabase, userId, "admin.complaint.update", "complaint", data.id, patch);
    return { ok: true };
  });

export const adminSaveSetting = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z.object({ key: z.string().min(1), value: z.string().max(8000) }).parse(raw),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);
    const { error } = await supabase.from("clinic_settings").update({ value: data.value }).eq("key", data.key);
    if (error) throw new Error(error.message);
    await audit(supabase, userId, "admin.setting.update", "clinic_settings", null, { key: data.key });
    return { ok: true };
  });

export const adminCreateService = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z.object({
      name: z.string().min(2),
      price_hint: z.string().max(120).optional().nullable(),
      duration_minutes: z.number().int().min(15).max(480),
      description: z.string().max(2000).optional().nullable(),
    }).parse(raw),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);
    const { data: row, error } = await supabase.from("service_catalog").insert({
      name: data.name.trim(),
      price_hint: data.price_hint || null,
      duration_minutes: data.duration_minutes,
      description: data.description || null,
      active: true,
    }).select().single();
    if (error) throw new Error(error.message);
    await audit(supabase, userId, "admin.service.create", "service_catalog", row.id, { name: row.name });
    return { service: row };
  });

export const adminUpdateService = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z.object({
      id: z.string().uuid(),
      name: z.string().min(2).optional(),
      price_hint: z.string().max(120).optional().nullable(),
      duration_minutes: z.number().int().min(15).max(480).optional(),
      description: z.string().max(2000).optional().nullable(),
      active: z.boolean().optional(),
    }).parse(raw),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);
    const { id, ...patch } = data;
    const clean = Object.fromEntries(Object.entries(patch).filter(([, v]) => v !== undefined));
    const { error } = await supabase.from("service_catalog").update(clean as never).eq("id", id);
    if (error) throw new Error(error.message);
    await audit(supabase, userId, "admin.service.update", "service_catalog", id, clean);
    return { ok: true };
  });

export const adminDeleteService = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => z.object({ id: z.string().uuid() }).parse(raw))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);
    const { error } = await supabase.from("service_catalog").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    await audit(supabase, userId, "admin.service.delete", "service_catalog", data.id, {});
    return { ok: true };
  });
