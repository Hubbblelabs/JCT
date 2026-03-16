import type { MetadataRoute } from "next";

const BASE_URL = "https://jct.ac.in";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "/",
    "/about",
    "/about/institution",
    "/about/vision-mission",
    "/about/chairmans-message",
    "/about/principals-message",
    "/about/history",
    "/about/leadership",
    "/about/organizational-structure",
    "/about/governing-council",
    "/about/strategic-plan",
    "/institutions",
    "/institutions/engineering",
    "/institutions/arts-science",
    "/institutions/polytechnic",
    "/admissions",
    "/admissions/why-jct",
    "/admissions/programs",
    "/admissions/eligibility",
    "/admissions/prospectus",
    "/admissions/seats",
    "/admissions/scholarships",
    "/admissions/fee-structure",
    "/admissions/process",
    "/admissions/apply",
    "/academics",
    "/academics/programs",
    "/academics/departments",
    "/academics/calendar",
    "/academics/regulations",
    "/academics/curriculum",
    "/academics/council",
    "/placements",
    "/placements/statistics",
    "/placements/recruiters",
    "/placements/internships",
    "/placements/career-development",
    "/placements/industry-mous",
    "/placements/alumni-stories",
    "/research",
    "/research/policy",
    "/research/rnd-cell",
    "/research/centres",
    "/research/publications",
    "/research/funded-projects",
    "/research/patents",
    "/research/innovation",
    "/research/workshops",
    "/campus-life",
    "/campus-life/facilities",
    "/campus-life/hostel",
    "/campus-life/library",
    "/campus-life/laboratories",
    "/campus-life/sports",
    "/campus-life/clubs",
    "/campus-life/activities",
    "/campus-life/gallery",
    "/campus-life/news-events",
    "/examinations",
    "/examinations/cell",
    "/examinations/passing-board",
    "/examinations/results",
    "/examinations/notifications",
    "/governance",
    "/governance/anti-ragging",
    "/governance/sc-st-cell",
    "/governance/icc",
    "/governance/grievance",
    "/governance/women-empowerment",
    "/governance/student-welfare",
    "/governance/equal-opportunity",
    "/quality",
    "/quality/accreditations",
    "/quality/iqac",
    "/quality/feedback",
    "/quality/awards",
    "/mandatory-disclosure",
    "/mandatory-disclosure/code-of-conduct",
    "/mandatory-disclosure/policies",
    "/mandatory-disclosure/ethics",
    "/mandatory-disclosure/hr-manual",
    "/mandatory-disclosure/survey",
    "/mandatory-disclosure/privacy",
    "/mandatory-disclosure/terms",
    "/mandatory-disclosure/disclaimer",
    "/contact",
  ];

  return staticRoutes.map((route) => {
    const isHome = route === "/";
    const isAdmissions = route.startsWith("/admissions");
    const isMainSection = route.split("/").length <= 2;

    let priority: number;
    if (isHome) {
      priority = 1;
    } else if (isAdmissions) {
      priority = 0.9;
    } else if (isMainSection) {
      priority = 0.8;
    } else {
      priority = 0.6;
    }

    return {
      url: `${BASE_URL}${route}`,
      lastModified: new Date(),
      changeFrequency: isHome ? "weekly" : "monthly",
      priority,
    };
  });
}
