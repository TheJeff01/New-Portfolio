"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/app/hooks/useGsap";

const quotes = [
    {
        text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
        author: "Martin Fowler",
        role: "Software Engineer & Author",
        accent: "from-emerald-500/10 to-teal-500/10",
        featured: true,
    },
    {
        text: "First, solve the problem. Then, write the code.",
        author: "John Johnson",
        role: "Programmer",
        accent: "from-violet-500/10 to-purple-500/10",
    },
    {
        text: "Simplicity is the soul of efficiency.",
        author: "Austin Freeman",
        role: "Author",
        accent: "from-blue-500/10 to-cyan-500/10",
    },
    {
        text: "Make it work, make it right, make it fast.",
        author: "Kent Beck",
        role: "Software Engineer",
        accent: "from-amber-500/10 to-orange-500/10",
    },
    {
        text: "The details are not the details. They make the design.",
        author: "Charles Eames",
        role: "Designer",
        accent: "from-pink-500/10 to-rose-500/10",
    },
    {
        text: "Design is not just what it looks like and feels like. Design is how it works.",
        author: "Steve Jobs",
        role: "Co-founder, Apple",
        accent: "from-indigo-500/10 to-blue-500/10",
    },
];

export default function Quotes() {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!sectionRef.current) return;

        const ctx = gsap.context(() => {
            gsap.from(".quotes-header", {
                y: 50,
                opacity: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 75%",
                    toggleActions: "play none none reverse",
                },
            });

            gsap.from(".quote-featured", {
                y: 60,
                opacity: 0,
                duration: 1.1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".quote-featured",
                    start: "top 80%",
                    toggleActions: "play none none reverse",
                },
            });

            gsap.from(".quote-card", {
                y: 80,
                opacity: 0,
                scale: 0.92,
                duration: 0.8,
                stagger: 0.12,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".quotes-grid",
                    start: "top 82%",
                    toggleActions: "play none none reverse",
                },
            });

            gsap.to(".quotes-bg-text", {
                x: -60,
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 2,
                },
            });

            gsap.to(".quotes-orb", {
                y: -100,
                scale: 1.2,
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1.5,
                },
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const featured = quotes.find((q) => q.featured)!;
    const rest = quotes.filter((q) => !q.featured);

    return (
        <section ref={sectionRef} id="quotes" className="relative py-32 overflow-hidden">
            {/* Background parallax text */}
            <div className="pointer-events-none absolute -right-[5%] top-1/2 -translate-y-1/2 quotes-bg-text">
                <span
                    className="text-[12rem] font-black leading-none whitespace-nowrap text-text-primary/[0.02] lg:text-[18rem]"
                    style={{ WebkitTextStroke: "1px var(--border)" }}
                >
                    QUOTES
                </span>
            </div>

            {/* Background orb */}
            <div className="pointer-events-none absolute inset-0">
                <div className="quotes-orb absolute right-1/4 top-1/3 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-accent/[0.04] blur-[140px]" />
            </div>

            <div className="relative mx-auto max-w-7xl px-6">
                {/* Header */}
                <div className="quotes-header mb-16 text-center">
                    <span className="font-mono text-sm text-accent">Words I Live By</span>
                    <h2 className="mt-2 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
                        Thoughts That Shape
                        <br />
                        <span className="gradient-text">How I Build</span>
                    </h2>
                    <p className="mx-auto mt-3 max-w-lg text-text-secondary">
                        A collection of ideas that guide how I think about code, design, and craft.
                    </p>
                </div>

                {/* Featured quote */}
                <div className="quote-featured glow-border group relative mb-6 overflow-hidden rounded-2xl bg-bg-card p-10 text-center">
                    <div className={`absolute inset-0 bg-gradient-to-br ${featured.accent} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
                    <div className="relative">
                        <div className="mb-6 flex justify-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                                <span className="text-2xl font-black text-accent leading-none">&ldquo;</span>
                            </div>
                        </div>
                        <p className="mx-auto mb-6 max-w-2xl text-xl font-medium leading-relaxed text-text-primary sm:text-2xl">
                            {featured.text}
                        </p>
                        <div className="inline-flex flex-col items-center gap-0.5">
                            <span className="text-sm font-semibold text-accent">{featured.author}</span>
                            <span className="text-xs text-text-tertiary">{featured.role}</span>
                        </div>
                    </div>
                </div>

                {/* Grid of smaller quotes */}
                <div className="quotes-grid grid gap-5 sm:grid-cols-2 lg:grid-cols-3" style={{ perspective: "1200px" }}>
                    {rest.map((quote) => (
                        <div
                            key={quote.author}
                            className="quote-card glow-border group relative overflow-hidden rounded-2xl bg-bg-card p-7 transition-transform duration-300 hover:-translate-y-2"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${quote.accent} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
                            <div className="relative flex h-full flex-col">
                                <span className="mb-4 text-4xl font-black leading-none text-accent/20 select-none">&ldquo;</span>
                                <p className="flex-1 text-sm leading-relaxed text-text-secondary">
                                    {quote.text}
                                </p>
                                <div className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent shrink-0">
                                        {quote.author.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-text-primary">{quote.author}</p>
                                        <p className="text-xs text-text-tertiary">{quote.role}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
