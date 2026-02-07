import { Navbar } from "@/app/components/Navbar";
import { Hero } from "@/app/components/Hero";
import { Stats } from "@/app/components/Stats";
import { About } from "@/app/components/About";
import { Departments } from "@/app/components/Departments";
import { Admissions } from "@/app/components/Admissions";
import { Placements } from "@/app/components/Placements";
import { Contact } from "@/app/components/Contact";
import { Footer } from "@/app/components/Footer";

import { Institutions } from "@/app/components/Institutions";
import { CampusLife } from "@/app/components/CampusLife";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <Hero />
      <Stats />
      <Institutions />
      <About />
      <Departments />
      <CampusLife />
      <Admissions />
      <Placements />
      <Contact />
      <Footer />
    </main>
  );
}
