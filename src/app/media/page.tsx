import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export default function MediaCenterPage() {
  return (
    <main className="bg-surface text-foreground min-h-screen">
      <Navbar />
      <PageHero
        title="Media Center"
        subtitle="News, Events, and Memories from JCT"
      />

      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <Breadcrumb items={[{ label: "Media Center" }]} />

        <div className="mt-12 space-y-20">
          {/* 1. Announcements & News */}
          <section className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <h2 className="text-foreground border-b border-white/10 pb-4 font-serif text-3xl font-bold">
                Latest News
              </h2>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex flex-col gap-6 rounded-xl p-4 transition-colors hover:bg-white/5 sm:flex-row"
                >
                  <div className="flex aspect-video w-full shrink-0 items-center justify-center rounded-lg bg-white/10 sm:w-48">
                    <span className="text-muted-foreground text-xs">
                      [News Image]
                    </span>
                  </div>
                  <div>
                    <div className="text-gold mb-2 text-xs font-bold">
                      October {i + 10}, 2023
                    </div>
                    <h3 className="mb-2 line-clamp-2 text-lg font-bold">
                      JCT Institutions hosts National Level Technical Symposium
                      with over 1000 participants
                    </h3>
                    <p className="text-muted-foreground line-clamp-2 text-sm">
                      A grand event focusing on AI, Machine Learning, and
                      sustainable engineering practices was held at the main
                      campus.
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <h2 className="text-foreground mb-6 border-b border-white/10 pb-4 font-serif text-2xl font-bold">
                Announcements
              </h2>
              <div className="space-y-4">
                {[
                  "Admissions open for Academic Year 2024-25. Apply online now.",
                  "Semester examination timetable released for all UG & PG programs.",
                  "Campus placement drive by leading IT companies scheduled for next month.",
                  "Scholarship applications for the current semester are now being accepted.",
                ].map((announcement, i) => (
                  <div
                    key={i}
                    className="border-gold rounded-lg border-l-4 bg-white/5 p-4"
                  >
                    <p className="text-sm">{announcement}</p>
                    <span className="text-muted-foreground mt-2 block text-xs">
                      Updated: 2 days ago
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 2. Gallery */}
          <section>
            <div className="mb-6 flex items-end justify-between border-b border-white/10 pb-4">
              <h2 className="text-foreground font-serif text-3xl font-bold">
                Photo Gallery
              </h2>
              <button className="text-gold text-sm font-medium hover:underline">
                View All Photos
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="group relative flex aspect-square cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-white/5"
                >
                  <span className="text-muted-foreground text-xs">
                    [Gallery Image {i}]
                  </span>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="text-sm font-medium text-white">
                      View Image
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 3. Videos */}
          <section>
            <h2 className="text-foreground mb-6 border-b border-white/10 pb-4 font-serif text-3xl font-bold">
              Video Highlights
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Campus Tour",
                  desc: "Explore the sprawling JCT campus and its state-of-the-art facilities.",
                },
                {
                  title: "Annual Day 2023",
                  desc: "Highlights from the grand Annual Day celebrations.",
                },
                {
                  title: "Alumni Testimonials",
                  desc: "Hear what our successful alumni have to say about their journey.",
                },
              ].map((vid, i) => (
                <div
                  key={i}
                  className="bg-surface border-border overflow-hidden rounded-xl border"
                >
                  <div className="relative flex aspect-video items-center justify-center bg-white/10">
                    <div className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-transform hover:scale-110">
                      <div className="ml-1 h-0 w-0 border-t-[8px] border-b-[8px] border-l-[12px] border-t-transparent border-b-transparent border-l-white"></div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold">{vid.title}</h3>
                    <p className="text-muted-foreground mt-1 text-sm">
                      {vid.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 4. Events Calendar */}
          <section>
            <h2 className="text-foreground mb-6 border-b border-white/10 pb-4 font-serif text-3xl font-bold">
              Upcoming Events
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
              {[
                {
                  date: "15",
                  month: "NOV",
                  title: "Tech Symposium",
                  time: "09:00 AM",
                },
                {
                  date: "22",
                  month: "NOV",
                  title: "Alumni Meet",
                  time: "10:00 AM",
                },
                {
                  date: "05",
                  month: "DEC",
                  title: "Sports Day",
                  time: "08:30 AM",
                },
                {
                  date: "12",
                  month: "DEC",
                  title: "Workshop on AI",
                  time: "09:00 AM",
                },
              ].map((event, i) => (
                <div
                  key={i}
                  className="flex gap-4 rounded-xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="shrink-0 text-center">
                    <div className="text-gold text-xs font-bold">
                      {event.month}
                    </div>
                    <div className="text-2xl font-bold">{event.date}</div>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">{event.title}</h3>
                    <div className="text-muted-foreground mt-1 text-xs">
                      🕒 {event.time}
                    </div>
                    <div className="text-muted-foreground mt-1 text-xs">
                      📍 Main Campus
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}
