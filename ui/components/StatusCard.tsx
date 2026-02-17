import { LucideIcon } from "lucide-react";

interface StatusCardProps {
    label: string;
    count: number;
    icon: LucideIcon;
    color: "red" | "amber" | "green";
    trend: string;
}

export function StatusCard({ label, count, icon: Icon, color, trend }: StatusCardProps) {
    const colorClasses = {
        red: "text-red-500 bg-red-500/10 border-red-500",
        amber: "text-amber-500 bg-amber-500/10 border-amber-500",
        green: "text-green-500 bg-green-500/10 border-green-500",
    };

    return (
        <div className={`bg-white dark:bg-slate-900 p-6 rounded-xl border-l-4 shadow-sm border-y border-r border-slate-200 dark:border-slate-800 ${colorClasses[color].replace("text-", "border-").split(" ")[2]}`}>
            <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg ${colorClasses[color].replace("border-", "").split(" ").slice(0, 2).join(" ")}`}>
                    <Icon className="size-6" />
                </div>
                <span className={`text-xs font-bold ${colorClasses[color].split(" ")[0]}`}>{trend}</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{label}</p>
            <h4 className="text-3xl font-black text-slate-900 dark:text-white mt-1">{count}</h4>
        </div>
    );
}
