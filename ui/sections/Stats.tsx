"use client";

import { CheckCheck, Users, Clock, TrendingUp, Gauge } from "lucide-react";

export function Stats() {
    return (
        <section className="px-6 md:px-10 lg:px-40 py-16 bg-white dark:bg-slate-900/50">
            <div className="mx-auto max-w-[1280px]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="group flex flex-col gap-3 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:border-sky-500/50 transition-colors">
                        <div className="flex items-center justify-between">
                            <CheckCheck className="text-sky-500 size-8" />
                            <span className="text-green-600 dark:text-green-400 text-sm font-bold bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-md flex items-center gap-1">
                                <TrendingUp className="size-3" /> 12%
                            </span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider">Issues Resolved</p>
                        <p className="text-slate-900 dark:text-white text-4xl font-black tabular-nums">15,482+</p>
                    </div>
                    <div className="group flex flex-col gap-3 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:border-sky-500/50 transition-colors">
                        <div className="flex items-center justify-between">
                            <Users className="text-sky-500 size-8" />
                            <span className="text-green-600 dark:text-green-400 text-sm font-bold bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-md flex items-center gap-1">
                                <TrendingUp className="size-3" /> 5%
                            </span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider">Active Citizens</p>
                        <p className="text-slate-900 dark:text-white text-4xl font-black tabular-nums">52,100+</p>
                    </div>
                    <div className="group flex flex-col gap-3 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:border-sky-500/50 transition-colors">
                        <div className="flex items-center justify-between">
                            <Clock className="text-sky-500 size-8" />
                            <span className="text-sky-500 text-sm font-bold bg-sky-500/10 px-2 py-1 rounded-md flex items-center gap-1">
                                <Gauge className="size-3" /> Improved
                            </span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider">Avg. Resolution Time</p>
                        <p className="text-slate-900 dark:text-white text-4xl font-black tabular-nums">48 Hours</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
