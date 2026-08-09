import type { ReactNode } from "react";
import { requireParent } from "@/lib/auth/guards";

export default async function ParentLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireParent();
  return children;
}
