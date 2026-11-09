import { z } from "zod";

export const complaintUpdateSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["open", "in_progress", "resolved", "closed"]).optional(),
  priority: z.enum(["low", "normal", "high", "urgent"]).optional(),
  admin_notes: z.string().max(4000).optional(),
});