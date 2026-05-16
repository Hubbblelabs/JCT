import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | JCT College of Arts & Science, Coimbatore",
  description:
    "Learn about JCT College of Arts & Science — offering B.Sc, B.Com, BBA programs in Coimbatore, established under the Shri Jagannath Educational Health and Charitable Trust.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
