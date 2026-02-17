"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ListTodo, BarChart3, Users, Settings, LogOut, ShieldAlert } from "lucide-react";
import { signOut } from "@/lib/auth";
import { useRouter } from "next/navigation";

const navItems = [
    { href: "/admin/dashboard", label: "Command Center", icon: LayoutDashboard },
    { href: "/admin/issues", label: "Issue Management", icon: ListTodo },
    { href: "/admin/analytics", label: "City Analytics", icon: BarChart3 },
    { href: "/admin/field-agents", label: "Field Agents", icon: Users }, // Future
    { href: "/admin/settings", label: "Settings", icon: Settings }, // Future
];

export function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut();
        router.push("/login");
    };

    return (
        <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen sticky top-0 text-white">
            <div className="p-6 border-b border-slate-800 flex items-center gap-3">
                <div className="size-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white">
                    <ShieldAlert className="size-5" />
                </div>
                <span className="font-extrabold text-lg tracking-tight uppercase text-white">Nagar-Admin</span>
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
                                    ? "bg-indigo-600 text-white"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                }`}
                        >
                            <Icon className="size-5" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 rounded-lg hover:bg-red-900/10 w-full transition-colors"
                >
                    <LogOut className="size-5" />
                    Logout
                </button>
            </div>
        </aside>
    );
}
