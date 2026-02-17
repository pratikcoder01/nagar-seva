import { Button } from "@/ui/components/ui/button";
import { Input } from "@/ui/components/ui/input";
import { Search, Filter } from "lucide-react";

export default function IssuesPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Issue Management</h1>
                    <p className="text-slate-500">Manage, assign, and resolve reported grievances.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline"><Filter className="mr-2 size-4" /> Filter</Button>
                    <Button>Export Report</Button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
                        <Input placeholder="Search issues by ID, category, or location..." className="pl-10" />
                    </div>
                </div>

                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                    <div className="col-span-1">ID</div>
                    <div className="col-span-4">Issue Details</div>
                    <div className="col-span-2">Category</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">Date</div>
                    <div className="col-span-1">Action</div>
                </div>

                {/* Table Rows (Mock) */}
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="grid grid-cols-12 gap-4 p-4 border-b border-slate-100 dark:border-slate-800 items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <div className="col-span-1 text-sm font-mono text-slate-500">#29{i}</div>
                        <div className="col-span-4">
                            <p className="font-bold text-slate-900 dark:text-white text-sm">Pothole near central park</p>
                            <p className="text-xs text-slate-500 truncate">Sector 4, Main road blocking traffic...</p>
                        </div>
                        <div className="col-span-2">
                            <span className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700">Roads</span>
                        </div>
                        <div className="col-span-2">
                            <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold border border-amber-200">In Progress</span>
                        </div>
                        <div className="col-span-2 text-sm text-slate-500">
                            2 hours ago
                        </div>
                        <div className="col-span-1">
                            <Button variant="ghost" size="sm">View</Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
