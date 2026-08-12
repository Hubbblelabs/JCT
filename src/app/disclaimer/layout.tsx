import { SiteChrome } from "@/components/layout/SiteChrome";

// Server-renders the CMS navbar/header/footer for this route, so it never
// paints the hardcoded fallback menu from src/data/all-navigations.ts first.
export default function DisclaimerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteChrome>{children}</SiteChrome>;
}
