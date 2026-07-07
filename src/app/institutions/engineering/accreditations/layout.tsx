import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Accreditations | JCT College of Engineering & Technology, Coimbatore",
  description:
    "Approvals and accreditations of JCT College of Engineering & Technology — NAAC, NBA, AICTE and Anna University affiliations recognising our academic quality.",
};

export default function EngineeringAccreditationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
