import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | JCT College of Engineering & Technology, Coimbatore",
  description:
    "Learn about JCT College of Engineering and Technology — an autonomous institution offering B.E., B.Tech, M.E., and Ph.D programs in Coimbatore, established under the Shri Jagannath Educational Health and Charitable Trust.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
