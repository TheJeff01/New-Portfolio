"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Home } from "lucide-react";

const containerVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.12, delayChildren: 0.2 },
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

export default function NotFound() {
    return (
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg-primary">
            {/* Background orbs */}
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
                <div className="absolute -left-60 -top-60 h-[600px] w-[600px] rounded-full bg-accent/6 blur-3xl lg:blur-[150px]" />
                <div className="absolute -right-40 bottom-0 h-[400px] w-[400px] rounded-full bg-accent/8 blur-3xl lg:blur-[120px]" />

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

            {/* Content */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 mx-auto flex max-w-2xl flex-col items-center px-6 text-center"
            >
                {/* 404 big number */}
                <motion.div variants={itemVariants} className="relative mb-6 select-none">
                    <span
                        className="text-[10rem] font-bold leading-none tracking-tighter gradient-text sm:text-[14rem]"
                        aria-hidden="true"
                    >
                        404
                    </span>
                    {/* Mirror reflection */}
                    <span
                        className="pointer-events-none absolute left-0 top-full w-full text-[10rem] font-bold leading-none tracking-tighter gradient-text sm:text-[14rem]"
                        style={{
                            transform: "scaleY(-1)",
                            opacity: 0.08,
                            maskImage: "linear-gradient(to bottom, black, transparent 80%)",
                            WebkitMaskImage: "linear-gradient(to bottom, black, transparent 80%)",
                        }}
                        aria-hidden="true"
                    >
                        404
                    </span>
                </motion.div>

                {/* Status badge */}
                <motion.div variants={itemVariants} className="mb-5">
                    <span className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent-subtle px-4 py-1.5 text-xs font-medium text-accent">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                        Page not found
                    </span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                    variants={itemVariants}
                    className="text-4xl font-bold leading-tight tracking-tight text-text-primary sm:text-5xl"
                >
                    Lost in the void
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    variants={itemVariants}
                    className="mt-4 max-w-md text-base leading-relaxed text-text-secondary"
                >
                    This page doesn&apos;t exist — or it was moved somewhere else. Either way, let&apos;s get you back on track.
                </motion.p>

                {/* CTAs */}
                <motion.div
                    variants={itemVariants}
                    className="mt-8 flex flex-wrap items-center justify-center gap-3"
                >
                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center gap-2 rounded-xl border border-border bg-bg-card px-7 py-3.5 text-sm font-semibold text-text-primary transition-all hover:border-accent/30 hover:bg-bg-card-hover"
                    >
                        <ArrowLeft size={14} />
                        Go Back
                    </button>
                    <Link
                        href="/"
                        className="group inline-flex items-center gap-2 rounded-xl bg-accent px-7 py-3.5 text-sm font-semibold text-text-inverse transition-all hover:bg-accent-hover hover:shadow-lg hover:shadow-accent-glow"
                    >
                        <Home size={14} />
                        Back to Home
                    </Link>
                </motion.div>
            </motion.div>
        </section>
    );
}
