"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown, ArrowRight, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/app/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
    {
        name: "Institutions",
        href: "#institutions",
        children: [
            {
                name: "Engineering",
                href: "/institutions/engineering",
                description: "Technical depth & research exposure",
                logo: "/jct_engineering.png",
                hoverText: "group-hover/item:text-blue-700"
            },
            {
                name: "Arts & Science",
                href: "/institutions/arts-science",
                description: "Science, commerce & humanities",
                logo: "/jct_arts.png",
                hoverText: "group-hover/item:text-purple-700"
            },
            {
                name: "Polytechnic",
                href: "/institutions/polytechnic",
                description: "Skill-based diploma programs",
                logo: "/jct_polytechnic.png",
                hoverText: "group-hover/item:text-teal-700"
            },
        ],
    },
    { name: "About", href: "#about" },
    { name: "Placements", href: "#placements" },
    { name: "Campus Life", href: "#campus-life" },
    { name: "Contact", href: "#contact" },
];

export function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [mobileExpanded, setMobileExpanded] = useState<string | null>("Institutions");

    const isEngineering = pathname?.startsWith("/institutions/engineering");
    const isArts = pathname?.startsWith("/institutions/arts-science");
    const isPolytechnic = pathname?.startsWith("/institutions/polytechnic");

    const logoSrc = isEngineering || isArts || isPolytechnic ? "/jct_logo_blue.png" : "/jct_logo.png";
    const logoClassName = "h-12 md:h-12 lg:h-16 w-auto object-contain";

    const collegeName = isEngineering
        ? "College of Engineering and Technology"
        : isArts
            ? "College of Arts and Science"
            : isPolytechnic
                ? "Polytechnic College"
                : null;


    const logotextcolor1 = scrolled ? "#0b1f3a" : "#E6EDF7"
    const logotextcolor2 = scrolled ? "#1f3b5c" : "#E6EDF7"

    useEffect(() => {
        let rafId: number;
        const handleScroll = () => {
            if (window.scrollY > 20) {
                if (!scrolled) setScrolled(true);
            } else {
                if (scrolled) setScrolled(false);
            }
        };

        const onScroll = () => {
            cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(handleScroll);
        }

        window.addEventListener("scroll", onScroll, { passive: true });
        // Initial check
        handleScroll();
        return () => {
            window.removeEventListener("scroll", onScroll);
            cancelAnimationFrame(rafId);
        };
    }, [scrolled]);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <>
            <nav
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out border-b border-transparent",
                    scrolled
                        ? "bg-white/95 backdrop-blur-md py-1 border-stone-100 shadow-sm"
                        : "bg-transparent py-5"
                )}
            >
                <div className="container mx-auto px-4 md:px-6 3xl:px-8 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center z-50 relative">
                        <div className="origin-left transition-transform duration-300">
                            <Image
                                src={logoSrc}
                                alt="JCT Institutions Logo"
                                width={180}
                                height={64}
                                className={logoClassName}
                                priority
                            />
                        </div>
                        {collegeName && (
                            <div
                                style={{
                                    "--logo1": logotextcolor1,
                                    "--logo2": logotextcolor2,
                                }}
                                className="font-(family-name:--font-montserrat) leading-tight pl-2"
                            >
                                <span className="block font-extrabold text-[24px] tracking-[0.24em] text-(--logo1) transition-colors duration-300">
                                    JCT
                                </span>

                                <span className="block w-14 h-[2px] bg-(--logo1)/30 my-0.5 transition-colors duration-300" />

                                <span className="block font-semibold text-[16px] tracking-[0.05em] uppercase text-(--logo2) transition-colors duration-300">
                                    {collegeName}
                                </span>
                            </div>
                        )}

                    </Link>


                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-6 xl:gap-8 3xl:gap-10">
                        {navLinks.map((link) => (
                            <div
                                key={link.name}
                                className="relative group/nav"
                                onMouseEnter={() => link.children && setActiveDropdown(link.name)}
                                onMouseLeave={() => setActiveDropdown(null)}
                            >
                                <Link
                                    href={link.href}
                                    className={cn(
                                        "flex items-center gap-1.5 text-sm font-semibold transition-colors py-2",
                                        scrolled ? "text-stone-600 hover:text-primary" : "text-white/90 hover:text-white"
                                    )}
                                >
                                    {link.name}
                                    {link.children && (
                                        <ChevronDown size={14} className={cn("transition-transform duration-200", activeDropdown === link.name ? "rotate-180" : "")} />
                                    )}
                                </Link>

                                {/* Desktop Dropdown (Mega Menu Style) */}
                                {link.children && (
                                    <AnimatePresence>
                                        {activeDropdown === link.name && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 5, scale: 0.98 }}
                                                transition={{ duration: 0.2, ease: "easeOut" }}
                                                className="absolute top-full -left-4 pt-4 w-96"
                                            >
                                                <div className="bg-white rounded-2xl shadow-xl shadow-stone-200/50 border border-stone-100 overflow-hidden p-2 grid gap-1">
                                                    {link.children.map((child) => (
                                                        <Link
                                                            key={child.name}
                                                            href={child.href}
                                                            className="flex items-start gap-4 p-3 rounded-xl hover:bg-stone-50 transition-colors group/item"
                                                        >
                                                            <div className="mt-1 p-1 rounded-lg transition-colors shrink-0 h-10 w-10 flex items-center justify-center bg-white border border-stone-100">
                                                                <Image src={child.logo} alt={child.name} width={32} height={32} className="object-contain" />
                                                            </div>
                                                            <div>
                                                                <div className={cn(
                                                                    "text-sm font-bold text-stone-900 mb-1 transition-colors",
                                                                    child.hoverText
                                                                )}>
                                                                    {child.name}
                                                                </div>
                                                                <div className="text-xs text-stone-500 font-medium leading-relaxed">
                                                                    {child.description}
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Desktop Right Actions */}
                    <div className="hidden lg:flex items-center gap-3">
                        <Link
                            href="#admissions"
                            className={cn(
                                "text-sm font-semibold transition-colors hover:underline underline-offset-4",
                                scrolled ? "text-stone-600 hover:text-primary" : "text-white/90 hover:text-white"
                            )}
                        >
                            Admissions
                        </Link>
                        <Button
                            className="bg-accent text-primary hover:bg-accent/90 font-bold rounded-full px-6 h-11 transition-all shadow-lg shadow-accent/20 hover:scale-105 active:scale-95"
                        >
                            Apply Now <ArrowRight size={16} className="ml-2" />
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className={cn(
                            "lg:hidden p-2 transition-colors rounded-full z-50 hover:bg-white/10",
                            scrolled ? "text-primary hover:bg-stone-100" : "text-white"
                        )}
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle menu"
                    >
                        {isOpen ? <X size={24} className="text-stone-900" /> : <Menu size={24} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Sidebar (Right Side) */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Sidebar */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white shadow-2xl flex flex-col lg:hidden"
                        >
                            {/* Mobile Header */}
                            <div className="flex items-center justify-between p-6 border-b border-stone-100">
                                <div className="flex items-center gap-2">
                                    <Image
                                        src="/jct_logo.png"
                                        alt="Logo"
                                        width={36}
                                        height={36}
                                    />
                                    <div className="flex flex-col">
                                        <span className="font-serif font-bold text-lg text-primary leading-none">JCT</span>
                                        <span className="text-[10px] font-medium tracking-wider text-stone-500 uppercase">Institutions</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 -mr-2 hover:bg-stone-100 rounded-full transition-colors text-stone-500"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Mobile Links */}
                            <div className="flex-1 overflow-y-auto p-6">
                                <div className="space-y-1">
                                    {navLinks.map((link) => (
                                        <div key={link.name} className="border-b border-stone-100 last:border-0">
                                            {link.children ? (
                                                <div className="py-2">
                                                    <button
                                                        onClick={() => setMobileExpanded(mobileExpanded === link.name ? null : link.name)}
                                                        className="flex items-center justify-between w-full py-2 text-lg font-bold text-primary hover:text-accent transition-colors text-left group"
                                                    >
                                                        {link.name}
                                                        <ChevronDown
                                                            size={20}
                                                            className={cn(
                                                                "transition-transform duration-200 text-stone-400 group-hover:text-accent",
                                                                mobileExpanded === link.name ? "rotate-180" : ""
                                                            )}
                                                        />
                                                    </button>
                                                    <AnimatePresence>
                                                        {mobileExpanded === link.name && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: "auto", opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                className="overflow-hidden"
                                                            >
                                                                <div className="pl-2 pb-4 pt-2 grid gap-2">
                                                                    {link.children.map((child) => (
                                                                        <Link
                                                                            key={child.name}
                                                                            href={child.href}
                                                                            onClick={() => setIsOpen(false)}
                                                                            className="flex items-start gap-3 p-3 rounded-xl hover:bg-stone-50 transition-colors"
                                                                        >
                                                                            <div className="mt-0.5 h-6 w-6 relative shrink-0">
                                                                                <Image src={child.logo} alt={child.name} fill className="object-contain" />
                                                                            </div>
                                                                            <div>
                                                                                <div className="font-bold text-stone-800 text-sm">{child.name}</div>
                                                                                <div className="text-xs text-stone-500 mt-0.5 line-clamp-1">{child.description}</div>
                                                                            </div>
                                                                        </Link>
                                                                    ))}
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            ) : (
                                                <Link
                                                    href={link.href}
                                                    onClick={() => setIsOpen(false)}
                                                    className="flex items-center w-full py-4 text-lg font-bold text-primary hover:text-accent transition-colors"
                                                >
                                                    {link.name}
                                                </Link>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Mobile Footer */}
                            <div className="p-6 bg-stone-50 border-t border-stone-100 space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <Button variant="outline" className="w-full justify-center text-primary font-bold border-stone-200 bg-white">
                                        <Phone size={16} className="mr-2" /> Enquire
                                    </Button>
                                    <Button className="w-full justify-center bg-accent text-primary font-bold hover:bg-accent/90">
                                        Apply Now
                                    </Button>
                                </div>

                                <div className="grid grid-cols-3 gap-4 text-xs text-stone-500 text-center font-medium pt-2">
                                    <Link href="#" className="hover:text-primary">Admissions</Link>
                                    <Link href="#" className="hover:text-primary">Contact</Link>
                                    <Link href="#" className="hover:text-primary">Login</Link>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
