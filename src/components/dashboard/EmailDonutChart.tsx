"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export function EmailDonutChart({ emailsAnalyzed, extracted, rejected }: { emailsAnalyzed: number, extracted: number, rejected: number }) {
    const data = [
        { name: 'Extracted', value: Math.max(0, extracted), color: '#8b5cf6' }, // Primary violet
        { name: 'Rejected/Pending', value: Math.max(0, rejected), color: '#333333' }, // Dark gray
    ];

    return (
        <div className="bg-[#121212] border border-white/5 rounded-3xl p-6 shadow-2xl relative w-full h-[380px] flex flex-col items-center justify-center">
            {/* Glow effect matching the image */}
            <div className="absolute inset-0 bg-primary/5 blur-[100px] pointer-events-none rounded-full" />
            
            <div className="absolute top-6 left-6 right-6">
                <h3 className="text-white font-medium text-lg">Email processing activity</h3>
                <p className="text-muted-foreground text-xs mt-1">Automated email analysis</p>
                <div className="flex gap-2 mt-4">
                    {["24h", "7d", "31d", "All"].map((t, i) => (
                        <button key={i} className={`text-xs px-3 py-1 rounded-full ${i === 1 ? 'bg-primary text-white shadow-[0_0_15px_rgba(124,58,237,0.5)]' : 'bg-white/5 text-muted-foreground hover:bg-white/10'}`}>
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            <div className="w-[200px] h-[200px] relative mt-16">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            innerRadius={70}
                            outerRadius={90}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                            cornerRadius={4}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                            itemStyle={{ color: '#fff' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[10px] uppercase text-muted-foreground tracking-wider mb-1">Total Emails</span>
                    <span className="text-4xl font-light text-white font-mono">{emailsAnalyzed}</span>
                </div>
            </div>

            <div className="absolute bottom-6 left-6 right-6 space-y-2 w-full px-6">
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-muted-foreground">Offers extracted</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-white">{extracted}</span>
                        <span className="text-xs bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded">+12</span>
                    </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#333]" />
                        <span className="text-muted-foreground">Pending/Rejected</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-white">{rejected}</span>
                        <span className="text-xs bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded">+4</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
