"use client";

import { BarChart, Bar, ResponsiveContainer, Cell, XAxis, Tooltip } from "recharts";
import { ArrowUpRight, Inbox } from "lucide-react";

export function EmailBarChart({ data }: { data: { name: string, value: number, color: string }[] }) {
    return (
        <div className="bg-[#121212] border border-white/5 rounded-3xl p-6 shadow-[0_0_40px_rgba(124,58,237,0.1)] relative overflow-hidden group">
            {/* Ambient purple glow */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[100px] pointer-events-none rounded-full" />
            
            <div className="flex justify-between items-start mb-6 z-10 relative">
                <div>
                    <h3 className="text-white font-medium text-lg">Email processing activity</h3>
                    <p className="text-muted-foreground text-sm mt-1">Automated email analysis across all connectors</p>
                </div>
                <div className="flex bg-[#1A1A1A] rounded-full p-1 border border-white/5">
                    {["24h", "7d", "31d"].map((t, i) => (
                        <button key={i} className={`text-xs px-4 py-1.5 rounded-full transition-colors ${i === 1 ? 'bg-primary text-white shadow-[0_0_10px_rgba(124,58,237,0.4)]' : 'text-muted-foreground hover:text-white'}`}>
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 z-10 relative mt-8">
                <div className="col-span-1">
                    <p className="text-muted-foreground mb-1">Emails analyzed</p>
                    <div className="h-10 w-full bg-primary/20 rounded-lg overflow-hidden relative group cursor-pointer">
                         <div className="absolute inset-y-0 left-0 w-3/4 bg-primary rounded-lg transition-all group-hover:w-[80%]" />
                    </div>
                </div>
                <div className="col-span-2 flex justify-end items-end">
                     <span className="text-5xl font-light text-white tracking-tighter">178</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/5 z-10 relative">
                <div className="bg-[#1A1A1A]/80 rounded-2xl p-4 border border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-md bg-primary/20 flex items-center justify-center text-primary">
                             <Inbox className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-sm text-muted-foreground">Offers extracted</span>
                        <span className="text-xs bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded font-medium flex items-center">
                            <ArrowUpRight className="w-3 h-3 mr-0.5" />
                            12
                        </span>
                    </div>
                    <div className="text-3xl font-semibold text-white">45</div>
                    <p className="text-xs text-muted-foreground mt-1">Compared to previous 7 days</p>
                </div>
                
                <div className="bg-[#1A1A1A]/80 rounded-2xl p-4 border border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center text-muted-foreground">
                             <Inbox className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-sm text-muted-foreground">Rejected emails</span>
                        <span className="text-xs bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded font-medium flex items-center">
                            -8
                        </span>
                    </div>
                    <div className="text-3xl font-semibold text-white">133</div>
                    <p className="text-xs text-muted-foreground mt-1">Compared to previous 7 days</p>
                </div>
            </div>
            
        </div>
    );
}
