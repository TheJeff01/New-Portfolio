"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/lib/AuthProvider";
import { Lock, Mail, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";

export default function AdminLogin() {
    const router = useRouter();
    const { signIn, user, loading: authLoading } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // If already signed in, redirect
    if (!authLoading && user) {
        router.replace("/admin");
        return null;
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const { error: signInError } = await signIn(email, password);

        if (signInError) {
            setError(signInError);
            setLoading(false);
        } else {
            router.replace("/admin");
        }
    };

    if (authLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-bg-primary">
                <Loader2 size={24} className="animate-spin text-accent" />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-bg-primary px-4">
            {/* Background decorations */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-accent/5 blur-[120px]" />
                <div className="absolute -bottom-32 -right-32 h-[400px] w-[400px] rounded-full bg-accent/3 blur-[100px]" />
            </div>

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold text-text-primary">
                        <span className="gradient-text">Jeff</span>TheDev
                        <span className="gradient-text">.</span>
                    </h1>
                    <p className="mt-1 text-xs font-medium uppercase tracking-wider text-text-tertiary">
                        Admin Portal
                    </p>
                </div>

                {/* Login card */}
                <div className="rounded-2xl border border-border bg-bg-card p-8 shadow-xl shadow-black/5">
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-text-primary">Welcome back</h2>
                        <p className="mt-1 text-sm text-text-secondary">
                            Sign in to manage your portfolio content.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email */}
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-text-secondary">
                                Email
                            </label>
                            <div className="relative">
                                <Mail
                                    size={16}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary"
                                />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full rounded-xl border border-border bg-bg-secondary py-2.5 pl-10 pr-4 text-sm text-text-primary outline-none transition-colors placeholder:text-text-tertiary focus:border-accent"
                                    placeholder="you@example.com"
                                    required
                                    autoComplete="email"
                                    autoFocus
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-text-secondary">
                                Password
                            </label>
                            <div className="relative">
                                <Lock
                                    size={16}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary"
                                />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full rounded-xl border border-border bg-bg-secondary py-2.5 pl-10 pr-10 text-sm text-text-primary outline-none transition-colors placeholder:text-text-tertiary focus:border-accent"
                                    placeholder="••••••••"
                                    required
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary transition-colors hover:text-text-secondary"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Error message */}
                        {error && (
                            <div className="rounded-lg bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400">
                                {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-2.5 text-sm font-semibold text-text-inverse transition-all hover:bg-accent-hover disabled:opacity-50"
                        >
                            {loading ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight size={14} />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="mt-6 text-center text-xs text-text-tertiary">
                    This area is restricted to the site owner.
                </p>
            </div>
        </div>
    );
}
