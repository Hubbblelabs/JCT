"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/app/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
    { name: "About", href: "#about" },
    {
        name: "Institutions",
        href: "#institutions",
        children: [
            { name: "Engineering", href: "/institutions/engineering" },
            { name: "Arts & Science", href: "/institutions/arts-science" },
            { name: "Polytechnic", href: "/institutions/polytechnic" },
        ],
    },
    { name: "Admissions", href: "#admissions" },
    { name: "Contact", href: "#contact" },
];

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

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
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out border-b border-transparent",
                    scrolled
                        ? "bg-white/95 backdrop-blur-sm py-4 border-stone-200 shadow-sm"
                        : "bg-black/20 backdrop-blur-sm py-4"
                )}
            >
                <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group z-50">
                        <div className="transition-all duration-300">
                            <Image 
                                src="/jct-logo.svg" 
                                alt="JCT Institutions Logo" 
                                width={40} 
                                height={40}
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className={cn(
                                "text-lg font-serif font-bold tracking-tight leading-none",
                                isOpen ? "text-white" : scrolled ? "text-primary" : "text-white"
                            )}>
                                JCT Institutions
                            </span>
                            <span className={cn(
                                "text-[10px] font-medium tracking-[0.15em] uppercase mt-0.5",
                                isOpen ? "text-white/60" : scrolled ? "text-stone-500" : "text-white/80"
                            )}>
                                Est. 1998
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <div key={link.name} className="relative group/nav">
                                <Link
                                    href={link.href}
                                    className={cn(
                                        "text-sm font-medium transition-all duration-200 hover:text-accent",
                                        scrolled ? "text-stone-900 hover:text-primary" : "text-white/90 hover:text-white"
                                    )}
                                >
                                    {link.name}
                                </Link>
                                {link.children && (
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover/nav:opacity-100 group-hover/nav:visible transition-all duration-200 z-50">
                                        <div className="bg-white rounded-2xl shadow-xl border border-stone-100 py-3 px-2 min-w-60">
                                            {link.children.map((child) => (
                                                <Link
                                                    key={child.name}
                                                    href={child.href}
                                                    className="block px-4 py-3 text-sm text-stone-700 hover:text-primary hover:bg-stone-50 rounded-xl transition-colors font-medium"
                                                >
                                                    {child.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                        <Button
                            variant="default"
                            size="sm"
                            className="bg-accent text-primary hover:bg-accent/90 font-bold rounded-xl px-6 h-10 transition-transform active:scale-95 shadow-lg shadow-accent/20"
                        >
                            Apply Now
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className={cn(
                            "md:hidden p-2 transition-colors rounded-lg z-50 relative",
                            isOpen ? "text-white hover:bg-white/10" : scrolled ? "text-primary hover:bg-stone-100" : "text-white hover:bg-white/10"
                        )}
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label={isOpen ? "Close menu" : "Open menu"}
                    >
                        <AnimatePresence mode="wait">
                            {isOpen ? (
                                <motion.div
                                    key="close"
                                    initial={{ rotate: -90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: 90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <X size={28} />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="menu"
                                    initial={{ rotate: 90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: -90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Menu size={28} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </button>
                </div>
            </nav>

            {/* Mobile Menu - Full Screen Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-40 bg-primary md:hidden"
                    >
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "30px 30px" }} />

                        <div className="flex flex-col justify-center items-center h-full px-8">
                            <nav className="flex flex-col gap-6 text-center w-full max-w-sm">
                                {navLinks.map((link, index) => (
                                    <motion.div
                                        key={link.name}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 20 }}
                                        transition={{ delay: 0.1 + index * 0.08, duration: 0.4, ease: "easeOut" }}
                                    >
                                        <Link
                                            href={link.href}
                                            className="text-4xl font-serif text-white hover:text-accent transition-colors block py-2"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {link.name}
                                        </Link>
                                    </motion.div>
                                ))}
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    transition={{ delay: 0.1 + navLinks.length * 0.08, duration: 0.4, ease: "easeOut" }}
                                    className="mt-8"
                                >
                                    <Button
                                        className="bg-accent text-primary font-bold text-xl rounded-2xl px-12 py-7 hover:bg-accent/90 shadow-xl shadow-accent/30 w-full"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Apply Now
                                    </Button>
                                </motion.div>
                            </nav>

                            {/* Footer info in mobile menu */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="absolute bottom-8 left-0 right-0 text-center text-white/40 text-xs"
                            >
                                <p>© 2026 JCT Institute of Technology</p>
                                <p className="mt-1">Coimbatore, Tamil Nadu</p>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
