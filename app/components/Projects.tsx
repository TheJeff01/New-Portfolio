"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { gsap } from "@/app/hooks/useGsap";
import { useDataStore } from "@/app/lib/DataStore";
import type { Project } from "@/app/types";

const categories = ["All", "Wordpress", "Web Dev"];

function ProjectCard({ project }: { project: Project }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as const }}
        >
            <Link
                href={`/projects/${project.id}`}
                className="glow-border group relative flex flex-col overflow-hidden rounded-2xl bg-bg-card transition-transform duration-300 hover:-translate-y-2 cursor-pointer block"
            >
                {/* Header */}
                <div className={`relative flex h-40 items-center justify-center ${!project.banner_url ? `bg-gradient-to-br ${project.gradient}` : "bg-bg-secondary"}`}>
                    {project.banner_url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <Image
                            src={project.banner_url}
                            alt={`${project.title} Banner`}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    )}
                    {project.banner_url && <div className="absolute inset-0 bg-black/20 transition-opacity duration-300 group-hover:bg-black/40" />}
                    {!project.banner_url && <span className="text-5xl drop-shadow-lg transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6">{project.icon}</span>}
                    <span className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider z-10 ${project.status === "Completed"
                        ? "bg-emerald-500/20 text-emerald-100 backdrop-blur-sm"
                        : "bg-amber-500/20 text-amber-100 backdrop-blur-sm"
                        }`}>
                        {project.status}
                    </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                    <div className="mb-2 flex items-center gap-2">
                        <span className="rounded-md bg-accent-subtle px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent">
                            {project.category}
                        </span>
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-text-primary">{project.title}</h3>
                    <p className="mb-4 flex-1 text-sm leading-relaxed text-text-secondary line-clamp-2">{project.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                        {project.tech_stack.map((tech) => (
                            <span key={tech} className="rounded-md border border-border bg-bg-secondary px-2 py-0.5 text-[11px] font-medium text-text-tertiary">
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
                {/* View project indicator */}
                <div className="flex items-center justify-between border-t border-border px-5 py-3">
                    <span className="text-xs font-medium text-text-tertiary group-hover:text-accent transition-colors">View Project</span>
                    <ArrowUpRight size={14} className="text-text-tertiary transition-all group-hover:text-accent group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
            </Link>
        </motion.div>
    );
}

export default function Projects() {
    const { projects } = useDataStore();
    const [activeCategory, setActiveCategory] = useState<string>("All");
    const sectionRef = useRef<HTMLDivElement>(null);

    const filtered = activeCategory === "All"
        ? projects
        : projects.filter((p) => p.category === activeCategory);

    useEffect(() => {
        if (!sectionRef.current) return;

        const ctx = gsap.context(() => {
            // Section header entrance
            gsap.from(".projects-header", {
                x: -80,
                opacity: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 75%",
                    toggleActions: "play none none reverse",
                },
            });

            // Filter tabs entrance
            gsap.from(".projects-filters", {
                y: 30,
                opacity: 0,
                duration: 0.8,
                delay: 0.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 70%",
                    toggleActions: "play none none reverse",
                },
            });

            // Huge background text parallax
            gsap.to(".projects-bg-text", {
                x: 80,
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 2,
                },
            });

            // Background orb parallax
            gsap.to(".projects-orb", {
                y: -80,
                scale: 1.3,
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

    return (
        <section ref={sectionRef} id="projects" className="relative py-32 overflow-hidden">
            {/* Huge background text */}
            <div className="pointer-events-none absolute -left-[10%] top-1/2 -translate-y-1/2 projects-bg-text">
                <span
                    className="text-[14rem] font-black leading-none whitespace-nowrap text-text-primary/[0.02] lg:text-[20rem]"
                    style={{ WebkitTextStroke: "1px var(--border)" }}
                >
                    PROJECTS
                </span>
            </div>

            {/* Background orb */}
            <div className="pointer-events-none absolute inset-0">
                <div className="projects-orb absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/3 blur-[150px]" />
            </div>

            <div className="relative mx-auto max-w-7xl px-6">
                {/* Section header */}
                <div className="projects-header mb-12">
                    <span className="font-mono text-sm text-accent">02 —</span>
                    <h2 className="mt-2 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
                        Selected Projects
                    </h2>
                    <p className="mt-3 max-w-lg text-text-secondary">
                        A curated collection of work spanning design, development, mobile, and hardware.
                    </p>
                </div>

                {/* Filter tabs */}
                <div className="projects-filters mb-10 flex flex-wrap gap-2">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`relative rounded-xl px-4 py-2 text-sm font-medium transition-all ${activeCategory === cat
                                ? "text-text-inverse"
                                : "text-text-secondary hover:text-text-primary hover:bg-bg-card"
                                }`}
                        >
                            {activeCategory === cat && (
                                <motion.div
                                    layoutId="activeFilter"
                                    className="absolute inset-0 rounded-xl bg-accent"
                                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10">{cat}</span>
                        </button>
                    ))}
                </div>

                {/* Projects grid */}
                <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <AnimatePresence mode="popLayout">
                        {filtered.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>
        </section>
    );
}
