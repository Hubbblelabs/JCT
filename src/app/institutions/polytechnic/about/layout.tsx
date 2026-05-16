import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | JCT Polytechnic College, Coimbatore",
  description:
    "Learn about JCT Polytechnic College — offering AICTE-approved diploma programs in Coimbatore, established under the Shri Jagannath Educational Health and Charitable Trust.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
