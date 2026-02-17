import { AlertTriangle, Clock, CheckCircle } from "lucide-react";
import { CivicPointsCard } from "@/ui/components/CivicPointsCard";
import { StatusCard } from "@/ui/components/StatusCard";
import { RecentComplaints } from "@/ui/components/RecentComplaints";
import { Leaderboard } from "@/ui/components/Leaderboard";

export default function DashboardPage() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Dashboard Content */}
            <div className="lg:col-span-9 space-y-8">
                {/* Welcome Section */}
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Namaste, Rajesh!</h1>
                    <p className="text-slate-500 dark:text-slate-400">Here is what&apos;s happening in your ward today.</p>
                </div>

                <CivicPointsCard />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatusCard label="Pending Issues" count={12} icon={AlertTriangle} color="red" trend="+2 this week" />
                    <StatusCard label="In Progress" count={5} icon={Clock} color="amber" trend="Active now" />
                    <StatusCard label="Resolved Issues" count={28} icon={CheckCircle} color="green" trend="+5 this week" />
                </div>

                <RecentComplaints />
            </div>

            {/* Right Column: Actions & Map */}
            <div className="lg:col-span-3 space-y-6">
                <button className="w-full bg-sky-500 hover:bg-sky-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-sky-500/30 transition-all hover:-translate-y-0.5 active:translate-y-0">
                    <span className="text-2xl">+</span>
                    Report New Issue
                </button>

                {/* Mock Map */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">Issues Near You</h4>
                    </div>
                    <div className="h-48 bg-slate-200 dark:bg-slate-800 relative group overflow-hidden flex items-center justify-center">
                        <span className="text-slate-500">Map Placeholder</span>
                    </div>
                    <div className="p-4">
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                            There are <span className="font-bold text-slate-700 dark:text-slate-200">8 active reports</span> within 500m of your location.
                        </p>
                    </div>
                </div>

                <Leaderboard />
            </div>
        </div>
    );
}
