"use client";

import { Camera, MapPin, CheckCircle } from "lucide-react";

export function HowItWorks() {
    return (
        <section className="px-6 md:px-10 lg:px-40 py-24 bg-slate-50 dark:bg-slate-950">
            <div className="mx-auto max-w-[1280px] flex flex-col gap-16">
                <div className="flex flex-col gap-4 text-center items-center max-w-[800px] mx-auto">
                    <h2 className="text-sky-500 text-sm font-black uppercase tracking-[0.2em]">Our Process</h2>
                    <h1 className="text-slate-900 dark:text-white text-4xl md:text-5xl font-black leading-tight tracking-tight">
                        3 Simple Steps to a Better City
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-lg">
                        Our streamlined digital process ensures your grievances reach the right officials instantly, cutting through the red tape.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-0.5 border-t-2 border-dashed border-slate-300 dark:border-slate-700 -z-0"></div>

                    {/* Step 1 */}
                    <div className="relative z-10 flex flex-col items-center text-center gap-6 p-6 group">
                        <div className="size-20 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center text-sky-500 shadow-xl border border-slate-100 dark:border-slate-800 group-hover:bg-sky-500 group-hover:text-white transition-all duration-300">
                            <Camera className="size-10" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <h3 className="text-slate-900 dark:text-white text-xl font-bold">1. Report</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-base">Snap a photo, pinpoint the location via GPS, and submit in seconds.</p>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="relative z-10 flex flex-col items-center text-center gap-6 p-6 group">
                        <div className="size-20 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center text-sky-500 shadow-xl border border-slate-100 dark:border-slate-800 group-hover:bg-sky-500 group-hover:text-white transition-all duration-300">
                            <MapPin className="size-10" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <h3 className="text-slate-900 dark:text-white text-xl font-bold">2. Track</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-base">Monitor real-time status updates and direct communications from officials.</p>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="relative z-10 flex flex-col items-center text-center gap-6 p-6 group">
                        <div className="size-20 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center text-sky-500 shadow-xl border border-slate-100 dark:border-slate-800 group-hover:bg-sky-500 group-hover:text-white transition-all duration-300">
                            <CheckCircle className="size-10" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <h3 className="text-slate-900 dark:text-white text-xl font-bold">3. Resolve</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-base">Receive digital confirmation and photo evidence once the issue is fixed.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
