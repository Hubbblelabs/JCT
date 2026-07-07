import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accreditations | JCT College of Arts & Science, Coimbatore",
  description:
    "Approvals and accreditations of JCT College of Arts & Science — NAAC and affiliating-university recognitions reflecting our academic standards.",
};

export default function ArtsScienceAccreditationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
