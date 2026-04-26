import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export default function MediaCenterPage() {
  return (
    <main className="bg-surface text-foreground min-h-screen">
      <Navbar />
      <PageHero title="Media Center" subtitle="News, Events, and Memories from JCT" />

      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <Breadcrumb items={[{ label: "Media Center" }]} />

        <div className="mt-12 space-y-20">
          {/* 1. Announcements & News */}
          <section className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <h2 className="font-serif text-3xl font-bold text-foreground border-b border-white/10 pb-4">Latest News</h2>
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col sm:flex-row gap-6 p-4 rounded-xl hover:bg-white/5 transition-colors">
                  <div className="w-full sm:w-48 aspect-video bg-white/10 rounded-lg shrink-0 flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">[News Image]</span>
                  </div>
                  <div>
                    <div className="text-gold text-xs font-bold mb-2">October {i + 10}, 2023</div>
                    <h3 className="font-bold text-lg mb-2 line-clamp-2">JCT Institutions hosts National Level Technical Symposium with over 1000 participants</h3>
                    <p className="text-muted-foreground text-sm line-clamp-2">A grand event focusing on AI, Machine Learning, and sustainable engineering practices was held at the main campus.</p>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-foreground border-b border-white/10 pb-4 mb-6">Announcements</h2>
              <div className="space-y-4">
                {[
                  "Admissions open for Academic Year 2024-25. Apply online now.",
                  "Semester examination timetable released for all UG & PG programs.",
                  "Campus placement drive by leading IT companies scheduled for next month.",
                  "Scholarship applications for the current semester are now being accepted."
                ].map((announcement, i) => (
                  <div key={i} className="bg-white/5 p-4 rounded-lg border-l-4 border-gold">
                    <p className="text-sm">{announcement}</p>
                    <span className="text-xs text-muted-foreground mt-2 block">Updated: 2 days ago</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 2. Gallery */}
          <section>
            <div className="flex justify-between items-end mb-6 border-b border-white/10 pb-4">
              <h2 className="font-serif text-3xl font-bold text-foreground">Photo Gallery</h2>
              <button className="text-gold text-sm font-medium hover:underline">View All Photos</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="aspect-square bg-white/5 rounded-xl flex items-center justify-center overflow-hidden relative group cursor-pointer">
                  <span className="text-xs text-muted-foreground">[Gallery Image {i}]</span>
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white font-medium text-sm">View Image</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 3. Videos */}
          <section>
            <h2 className="font-serif text-3xl font-bold text-foreground border-b border-white/10 pb-4 mb-6">Video Highlights</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'Campus Tour', desc: 'Explore the sprawling JCT campus and its state-of-the-art facilities.' },
                { title: 'Annual Day 2023', desc: 'Highlights from the grand Annual Day celebrations.' },
                { title: 'Alumni Testimonials', desc: 'Hear what our successful alumni have to say about their journey.' }
              ].map((vid, i) => (
                <div key={i} className="bg-surface border border-border rounded-xl overflow-hidden">
                  <div className="aspect-video bg-white/10 relative flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm cursor-pointer hover:scale-110 transition-transform">
                      <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-white border-b-[8px] border-b-transparent ml-1"></div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg">{vid.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{vid.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 4. Events Calendar */}
          <section>
            <h2 className="font-serif text-3xl font-bold text-foreground border-b border-white/10 pb-4 mb-6">Upcoming Events</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { date: '15', month: 'NOV', title: 'Tech Symposium', time: '09:00 AM' },
                { date: '22', month: 'NOV', title: 'Alumni Meet', time: '10:00 AM' },
                { date: '05', month: 'DEC', title: 'Sports Day', time: '08:30 AM' },
                { date: '12', month: 'DEC', title: 'Workshop on AI', time: '09:00 AM' }
              ].map((event, i) => (
                <div key={i} className="flex gap-4 p-4 border border-white/10 rounded-xl bg-white/5">
                  <div className="text-center shrink-0">
                    <div className="text-gold font-bold text-xs">{event.month}</div>
                    <div className="text-2xl font-bold">{event.date}</div>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">{event.title}</h3>
                    <div className="text-xs text-muted-foreground mt-1">🕒 {event.time}</div>
                    <div className="text-xs text-muted-foreground mt-1">📍 Main Campus</div>
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
