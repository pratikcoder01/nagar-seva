export function Leaderboard() {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-4">Ward Leaderboard</h4>
            <div className="space-y-4">
                {/* Rank 1 */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-400">1</span>
                        <div className="size-8 rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
                            {/* Placeholder for avatar */}
                            <div className="w-full h-full bg-slate-200"></div>
                        </div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Anjali K.</span>
                    </div>
                    <span className="text-xs font-bold text-sky-500">840 pts</span>
                </div>
                {/* Rank 2 */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-400">2</span>
                        <div className="size-8 rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
                            <div className="w-full h-full bg-slate-200"></div>
                        </div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Vikram S.</span>
                    </div>
                    <span className="text-xs font-bold text-sky-500">790 pts</span>
                </div>
                {/* User Rank */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-400">12</span>
                        <div className="size-8 rounded-full bg-sky-500/20 border border-sky-500/30 overflow-hidden flex items-center justify-center">
                            <span className="text-[10px] font-bold text-sky-500">YOU</span>
                        </div>
                        <span className="text-sm font-bold text-slate-900 dark:text-white">Rajesh M.</span>
                    </div>
                    <span className="text-xs font-bold text-sky-500">450 pts</span>
                </div>
            </div>
        </div>
    );
}
