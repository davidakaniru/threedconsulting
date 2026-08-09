import { createAdminClient } from "@/lib/supabase/admin";
import type { Json } from "@/types/database";
export async function writeAuditLog(input: {
  actorId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  metadata?: Json;
}) {
  const { error } = await createAdminClient()
    .from("audit_logs")
    .insert({
      actor_id: input.actorId ?? null,
      action: input.action,
      entity_type: input.entityType,
      entity_id: input.entityId ?? null,
      metadata: input.metadata ?? {},
    });
  if (error) console.error("Audit log write failed", error);
}
