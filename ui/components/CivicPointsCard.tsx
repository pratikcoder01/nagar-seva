import { Award, ShieldCheck } from "lucide-react";

export function CivicPointsCard() {
    return (
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-sky-500 to-blue-700 p-6 text-white shadow-lg shadow-sky-500/20">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-3 rounded-lg backdrop-blur-md">
                        <Award className="size-8" />
                    </div>
                    <div>
                        <p className="text-blue-100 text-xs font-bold uppercase tracking-wider">Your Impact Score</p>
                        <h3 className="text-3xl font-black">450 <span className="text-lg font-medium opacity-80">Civic Points</span></h3>
                        <p className="text-blue-100 text-sm mt-1">Top 5% of contributors in Indiranagar ward</p>
                    </div>
                </div>
                <div className="flex flex-col gap-2 min-w-[200px]">
                    <div className="flex justify-between text-xs font-bold">
                        <span>LEVEL 4: GUARDIAN</span>
                        <span>500 PTS</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                        <div className="bg-white h-2 rounded-full" style={{ width: "85%" }}></div>
                    </div>
                    <p className="text-[10px] text-right text-blue-100">50 pts to reach Level 5</p>
                </div>
            </div>
            <div className="absolute -right-8 -bottom-8 opacity-10">
                <ShieldCheck className="size-48" />
            </div>
        </div>
    );
}
