"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Megaphone, Crosshair, Bell, User, LogOut, Home } from "lucide-react";
import { signOut } from "@/lib/auth";
import { useRouter } from "next/navigation";

const navItems = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/report-issue", label: "Report Issue", icon: Megaphone },
    { href: "/track", label: "Track Issues", icon: Crosshair },
    { href: "/notifications", label: "Notifications", icon: Bell },
    { href: "/profile", label: "Profile", icon: User },
];

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut();
        router.push("/login");
    };

    return (
        <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-screen sticky top-0">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
                <div className="size-8 bg-sky-500 rounded-lg flex items-center justify-center text-white">
                    <Home className="size-5" />
                </div>
                <span className="font-extrabold text-lg tracking-tight uppercase text-slate-900 dark:text-white">Nagar-Seva</span>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive
                                    ? "bg-sky-50 text-sky-600 dark:bg-sky-900/20 dark:text-sky-400"
                                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
                                }`}
                        >
                            <Icon className="size-5" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 w-full transition-colors"
                >
                    <LogOut className="size-5" />
                    Logout
                </button>
            </div>
        </aside>
    );
}
