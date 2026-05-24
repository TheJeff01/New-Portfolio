"use client";

import { useEffect, useRef } from "react";
import { Github, Linkedin, Twitter, Heart, Instagram, Youtube, Facebook } from "lucide-react";
import { gsap } from "@/app/hooks/useGsap";
import { useDataStore } from "@/app/lib/DataStore";

const socialIcons: Record<string, React.ElementType> = {
    github: Github,
    linkedin: Linkedin,
    twitter: Twitter,
    instagram: Instagram,
    youtube: Youtube,
    facebook: Facebook,
};

const footerNavLinks = [
    { label: "About", href: "#about" },
    { label: "Projects", href: "#projects" },
];

export default function Footer() {
    const { profile } = useDataStore();
    const footerRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (!footerRef.current) return;

        const ctx = gsap.context(() => {
            gsap.from(".footer-content", {
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: footerRef.current,
                    start: "top 95%",
                    toggleActions: "play none none reverse",
                },
            });
        }, footerRef);

        return () => ctx.revert();
    }, []);

    const handleClick = (href: string) => {
        const el = document.querySelector(href);
        el?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <footer ref={footerRef} className="border-t border-border bg-bg-secondary py-10">
            <div className="footer-content mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 sm:flex-row sm:justify-between">
                <div className="flex items-center gap-6">
                    <span className="text-sm font-bold text-text-primary">
                        <span className="gradient-text">Jeff</span>
                        <span>TheDev</span>
                        <span className="gradient-text">.</span>
                    </span>
                    <div className="hidden h-4 w-px bg-border sm:block" />
                    <div className="hidden gap-4 sm:flex">
                        {footerNavLinks.map((link) => (
                            <button
                                key={link.href}
                                onClick={() => handleClick(link.href)}
                                className="text-xs text-text-tertiary transition-colors hover:text-text-primary"
                            >
                                {link.label}
                            </button>
                        ))}
                        <a
                            href={`mailto:${profile.email}`}
                            className="text-xs text-text-tertiary transition-colors hover:text-text-primary"
                        >
                            Contact
                        </a>
                    </div>
                </div>
                <p className="flex items-center gap-1 text-xs text-text-tertiary">
                    © {new Date().getFullYear()} Jeffthedev_. Built with
                    <Heart size={10} className="text-accent" fill="currentColor" />
                </p>
                <div className="flex gap-2">
                    {profile.social_links.slice(0, 3).map((link) => {
                        const Icon = socialIcons[link.icon?.toLowerCase()] || Github;
                        return (
                            <a
                                key={link.name}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-text-tertiary transition-colors hover:text-accent"
                                aria-label={link.name}
                            >
                                <Icon size={14} />
                            </a>
                        );
                    })}
                </div>
            </div>
        </footer>
    );
}
