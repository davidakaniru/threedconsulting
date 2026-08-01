import { redirect } from "next/navigation";

import { requireAuth } from "@/lib/auth/guards";
import { getRoleRedirect } from "@/lib/utils";

export default async function PortalIndexPage() {
  const user = await requireAuth();
  redirect(getRoleRedirect(user.role));
}
