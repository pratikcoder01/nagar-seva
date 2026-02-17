"use client";

import Link from "next/link";
import { Building2, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/ui/components/ui/button"; // Assuming shadcn or custom button

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md px-6 md:px-10 lg:px-40 py-3">
            <div className="mx-auto flex max-w-[1280px] items-center justify-between whitespace-nowrap">
                <Link href="/" className="flex items-center gap-3 text-sky-500">
                    <div className="size-8 flex items-center justify-center bg-sky-500 rounded-lg text-white">
                        <Building2 className="size-5" />
                    </div>
                    <h2 className="text-slate-900 dark:text-white text-xl font-extrabold leading-tight tracking-tight uppercase">
                        NAGAR-SEVA
                    </h2>
                </Link>

                <div className="hidden md:flex items-center gap-9">
                    <Link href="#" className="text-slate-600 dark:text-slate-300 text-sm font-semibold hover:text-sky-500 transition-colors">About</Link>
                    <Link href="#" className="text-slate-600 dark:text-slate-300 text-sm font-semibold hover:text-sky-500 transition-colors">Services</Link>
                    <Link href="#" className="text-slate-600 dark:text-slate-300 text-sm font-semibold hover:text-sky-500 transition-colors">Statistics</Link>
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/login" className="hidden sm:flex">
                        <button className="min-w-[120px] cursor-pointer items-center justify-center rounded-lg h-10 px-5 bg-sky-500 text-white text-sm font-bold shadow-lg shadow-sky-500/20 hover:bg-sky-600 transition-all">
                            Login/Register
                        </button>
                    </Link>
                    <div className="md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-slate-900 dark:text-white">
                            {isOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
            </div>
            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 p-4 flex flex-col gap-4">
                    <Link href="#" className="text-slate-600 dark:text-slate-300 text-sm font-semibold hover:text-sky-500 transition-colors">About</Link>
                    <Link href="#" className="text-slate-600 dark:text-slate-300 text-sm font-semibold hover:text-sky-500 transition-colors">Services</Link>
                    <Link href="#" className="text-slate-600 dark:text-slate-300 text-sm font-semibold hover:text-sky-500 transition-colors">Statistics</Link>
                    <Link href="/login" className="w-full">
                        <button className="w-full cursor-pointer items-center justify-center rounded-lg h-10 px-5 bg-sky-500 text-white text-sm font-bold shadow-lg shadow-sky-500/20 hover:bg-sky-600 transition-all">
                            Login/Register
                        </button>
                    </Link>
                </div>
            )}
        </header>
    );
}
