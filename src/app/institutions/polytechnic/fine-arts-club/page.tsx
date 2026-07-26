import type { Metadata } from "next";
import {
  ContentPage,
  contentPageMetadata,
} from "@/components/layout/ContentPageServer";

export const revalidate = 3600;

export default async function Page() {
  return <ContentPage slug="fine-arts-club" />;
}

export async function generateMetadata(): Promise<Metadata> {
  return contentPageMetadata("fine-arts-club");
}
