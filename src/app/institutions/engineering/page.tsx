import type { Metadata } from "next";
import EngineeringPage from "@/modules/engineering/EngineeringPage";

export const metadata: Metadata = {
  title: "Engineering | JCT College of Engineering & Technology, Coimbatore",
  description:
    "JCT College of Engineering & Technology offers AICTE-approved B.E./B.Tech programs in CSE, ECE, Mechanical, Civil, EEE & IT. Anna University affiliated. NBA accredited. 96% placement rate.",
  openGraph: {
    title: "Engineering | JCT College of Engineering & Technology, Coimbatore",
    description:
      "AICTE-approved B.E./B.Tech programs with industry-aligned curriculum. NBA accredited. 96% placement rate.",
    type: "website",
  },
};

export default function Page() {
  return <EngineeringPage />;
}
