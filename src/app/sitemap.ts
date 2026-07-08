import type { MetadataRoute } from "next";

const BASE_URL = "https://jct.ac.in";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "/",
    "/about-us",
    "/campus-life",
    "/events",
    "/accreditations",
    "/institutions/engineering",
    "/institutions/engineering/about",
    "/institutions/engineering/courses",
    "/institutions/engineering/coe",
    "/institutions/engineering/accreditations",
    "/institutions/engineering/placements",
    "/institutions/arts-science",
    "/institutions/arts-science/about",
    "/institutions/arts-science/courses",
    "/institutions/arts-science/accreditations",
    "/institutions/arts-science/placements",
    "/institutions/polytechnic",
    "/institutions/polytechnic/about",
    "/institutions/polytechnic/courses",
    "/institutions/polytechnic/accreditations",
    "/institutions/polytechnic/placements",
  ];

  return staticRoutes.map((route) => {
    const isHome = route === "/";
    const isMainSection = route.split("/").length <= 2;

    let priority: number;
    if (isHome) {
      priority = 1;
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
