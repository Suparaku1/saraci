import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

// Kodi i ftesës ruhet si secret në server (STAFF_INVITE_CODE) — nuk shfaqet në kod
// dhe nuk ruhet në browser. Klienti mban vetëm një token të nënshkruar.
export const verifyStaffCode = createServerFn({ method: "POST" })
  .inputValidator((raw: unknown) => z.object({ code: z.string().min(1).max(32) }).parse(raw))
  .handler(async ({ data }) => {
    const { inviteCodeMatches, issueStaffToken } = await import("@/lib/staff-token.server");
    if (!inviteCodeMatches(data.code)) return { ok: false as const };
    return { ok: true as const, token: await issueStaffToken() };
  });

// Pas regjistrimit, klienti thërret këtë për të marrë rolin admin (me token).
export const claimStaffRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z.object({
      token: z.string().min(10).max(300),
      companyRole: z.string().min(2).max(80),
      fullName: z.string().min(2).max(120).optional(),
      phone: z.string().min(5).max(40).optional(),
    }).parse(raw),
  )
  .handler(async ({ data, context }) => {
    const { verifyStaffToken } = await import("@/lib/staff-token.server");
    if (!(await verifyStaffToken(data.token))) {
      throw new Error("Verifikimi i kodit ka skaduar. Provoni përsëri.");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const userId = context.userId;

    const { error: rErr } = await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: userId, role: "admin" } as never, { onConflict: "user_id,role" });
    if (rErr) throw new Error(rErr.message);

    const patch: Record<string, unknown> = { company_role: data.companyRole };
    if (data.fullName) patch.full_name = data.fullName;
    if (data.phone) patch.phone = data.phone;
    await supabaseAdmin.from("profiles").update(patch as never).eq("id", userId);

    await supabaseAdmin.from("audit_log").insert({
      user_id: userId,
      action: "staff.role_claimed",
      entity: "user_roles",
      entity_id: userId,
      payload: { company_role: data.companyRole },
    } as never);

    return { ok: true };
  });
