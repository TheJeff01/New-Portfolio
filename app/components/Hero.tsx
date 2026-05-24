"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowDown, Sparkles, Code2, Palette } from "lucide-react";
import { gsap, ScrollTrigger } from "@/app/hooks/useGsap";
import { useDataStore } from "@/app/lib/DataStore";

const containerVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.12, delayChildren: 0.6 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
    },
};

export default function Hero() {
    const { profile } = useDataStore();
    const sectionRef = useRef<HTMLDivElement>(null);
    const headlineRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!sectionRef.current) return;

        const ctx = gsap.context(() => {
            const isMobile = window.innerWidth < 768;

            // Parallax image wrapper on scroll
            gsap.to(".hero-image-wrapper", {
                y: isMobile ? -20 : -40,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: isMobile ? 0.5 : 1,
                },
            });

            // Headline character split animation
            const chars = headlineRef.current?.querySelectorAll(".hero-char");
            if (chars) {
                gsap.from(chars, {
                    y: isMobile ? 40 : 120,
                    rotateX: isMobile ? 0 : -90,
                    opacity: 0,
                    duration: isMobile ? 0.8 : 1.2,
                    stagger: isMobile ? 0.015 : 0.03,
                    ease: isMobile ? "power2.out" : "power4.out",
                    delay: 0.2,
                });
            }

            // Parallax on scroll
            gsap.to(".hero-content", {
                y: isMobile ? -40 : -80,
                opacity: 0,
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: isMobile ? 0.5 : 1,
                },
            });

            // Large background orb scale on scroll
            if (!isMobile) {
                gsap.to(".hero-orb-1", {
                    scale: 2,
                    y: 100,
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top top",
                        end: "bottom top",
                        scrub: 1.5,
                    },
                });

                gsap.to(".hero-orb-2", {
                    scale: 1.5,
                    y: -80,
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top top",
                        end: "bottom top",
                        scrub: 1,
                    },
                });
            }
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const splitText = (text: string, extraClass: string = "") =>
        text.split("").map((char, i) => (
            <span
                key={i}
                className={`hero-char inline-block ${extraClass}`}
                style={{ perspective: "600px" }}
            >
                {char === " " ? "\u00A0" : char}
            </span>
        ));

    return (
        <section
            ref={sectionRef}
            className="relative flex min-h-screen items-center overflow-hidden"
        >
            {/* Huge background elements */}
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden transform-gpu">
                <div className="hero-orb-1 absolute -left-60 -top-60 h-[700px] w-[700px] rounded-full bg-accent/6 blur-3xl lg:blur-[150px] will-change-transform" />
                <div className="hero-orb-2 absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-accent/8 blur-3xl lg:blur-[120px] will-change-transform" />

                {/* Grid pattern */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `linear-gradient(var(--text-primary) 1px, transparent 1px),
              linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)`,
                        backgroundSize: "60px 60px",
                    }}
                />
            </div>

            {/* Absolute Profile Image */}
            <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                className="hero-image-wrapper pointer-events-none absolute bottom-0 right-[-40%] sm:right-[-10%] z-0 h-[60vh] sm:h-[80vh] lg:h-[90vh] lg:right-[-10%] xl:right-[-5%] 2xl:right-[5%] opacity-40 lg:opacity-100 will-change-transform"
                style={{ willChange: "transform, opacity" }}
            >
                <Image
                    src="/jeffthedev.png"
                    alt="Profile Portrait"
                    width={800}
                    height={1200}
                    className="h-full w-auto object-contain object-bottom drop-shadow-[0_20px_20px_rgba(0,0,0,0.5)] lg:drop-shadow-2xl grayscale-[20%] contrast-125"
                    priority
                />
            </motion.div>

            {/* Content Container */}
            <div className="hero-content relative z-10 mx-auto w-full max-w-7xl px-6 pt-32 pb-16 transform-gpu will-change-transform">

                {/* Text Content Block */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-3xl"
                    style={{ willChange: "transform, opacity" }}
                >
                    {/* Status badge */}
                    <motion.div variants={itemVariants}>
                        <span className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent-subtle px-4 py-1.5 text-xs font-medium text-accent">
                            <Sparkles size={12} />
                            Available for freelance work
                        </span>
                    </motion.div>

                    {/* Headline with character animation */}
                    <div ref={headlineRef} className="mt-6 flex flex-col gap-1">
                        <p className="text-lg text-text-secondary sm:text-xl mb-1">
                            {splitText("Designing Intuitive Interfaces,")}
                        </p>
                        <h1 className="text-5xl font-bold leading-[1.05] tracking-tight text-text-primary sm:text-6xl lg:text-7xl xl:text-8xl">
                            <span className="block">{splitText("Developing")}</span>
                            <span className="block">
                                {splitText("Seamless ")}
                                <span className="whitespace-nowrap">
                                    <span className="pr-1">
                                        {splitText('"Experiences"', "gradient-text")}
                                    </span>
                                    <span className="text-accent font-bold">.</span>
                                </span>
                            </span>
                        </h1>
                    </div>

                    {/* Role badges */}
                    <motion.div
                        variants={itemVariants}
                        className="mt-5 flex flex-wrap gap-3"
                    >
                        <span className="inline-flex items-center gap-2 rounded-xl border border-border bg-bg-card px-4 py-2 text-sm font-medium text-text-primary">
                            <Palette size={14} className="text-accent" />
                            Wordpress Developer
                        </span>
                        <span className="inline-flex items-center gap-2 rounded-xl border border-border bg-bg-card px-4 py-2 text-sm font-medium text-text-primary">
                            <Code2 size={14} className="text-accent" />
                            Full-Stack Developer
                        </span>
                    </motion.div>

                    {/* Subtitle */}
                    <motion.p
                        variants={itemVariants}
                        className="mt-6 max-w-lg text-base leading-relaxed text-text-secondary lg:text-lg whitespace-pre-line"
                    >
                        {profile.tagline || "Multi-disciplinary creative based in Nigeria — crafting pixel-perfect products from concept to deployment."}
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        variants={itemVariants}
                        className="mt-6 flex flex-wrap gap-3"
                    >
                        <button
                            onClick={() =>
                                document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" })
                            }
                            className="group inline-flex items-center gap-2 rounded-xl bg-accent px-7 py-3.5 text-sm font-semibold text-text-inverse transition-all hover:bg-accent-hover hover:shadow-lg hover:shadow-accent-glow"
                        >
                            View My Work
                            <ArrowDown size={14} className="transition-transform group-hover:translate-y-0.5" />
                        </button>
                        <button
                            onClick={() =>
                                document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })
                            }
                            className="inline-flex items-center gap-2 rounded-xl border border-border bg-bg-card px-7 py-3.5 text-sm font-semibold text-text-primary transition-all hover:border-accent/30 hover:bg-bg-card-hover"
                        >
                            Get in Touch
                        </button>
                    </motion.div>
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2"
            >
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="flex flex-col items-center gap-2"
                >
                    <span className="text-xs font-medium tracking-widest uppercase text-text-tertiary">
                        Scroll
                    </span>
                    <ArrowDown size={14} className="text-text-tertiary" />
                </motion.div>
            </motion.div>
        </section>
    );
}
