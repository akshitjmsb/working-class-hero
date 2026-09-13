import Link from "next/link";
import type { Viewport } from "next";
import "./research.css";
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};
export default function ResearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="research-shell">
      <header className="research-header">
        <Link href="/">People Are Strange</Link>
        <nav aria-label="Company research">
          <Link href="/target-companies">Target companies</Link>
          <Link href="/target-companies/intact">Intact</Link>
          <Link href="/target-companies/framework">Research framework</Link>
        </nav>
      </header>
      <main className="research-main">{children}</main>
    </div>
  );
}
