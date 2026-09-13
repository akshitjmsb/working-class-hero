import Link from "next/link";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Target Companies | People Are Strange",
  description:
    "Company research, open roles, hiring contacts and reusable research framework.",
};
export default function TargetCompaniesPage() {
  return (
    <>
      <h1>Target companies</h1>
      <p>
        Company-first research: understand the business, explore the roles, and
        identify the people behind the teams.
      </p>
      <Link className="research-company" href="/target-companies/intact">
        <span className="research-meta">
          Priority 1 · Research checked September 13, 2026
        </span>
        <h2>Intact Financial Corporation</h2>
        <p>
          125 Montréal-listed postings, including roles with Montréal among
          several office options. Explore functions, job requirements, office
          locations, compensation, and evidence-backed hiring leads.
        </p>
        <span>Open Intact research →</span>
      </Link>
      <p>
        <Link href="/target-companies/framework">
          Reusable company research framework
        </Link>
      </p>
    </>
  );
}
