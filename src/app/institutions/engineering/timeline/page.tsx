import type { Metadata } from "next";
import {
  ContentPage,
  contentPageMetadata,
} from "@/components/layout/ContentPageServer";

export const revalidate = 3600;

export default async function Page() {
  return <ContentPage slug="timeline" />;
}

export async function generateMetadata(): Promise<Metadata> {
  return contentPageMetadata("timeline");
}
