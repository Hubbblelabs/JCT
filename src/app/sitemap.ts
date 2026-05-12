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
    "/institutions/arts-science/admissions",
    "/institutions/polytechnic",
    "/admissions",
    "/alumni",
    "/placements",
    "/placements/statistics",
    "/placements/recruiters",
    "/placements/internships",
    "/placements/career-development",
    "/placements/industry-mous",
    "/placements/alumni-stories",
    "/research",
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
    "/governance",
    "/quality",
    "/mandatory-disclosure",
    "/contact",
    "/about",
    "/careers",
    "/leadership",
    "/media",
    "/apply-now",
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
