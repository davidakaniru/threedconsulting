import type { ReactNode } from "react";
import { PortalShell } from "@/components/portal/portal-shell";
import { requireAuth } from "@/lib/auth/guards";
export default async function PortalLayout({ children }: { children: ReactNode }) { const user = await requireAuth(); return <PortalShell user={user}>{children}</PortalShell>; }
