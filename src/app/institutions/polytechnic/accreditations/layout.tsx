import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accreditations | JCT Polytechnic College, Coimbatore",
  description:
    "Approvals and accreditations of JCT Polytechnic College — AICTE approval and DOTE affiliation recognising our diploma programmes.",
};

export default function PolytechnicAccreditationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
