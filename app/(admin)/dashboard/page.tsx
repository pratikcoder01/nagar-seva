import { AlertTriangle, Clock, CheckCircle2, TrendingUp, Users } from "lucide-react";
import { StatusCard } from "@/ui/components/StatusCard";

export default function AdminDashboardPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Command Center</h1>
                <p className="text-slate-500">Real-time overview of city grievances and performance.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatusCard label="Critical Issues" count={42} icon={AlertTriangle} color="red" trend="+12% vs last week" />
                <StatusCard label="Avg. Resolution Time" count={48} icon={Clock} color="amber" trend="-2hrs improvement" />
                <StatusCard label="Total Resolved" count={1284} icon={CheckCircle2} color="green" trend="+8% vs last month" />
                <StatusCard label="Active Agents" count={85} icon={Users} color="green" trend="Online now" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Heatmap Placeholder */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 h-96 flex flex-col">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-4">Issue Heatmap</h3>
                    <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                        <span className="text-slate-500 text-sm">Interactive Map Integration</span>
                    </div>
                </div>

                {/* Recent Analytics/Chart Placeholder */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 h-96 flex flex-col">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-4">Category Analysis</h3>
                    <div className="flex-1 flex items-end justify-between px-4 gap-2">
                        {[40, 70, 45, 90, 60].map((h, i) => (
                            <div key={i} className="w-full bg-indigo-500/20 rounded-t-lg relative group">
                                <div className="absolute bottom-0 w-full bg-indigo-500 rounded-t-lg transition-all" style={{ height: `${h}%` }}></div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-slate-500">
                        <span>Roads</span>
                        <span>Water</span>
                        <span>Lights</span>
                        <span>Garbage</span>
                        <span>Others</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
