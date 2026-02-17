import { Droplets, Lightbulb, Trash2, Clock, MessageSquare, CheckCircle2 } from "lucide-react";

export function RecentComplaints() {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Recent Complaints</h3>
                <a className="text-sky-500 text-sm font-semibold hover:underline" href="#">View All</a>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {/* Item 1 */}
                <div className="p-6 flex gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="flex flex-col items-center">
                        <div className="size-10 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center">
                            <Droplets className="size-5" />
                        </div>
                        <div className="w-px h-full bg-slate-200 dark:bg-slate-700 my-2"></div>
                    </div>
                    <div className="flex-1">
                        <div className="flex flex-wrap justify-between items-start gap-2 mb-1">
                            <h5 className="font-bold text-slate-900 dark:text-white">Water Pipeline Leakage</h5>
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20">In Progress</span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Reported at 12th Main Rd, Indiranagar. Field engineer assigned.</p>
                        <div className="flex items-center gap-4 text-xs text-slate-400">
                            <span className="flex items-center gap-1"><Clock className="size-3" /> 2 hours ago</span>
                            <span className="flex items-center gap-1"><MessageSquare className="size-3" /> 3 Comments</span>
                        </div>
                    </div>
                </div>
                {/* Item 2 */}
                <div className="p-6 flex gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="flex flex-col items-center">
                        <div className="size-10 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center">
                            <Lightbulb className="size-5" />
                        </div>
                        <div className="w-px h-full bg-slate-200 dark:bg-slate-700 my-2"></div>
                    </div>
                    <div className="flex-1">
                        <div className="flex flex-wrap justify-between items-start gap-2 mb-1">
                            <h5 className="font-bold text-slate-900 dark:text-white">Street Light Not Working</h5>
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-500 border border-red-500/20">Pending</span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Entire block near Park Lane is in darkness for 3 nights.</p>
                        <div className="flex items-center gap-4 text-xs text-slate-400">
                            <span className="flex items-center gap-1"><Clock className="size-3" /> 1 day ago</span>
                            <span className="flex items-center gap-1"><MessageSquare className="size-3" /> 0 Comments</span>
                        </div>
                    </div>
                </div>
                {/* Item 3 */}
                <div className="p-6 flex gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="flex flex-col items-center">
                        <div className="size-10 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center">
                            <Trash2 className="size-5" />
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="flex flex-wrap justify-between items-start gap-2 mb-1">
                            <h5 className="font-bold text-slate-900 dark:text-white">Garbage Collection Request</h5>
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-500/10 text-green-500 border border-green-500/20">Resolved</span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Garbage pile cleared from the main entrance of Sector 4.</p>
                        <div className="flex items-center gap-4 text-xs text-slate-400">
                            <span className="flex items-center gap-1"><Clock className="size-3" /> 3 days ago</span>
                            <span className="flex items-center gap-1"><CheckCircle2 className="size-3" /> Verified by Admin</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
