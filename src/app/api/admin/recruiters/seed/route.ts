import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Recruiter } from "@/lib/models";
import { requireRole, json, serverError } from "@/lib/api-helpers";
import { revalidateTargets } from "@/lib/revalidate";

const COMPANIES = [
  { name: "Abiba", logo: "/company-logos/abiba.webp" },
  {
    name: "Aditya Birla Group",
    logo: "/company-logos/aditya-birla-group.webp",
  },
  { name: "AIS India Glass", logo: "/company-logos/ais-india-glass.webp" },
  { name: "Alstom", logo: "/company-logos/alstom.webp" },
  { name: "Ashok Leyland", logo: "/company-logos/ashok-leyland.webp" },
  { name: "Caterpillar", logo: "/company-logos/caterpillar.webp" },
  { name: "Cognizant", logo: "/company-logos/cognizant.webp" },
  { name: "CPF", logo: "/company-logos/cpf.webp" },
  { name: "C.R.I. Pumps", logo: "/company-logos/cri-pumps.webp" },
  { name: "CSS Corp", logo: "/company-logos/css-crop.webp" },
  { name: "Face Prep", logo: "/company-logos/face-prep.webp" },
  { name: "Force Motors", logo: "/company-logos/force-motors.webp" },
  { name: "Genpact", logo: "/company-logos/genpact.webp" },
  { name: "Infosys", logo: "/company-logos/Infosys.webp" },
  { name: "Infoview", logo: "/company-logos/infoview.webp" },
  { name: "Ionix", logo: "/company-logos/ionix.webp" },
  { name: "LT", logo: "/company-logos/lt.webp" },
  { name: "Murugappa", logo: "/company-logos/murugappa.webp" },
  { name: "Niyata Infotech", logo: "/company-logos/niyata.webp" },
  { name: "Parle Agro", logo: "/company-logos/parle agro.webp" },
  { name: "Petrofac", logo: "/company-logos/petrofac.webp" },
  { name: "Poornam", logo: "/company-logos/poornam.webp" },
  { name: "Popcorn Apps", logo: "/company-logos/popcornapps.webp" },
  { name: "Sakava", logo: "/company-logos/sakava.webp" },
  { name: "Salzer", logo: "/company-logos/salzer.webp" },
  { name: "Sanmar", logo: "/company-logos/sanmar.webp" },
  { name: "Sharda", logo: "/company-logos/sharda.webp" },
  { name: "SPIC.NS", logo: "/company-logos/SPIC.NS.webp" },
  { name: "Tagros", logo: "/company-logos/tagros.webp" },
  { name: "TCS", logo: "/company-logos/tcs.webp" },
  { name: "Tech Mahindra", logo: "/company-logos/tech-mahindra.webp" },
  {
    name: "Thirumalai Chemicals",
    logo: "/company-logos/thirumalai-chemicals.webp",
  },
  { name: "Trika", logo: "/company-logos/trika.webp" },
  { name: "Trioticz", logo: "/company-logos/trioticz.webp" },
  { name: "Tudip", logo: "/company-logos/tudip.webp" },
  { name: "TVS", logo: "/company-logos/tvs.webp" },
  { name: "V-Guard", logo: "/company-logos/v-gaurd.webp" },
  { name: "Vermeer", logo: "/company-logos/vermeer.webp" },
  { name: "Windcare", logo: "/company-logos/windcare.webp" },
  { name: "Zoho", logo: "/company-logos/zoho.webp" },
];

export async function POST(req: NextRequest) {
  const { error } = await requireRole(req, "super_admin");
  if (error) return error;

  try {
    await connectDB();

    let seeded = 0;
    for (let i = 0; i < COMPANIES.length; i++) {
      const c = COMPANIES[i];
      await Recruiter.findOneAndUpdate(
        { name: c.name },
        { $setOnInsert: { ...c, sort_order: i } },
        { upsert: true },
      );
      seeded++;
    }

    revalidateTargets("home");
    return json({ message: `Seeded ${seeded} recruiters` });
  } catch (e) {
    console.error(e);
    return serverError();
  }
}
