"use client";

import Link from "next/link";
import { Verified, Megaphone, Crosshair, MapPin, CheckCircle2 } from "lucide-react";

export function Hero() {
    return (
        <section className="px-6 md:px-10 lg:px-40 py-12 md:py-20 bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900/50">
            <div className="mx-auto max-w-[1280px]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="flex flex-col gap-8 order-2 lg:order-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-500 border border-sky-500/20 w-fit">
                            <Verified className="size-4" />
                            <span className="text-xs font-bold uppercase tracking-wider">Official Civic Tech Platform</span>
                        </div>
                        <div className="flex flex-col gap-4">
                            <h1 className="text-slate-900 dark:text-white text-5xl md:text-6xl font-black leading-[1.1] tracking-tight">
                                Clean City, <br /><span className="text-sky-500">Proud City</span>
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl font-normal max-w-[540px] leading-relaxed">
                                Empowering citizens, transforming cities. Bridge the gap between local residents and municipal authorities for a smarter, cleaner tomorrow.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <Link href="/report-issue">
                                <button className="flex min-w-[180px] cursor-pointer items-center justify-center rounded-xl h-14 px-8 bg-sky-500 text-white text-base font-bold shadow-xl shadow-sky-500/30 hover:-translate-y-0.5 transition-all">
                                    <Megaphone className="mr-2 size-5" />
                                    <span>Report an Issue</span>
                                </button>
                            </Link>
                            <Link href="/track">
                                <button className="flex min-w-[180px] cursor-pointer items-center justify-center rounded-xl h-14 px-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-base font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                                    <Crosshair className="mr-2 size-5" />
                                    <span>Track Complaint</span>
                                </button>
                            </Link>
                        </div>
                    </div>
                    <div className="relative order-1 lg:order-2">
                        <div
                            className="w-full aspect-video md:aspect-[4/3] bg-center bg-no-repeat bg-cover rounded-2xl shadow-2xl overflow-hidden group"
                            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=2144&auto=format&fit=crop")' }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/20 to-transparent"></div>
                        </div>
                        {/* Floating Card Badge */}
                        <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 hidden md:flex items-center gap-4">
                            <div className="size-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">
                                <CheckCircle2 className="size-6" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-medium">Recently Resolved</p>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">Streetlight repair in Sector 4</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
