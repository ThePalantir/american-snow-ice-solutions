"use client";

import { usePathname } from "next/navigation";

export function PublicSiteOnly({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return pathname === "/dashboard" || pathname?.startsWith("/dashboard/") ? null : children;
}
