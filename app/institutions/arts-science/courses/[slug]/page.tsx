import { notFound } from "next/navigation";
import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";
import { ugPrograms } from "../../data";
import { CheckCircle2, ArrowLeft, Clock, GraduationCap, FileCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import * as motion from "framer-motion/client";
import { Variants } from "framer-motion";

export function generateStaticParams() {
  return ugPrograms.map((course) => ({
    slug: course.slug,
  }));
}

// Fade in up animation variant
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = ugPrograms.find((c) => c.slug === slug);

  if (!course) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-stone-50 text-[#2C2C2C] overflow-x-hidden arts-science-theme font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[65vh] flex items-center bg-[#800020] pt-32 pb-20 overflow-hidden">
        {/* Subtle patterned background */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, #D4AF37 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        
        {/* Large subtle glow */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#D4AF37]/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-4xl"
          >
            <motion.div variants={fadeInUp}>
              <Link 
                href="/institutions/arts-science" 
                className="inline-flex items-center text-[#D4AF37] hover:text-white transition-colors mb-8 font-medium text-sm group"
              >
                <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" /> 
                Back to Arts & Science
              </Link>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <span className="inline-block py-1.5 px-4 mb-6 rounded-full bg-[#D4AF37] text-[#800020] text-xs font-bold tracking-widest uppercase shadow-sm">
                UG Program &bull; {course.duration}
              </span>
            </motion.div>

            <motion.h1 
              variants={fadeInUp}
              className="text-4xl md:text-5xl lg:text-7xl font-serif text-white mb-6 leading-[1.1]"
            >
              {course.name}
            </motion.h1>

            <motion.p 
              variants={fadeInUp}
              className="text-lg md:text-xl lg:text-2xl text-white/90 font-light leading-relaxed max-w-3xl"
            >
              {course.desc}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row gap-16 relative">
            
            {/* Left Content Column */}
            <div className="w-full lg:w-2/3">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-[2px] bg-[#D4AF37]"></div>
                  <h2 className="text-3xl md:text-4xl font-serif text-[#800020]">Program Overview</h2>
                </div>
                
                <div className="prose prose-stone prose-lg max-w-none text-[#2C2C2C] mb-16 space-y-6">
                  <p className="text-xl font-medium leading-relaxed text-[#2C2C2C]">
                    The {course.name} program at JCT College of Arts & Science is designed to equip 
                    students with both the theoretical foundations and the practical skills necessary for a successful 
                    career in the modern landscape.
                  </p>
                  <p className="leading-relaxed">
                    Our curriculum is frequently updated in consultation with industry experts to ensure 
                    that our graduates are immediately employable and ready to contribute meaningfully in 
                    their chosen fields. Through a combination of rigorous coursework, hands-on projects, 
                    and real-world experiences, this {course.duration.toLowerCase()} degree challenges students 
                    to think critically and solve complex problems.
                  </p>
                  <p className="leading-relaxed">
                    By fostering an environment of innovation and academic rigor, we prepare our students to become 
                    leaders and visionaries. You will learn from dedicated faculty who bring both academic excellence 
                    and industry experience into the classroom.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
              >
                <div className="bg-white p-8 md:p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-100 mb-16">
                  <h3 className="text-2xl font-serif text-[#800020] mb-8 font-bold">Key Learning Outcomes</h3>
                  <ul className="space-y-6">
                    {[
                      "Understand the core principles and underlying theories governing the field.",
                      "Develop strong analytical and problem-solving skills applied to practical scenarios.",
                      "Grasp modern tools, technologies, and methodologies relevant to the industry.",
                      "Build a professional portfolio through capstone projects and continuous assessment.",
                      "Enhance communication and leadership abilities essential for professional success."
                    ].map((item, i) => (
                      <motion.li 
                        key={i} 
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: i * 0.1 }}
                        className="flex gap-4 group"
                      >
                        <div className="mt-1 bg-[#D4AF37]/20 p-1 rounded-full group-hover:bg-[#D4AF37]/30 transition-colors">
                          <CheckCircle2 className="w-5 h-5 text-[#800020] shrink-0" />
                        </div>
                        <span className="text-[#2C2C2C] text-lg leading-relaxed">{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>

            {/* Right Sticky Sidebar Column */}
            <div className="w-full lg:w-1/3">
              <div className="sticky top-32">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="bg-white rounded-2xl shadow-[0_20px_40px_rgb(0,0,0,0.08)] border border-stone-100 overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="bg-[#800020] p-6 text-center">
                    <h3 className="font-serif text-2xl text-white">At a Glance</h3>
                  </div>
                  
                  {/* Card Body */}
                  <div className="p-8">
                    <div className="space-y-8 mb-10">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-stone-50 rounded-xl">
                          <Clock className="w-6 h-6 text-[#800020]" />
                        </div>
                        <div>
                          <span className="block text-sm uppercase tracking-wider text-stone-500 font-bold mb-1">Duration</span>
                          <span className="text-[#2C2C2C] font-semibold text-lg">{course.duration} (Full-Time)</span>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-stone-50 rounded-xl">
                          <GraduationCap className="w-6 h-6 text-[#800020]" />
                        </div>
                        <div>
                          <span className="block text-sm uppercase tracking-wider text-stone-500 font-bold mb-1">Affiliation</span>
                          <span className="text-[#2C2C2C] font-semibold text-lg">Bharathiar University</span>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-stone-50 rounded-xl">
                          <FileCheck className="w-6 h-6 text-[#800020]" />
                        </div>
                        <div>
                          <span className="block text-sm uppercase tracking-wider text-stone-500 font-bold mb-1">Eligibility</span>
                          <span className="text-[#2C2C2C] font-semibold text-lg">12th (HSC) pass in relevant stream</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      <Button className="w-full h-14 bg-[#D4AF37] text-[#800020] hover:bg-[#B6952F] font-bold text-lg rounded-xl shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5">
                        Apply Now
                      </Button>
                      <Button variant="outline" className="w-full h-14 border-2 border-stone-200 text-[#800020] hover:border-[#800020] hover:bg-stone-50 font-bold text-lg rounded-xl transition-all">
                        Download Syllabus
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-20 bg-[#D4AF37]">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-5xl font-serif text-[#800020] mb-6">
              Ready to Shape Your Future?
            </h2>
            <p className="text-xl text-[#800020]/90 mb-10 font-bold">
              Join the {course.name} program and take the first step towards a rewarding career.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button className="h-14 px-8 bg-[#800020] text-white hover:bg-[#5e0017] font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
                Start Your Application
              </Button>
              <Button className="h-14 px-8 bg-transparent border-2 border-[#800020] text-[#800020] hover:bg-[#800020]/10 font-bold text-lg rounded-xl transition-all">
                Contact Admissions
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
