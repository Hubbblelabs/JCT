import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accreditations | JCT Institutions, Coimbatore",
  description:
    "Approvals and accreditations across JCT Institutions — recognitions from NAAC, NBA, AICTE and other statutory bodies for our Engineering, Arts & Science, and Polytechnic colleges.",
};

export default function AccreditationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
