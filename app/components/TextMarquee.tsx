"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/app/hooks/useGsap";

const topRow = [
    "PROBLEM SOLVER", "•", "DEVELOPER", "•", "CREATIVE", "•", "FREELANCER", "•",
    "PROBLEM SOLVER", "•", "DEVELOPER", "•", "CREATIVE", "•", "FREELANCER", "•",
];

const bottomRow = [
    "WORDPRESS", "✦", "FULL-STACK", "✦", "MOBILE", "✦", "✦",
    "WORDPRESS", "✦", "FULL-STACK", "✦", "MOBILE", "✦", "✦",
];

export default function TextMarquee() {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!sectionRef.current) return;

        const ctx = gsap.context(() => {
            // Scale up effect on scroll
            gsap.from(".marquee-container", {
                scale: 0.85,
                opacity: 0.3,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 90%",
                    end: "top 30%",
                    scrub: 1,
                },
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative overflow-hidden py-20"
        >
            <div className="marquee-container space-y-4">
                {/* Top row — scrolls left */}
                <div className="relative flex overflow-hidden">
                    <div className="flex animate-marquee-fast whitespace-nowrap">
                        {topRow.map((text, i) => (
                            <span
                                key={`t1-${i}`}
                                className={`mx-4 text-6xl font-black tracking-tighter sm:text-7xl lg:text-8xl xl:text-9xl ${text === "•"
                                        ? "text-accent"
                                        : "text-text-primary/[0.04] [-webkit-text-stroke:1px_var(--text-primary)]"
                                    }`}
                                style={
                                    text !== "•"
                                        ? { WebkitTextStroke: "1.5px var(--text-tertiary)" }
                                        : undefined
                                }
                            >
                                {text}
                            </span>
                        ))}
                    </div>
                    <div
                        className="flex animate-marquee-fast whitespace-nowrap"
                        aria-hidden
                    >
                        {topRow.map((text, i) => (
                            <span
                                key={`t2-${i}`}
                                className={`mx-4 text-6xl font-black tracking-tighter sm:text-7xl lg:text-8xl xl:text-9xl ${text === "•"
                                        ? "text-accent"
                                        : "text-text-primary/[0.04]"
                                    }`}
                                style={
                                    text !== "•"
                                        ? { WebkitTextStroke: "1.5px var(--text-tertiary)" }
                                        : undefined
                                }
                            >
                                {text}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Mirror / reflection row */}
                <div className="relative flex overflow-hidden opacity-[0.15] [transform:scaleY(-1)] blur-[2px]">
                    <div className="flex animate-marquee-fast whitespace-nowrap">
                        {topRow.map((text, i) => (
                            <span
                                key={`m1-${i}`}
                                className={`mx-4 text-6xl font-black tracking-tighter sm:text-7xl lg:text-8xl xl:text-9xl ${text === "•" ? "text-accent" : ""
                                    }`}
                                style={
                                    text !== "•"
                                        ? { WebkitTextStroke: "1.5px var(--text-tertiary)" }
                                        : undefined
                                }
                            >
                                {text}
                            </span>
                        ))}
                    </div>
                    <div
                        className="flex animate-marquee-fast whitespace-nowrap"
                        aria-hidden
                    >
                        {topRow.map((text, i) => (
                            <span
                                key={`m2-${i}`}
                                className={`mx-4 text-6xl font-black tracking-tighter sm:text-7xl lg:text-8xl xl:text-9xl ${text === "•" ? "text-accent" : ""
                                    }`}
                                style={
                                    text !== "•"
                                        ? { WebkitTextStroke: "1.5px var(--text-tertiary)" }
                                        : undefined
                                }
                            >
                                {text}
                            </span>
                        ))}
                    </div>
                    {/* Fade-out gradient for mirror */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-bg-primary via-bg-primary/80 to-transparent" />
                </div>

                {/* Bottom row — scrolls right */}
                <div className="relative flex overflow-hidden mt-6">
                    <div className="flex animate-marquee-reverse whitespace-nowrap">
                        {bottomRow.map((text, i) => (
                            <span
                                key={`b1-${i}`}
                                className={`mx-4 text-5xl font-black tracking-tighter sm:text-6xl lg:text-7xl ${text === "✦"
                                        ? "text-accent/60"
                                        : "text-accent/[0.08]"
                                    }`}
                                style={
                                    text !== "✦"
                                        ? { WebkitTextStroke: "1px var(--accent)" }
                                        : undefined
                                }
                            >
                                {text}
                            </span>
                        ))}
                    </div>
                    <div
                        className="flex animate-marquee-reverse whitespace-nowrap"
                        aria-hidden
                    >
                        {bottomRow.map((text, i) => (
                            <span
                                key={`b2-${i}`}
                                className={`mx-4 text-5xl font-black tracking-tighter sm:text-6xl lg:text-7xl ${text === "✦"
                                        ? "text-accent/60"
                                        : "text-accent/[0.08]"
                                    }`}
                                style={
                                    text !== "✦"
                                        ? { WebkitTextStroke: "1px var(--accent)" }
                                        : undefined
                                }
                            >
                                {text}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
