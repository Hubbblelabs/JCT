import { GroupsPageLayout } from "@/components/layout/GroupsPageLayout";
import { GroupsPageSchema } from "@/lib/validation";

// TEMPORARY verification route — delete after checking.
const data = GroupsPageSchema.parse({
  hero: {
    title: "Cells and Committees",
    subtitle:
      "The statutory and institutional bodies that govern academic, welfare, and administrative functions at JCT College of Engineering and Technology.",
  },
  intro: [],
  groups: [
    {
      name: "SC / ST Committee",
      category: "Statutory Committees",
      description:
        "The SC/ST cell of JCT College of Engineering and Technology was started in the year (2012-2013) with the purpose to empower the SC/ST students in the college. At present for the academic year (2023-2024) the college takes special interest in facilitating financial support to the students from these communities.",
      members: [
        { name: "Dr. MANOHARAN S", role: "Principal / Member", contact: "9443359438" },
        { name: "Dr. K. Geetha", role: "Member", contact: "9789650151" },
        { name: "Dr. G. Gnanavel", role: "Member", contact: "8015429613" },
        { name: "Mr. K. Rajkumar", role: "Member", contact: "9087300166" },
        { name: "Mr. K. Babu", role: "Member", contact: "9629230655" },
        { name: "Mrs. S. Revathi", role: "Member", contact: "9600787030" },
      ],
    },
    { name: "Anti-Ragging Committee", category: "Statutory Committees" },
    { name: "Governing Council", category: "Statutory Committees" },
    { name: "IQAC Committee", category: "Other Committees" },
    { name: "Science Club", category: "Other Committees" },
  ],
});

export default function SeedCheckPage() {
  return <GroupsPageLayout data={data} variant="committees" />;
}
