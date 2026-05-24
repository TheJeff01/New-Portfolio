"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Menu, X } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useDataStore } from "@/app/lib/DataStore";

const navLinks = [
    { label: "Services", href: "#services" },
    { label: "About", href: "#about" },
    { label: "Projects", href: "#projects" },
];

export default function Navbar() {
    const { profile } = useDataStore();
    const { theme, toggleTheme } = useTheme();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handler, { passive: true });
        return () => window.removeEventListener("scroll", handler);
    }, []);

    const handleNavClick = (href: string) => {
        setMobileOpen(false);
        const el = document.querySelector(href);
        el?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? "glass border-b border-border py-3"
                : "bg-transparent py-5"
                }`}
        >
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-6">
                {/* Logo */}
                <motion.a
                    href="#"
                    className="relative text-xl font-bold tracking-tight text-text-primary"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <span className="gradient-text">Jeff</span>
                    <span>TheDev</span>
                    <span className="gradient-text">.</span>
                </motion.a>

                {/* Desktop Nav */}
                <div className="hidden items-center gap-1 md:flex">
                    {navLinks.map((link) => (
                        <button
                            key={link.href}
                            onClick={() => handleNavClick(link.href)}
                            className="relative rounded-lg px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
                        >
                            {link.label}
                        </button>
                    ))}
                    <a
                        href={`mailto:${profile.email}`}
                        className="relative rounded-lg px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
                    >
                        Contact
                    </a>

                    {/* Theme Toggle */}
                    <motion.button
                        onClick={toggleTheme}
                        className="ml-4 flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-bg-card text-text-secondary transition-colors hover:border-accent hover:text-accent"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="Toggle theme"
                    >
                        <AnimatePresence mode="wait">
                            {theme === "dark" ? (
                                <motion.div
                                    key="sun"
                                    initial={{ rotate: -90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: 90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Sun size={16} />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="moon"
                                    initial={{ rotate: 90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: -90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Moon size={16} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.button>
                </div>

                {/* Mobile Menu Button */}
                <div className="flex items-center gap-3 md:hidden">
                    <motion.button
                        onClick={toggleTheme}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-bg-card text-text-secondary"
                        whileTap={{ scale: 0.95 }}
                        aria-label="Toggle theme"
                    >
                        {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                    </motion.button>
                    <motion.button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-bg-card text-text-secondary"
                        whileTap={{ scale: 0.95 }}
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X size={16} /> : <Menu size={16} />}
                    </motion.button>
                </div>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="glass overflow-hidden border-b border-border md:hidden"
                    >
                        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4">
                            {navLinks.map((link) => (
                                <button
                                    key={link.href}
                                    onClick={() => handleNavClick(link.href)}
                                    className="rounded-lg px-4 py-3 text-left text-sm font-medium text-text-secondary transition-colors hover:bg-bg-card hover:text-text-primary"
                                >
                                    {link.label}
                                </button>
                            ))}
                            <a
                                href={`mailto:${profile.email}`}
                                onClick={() => setMobileOpen(false)}
                                className="rounded-lg px-4 py-3 text-left text-sm font-medium text-text-secondary transition-colors hover:bg-bg-card hover:text-text-primary block"
                            >
                                Contact
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}
