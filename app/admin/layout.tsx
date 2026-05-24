"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/app/lib/AuthProvider";
import {
    LayoutDashboard,
    FolderKanban,
    Video,
    Instagram,
    FileText,
    MessageSquareQuote,
    User,
    ChevronLeft,
    ChevronRight,
    ArrowLeft,
    LogOut,
    Loader2,
} from "lucide-react";

const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Projects", href: "/admin/projects", icon: FolderKanban },
    { label: "Videos", href: "/admin/videos", icon: Video },
    { label: "Instagram", href: "/admin/instagram", icon: Instagram },
    { label: "Blog", href: "/admin/blog", icon: FileText },
    { label: "Testimonials", href: "/admin/testimonials", icon: MessageSquareQuote },
    { label: "Profile", href: "/admin/profile", icon: User },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, loading, signOut } = useAuth();
    const [collapsed, setCollapsed] = useState(false);

    // Don't apply the admin layout to the login page
    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    // Show loading while checking auth
    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-bg-primary">
                <Loader2 size={24} className="animate-spin text-accent" />
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!user) {
        router.replace("/admin/login");
        return (
            <div className="flex min-h-screen items-center justify-center bg-bg-primary">
                <Loader2 size={24} className="animate-spin text-accent" />
            </div>
        );
    }

    const handleSignOut = async () => {
        await signOut();
        router.replace("/admin/login");
    };

    return (
        <div className="flex min-h-screen bg-bg-primary">
            {/* Sidebar */}
            <aside
                className={`sticky top-0 flex h-screen flex-col border-r border-border bg-bg-card transition-all duration-300 ${collapsed ? "w-16" : "w-64"
                    }`}
            >
                {/* Logo */}
                <div className="flex items-center justify-between border-b border-border p-4">
                    {!collapsed && (
                        <div>
                            <div className="text-base font-bold text-text-primary">
                                <span className="gradient-text">Jeff</span>
                                <span>TheDev</span>
                                <span className="gradient-text">.</span>
                            </div>
                            <p className="text-[10px] font-medium uppercase tracking-wider text-text-tertiary">
                                Admin Portal
                            </p>
                        </div>
                    )}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-text-tertiary transition-colors hover:bg-bg-secondary hover:text-text-primary"
                    >
                        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                    </button>
                </div>

                {/* Nav Items */}
                <nav className="flex-1 overflow-y-auto p-2">
                    <div className="flex flex-col gap-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${isActive
                                        ? "bg-accent/10 text-accent"
                                        : "text-text-secondary hover:bg-bg-secondary hover:text-text-primary"
                                        }`}
                                    title={collapsed ? item.label : undefined}
                                >
                                    <item.icon size={18} className={isActive ? "text-accent" : ""} />
                                    {!collapsed && <span>{item.label}</span>}
                                    {isActive && !collapsed && (
                                        <div className="ml-auto h-1.5 w-1.5 rounded-full bg-accent" />
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                {/* Bottom section */}
                <div className="border-t border-border p-2 space-y-1">
                    {/* Back to site */}
                    <Link
                        href="/"
                        className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-text-tertiary transition-all hover:bg-bg-secondary hover:text-text-primary"
                    >
                        <ArrowLeft size={16} />
                        {!collapsed && <span>Back to Site</span>}
                    </Link>

                    {/* Logout */}
                    <button
                        onClick={handleSignOut}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-red-400/70 transition-all hover:bg-red-500/10 hover:text-red-400"
                        title={collapsed ? "Sign out" : undefined}
                    >
                        <LogOut size={16} />
                        {!collapsed && <span>Sign Out</span>}
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 overflow-y-auto">
                <div className="mx-auto max-w-5xl px-6 py-8 lg:px-10">
                    {children}
                </div>
            </main>
        </div>
    );
}
