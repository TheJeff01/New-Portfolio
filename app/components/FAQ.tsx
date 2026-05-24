"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { gsap } from "@/app/hooks/useGsap";

const faqs = [
    {
        question: "How long does a typical project take?",
        answer:
            "It depends on scope — a simple landing page can be ready in 3–5 days, while a full-featured web application usually takes 2–6 weeks. I'll give you a clear timeline during our discovery call so there are no surprises.",
    },
    {
        question: "What's your pricing like?",
        answer:
            "I work on both fixed-price and hourly arrangements. Fixed price is best for well-defined projects; hourly works better for ongoing work or projects where scope evolves. Reach out with your requirements and I'll send over a custom quote.",
    },
    {
        question: "Do you offer revisions?",
        answer:
            "Yes — every project includes a revision round to make sure the end result matches your vision. Larger projects include multiple checkpoints so feedback is captured early, not just at the end.",
    },
    {
        question: "What technologies do you work with?",
        answer:
            "My core stack is Next.js, React, TypeScript, and Tailwind CSS on the frontend, with Node.js, Python, and PostgreSQL on the backend. I also build WordPress sites with custom themes. If your project requires something outside this list, just ask — I'm always learning.",
    },
    {
        question: "Do you work with international clients?",
        answer:
            "Absolutely. I work fully remote and collaborate with clients across different time zones. Async communication via email and Slack works great, and I'm happy to schedule video calls during overlapping hours.",
    },
    {
        question: "What do you need from me to get started?",
        answer:
            "A brief description of what you want to build, any design references or brand assets you have, and a rough sense of your timeline and budget. We'll sort out the details together from there.",
    },
];

function FAQItem({
    faq,
    index,
    isOpen,
    onToggle,
}: {
    faq: (typeof faqs)[number];
    index: number;
    isOpen: boolean;
    onToggle: () => void;
}) {
    const bodyRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = bodyRef.current;
        if (!el) return;

        if (isOpen) {
            gsap.to(el, {
                height: "auto",
                opacity: 1,
                duration: 0.35,
                ease: "power2.out",
            });
        } else {
            gsap.to(el, {
                height: 0,
                opacity: 0,
                duration: 0.28,
                ease: "power2.in",
            });
        }
    }, [isOpen]);

    return (
        <div className={`faq-item glow-border group rounded-2xl bg-bg-card transition-colors duration-300 ${isOpen ? "bg-bg-card-hover" : ""}`}>
            <button
                onClick={onToggle}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                aria-expanded={isOpen}
            >
                <div className="flex items-center gap-4">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent/10 font-mono text-xs font-bold text-accent">
                        {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-sm font-semibold text-text-primary sm:text-base">
                        {faq.question}
                    </span>
                </div>
                <ChevronDown
                    size={18}
                    className={`shrink-0 text-accent transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                />
            </button>

            <div
                ref={bodyRef}
                style={{ height: 0, overflow: "hidden", opacity: 0 }}
            >
                <p className="px-6 pb-5 text-sm leading-relaxed text-text-secondary">
                    {faq.answer}
                </p>
            </div>
        </div>
    );
}

export default function FAQ() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    useEffect(() => {
        if (!sectionRef.current) return;

        const ctx = gsap.context(() => {
            gsap.from(".faq-header", {
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

            gsap.from(".faq-item", {
                y: 50,
                opacity: 0,
                duration: 0.7,
                stagger: 0.1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".faq-list",
                    start: "top 80%",
                    toggleActions: "play none none reverse",
                },
            });

            gsap.to(".faq-orb", {
                y: -70,
                x: -30,
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

    const toggle = (index: number) => {
        setOpenIndex((prev) => (prev === index ? null : index));
    };

    return (
        <section ref={sectionRef} id="faq" className="relative py-32 overflow-hidden">
            {/* Background decoration */}
            <div className="pointer-events-none absolute -left-40 top-1/3 faq-orb">
                <div className="h-[350px] w-[350px] rounded-full border border-accent/10 bg-accent/3 blur-sm" />
            </div>

            <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/3 blur-[120px]" />
            </div>

            <div className="relative mx-auto max-w-3xl px-6">
                {/* Section header */}
                <div className="faq-header mb-16 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                        <HelpCircle size={22} />
                    </div>
                    <span className="font-mono text-sm text-accent">FAQ</span>
                    <h2 className="mt-2 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
                        Common Questions,{" "}
                        <span className="gradient-text">Honest Answers</span>
                    </h2>
                    <p className="mx-auto mt-3 max-w-lg text-text-secondary">
                        Everything you might want to know before reaching out.
                    </p>
                </div>

                {/* FAQ list */}
                <div className="faq-list flex flex-col gap-3">
                    {faqs.map((faq, index) => (
                        <FAQItem
                            key={index}
                            faq={faq}
                            index={index}
                            isOpen={openIndex === index}
                            onToggle={() => toggle(index)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
