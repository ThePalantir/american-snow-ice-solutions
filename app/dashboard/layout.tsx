import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { brandLogoPath } from "../components/BrandLogo";
import styles from "./dashboard.module.css";

export const metadata: Metadata = {
  title: "Owner dashboard",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export const dynamic = "force-dynamic";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.dashboard}>
      <header className={styles.topbar}>
        <div className={styles.topbarInner}>
          <div className={styles.brand}>
            <Image src={brandLogoPath} alt="" width={48} height={48} unoptimized />
            <span>American Snow &amp; Ice Solutions</span>
          </div>
          <Link className={styles.website} href="/" prefetch={false}>Public website <span aria-hidden="true">↗</span></Link>
        </div>
      </header>
      <main className={styles.content}>{children}</main>
    </div>
  );
}
