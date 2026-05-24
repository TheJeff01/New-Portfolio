"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/app/hooks/useGsap";

const tools = [
    "React", "Next.js", "TypeScript", "Javascript", "Tailwind CSS", "Figma",
    "Node.js", "Python", "Supabase", "Arduino",
    "PostgreSQL", "Git", "Framer Motion", "Firebase",
    "React Native", "TensorFlow",
];

export default function LogoStrip() {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!sectionRef.current) return;

        const ctx = gsap.context(() => {
            // Entrance: slide up + fade
            gsap.from(sectionRef.current, {
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 90%",
                    toggleActions: "play none none reverse",
                },
            });

            // Scrub-linked horizontal shift for the marquee speed boost
            gsap.to(".marquee-inner", {
                x: -100,
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 2,
                },
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative overflow-hidden border-y border-border bg-bg-secondary py-6"
        >
            {/* Fade edges */}
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-bg-secondary to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-bg-secondary to-transparent" />

            {/* Marquee */}
            <div className="marquee-inner flex animate-marquee gap-8">
                {[...tools, ...tools].map((tool, i) => (
                    <span
                        key={`${tool}-${i}`}
                        className="flex-shrink-0 text-sm font-medium text-text-tertiary/60 whitespace-nowrap transition-colors hover:text-accent"
                    >
                        {tool}
                    </span>
                ))}
            </div>
        </section>
    );
}
