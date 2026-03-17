"use client";

import { useMemo } from "react";
import { Area, AreaChart, ResponsiveContainer, YAxis, Tooltip } from "recharts";

interface StatCardProps {
    title: string;
    value: string | number;
    trend: string | number;
    isPositive: boolean;
    color: string;
    icon: React.ReactNode;
    data: number[];
}

export function StatCard({ title, value, trend, isPositive, color, icon, data }: StatCardProps) {
    const chartData = useMemo(() => data.map((d, i) => ({ value: d, index: i })), [data]);
    
    // Convert hex/named color to tailwind class if needed, or stick to literal colors
    // Simple mapping for recharts hex
    let hexColor = "#8b5cf6"; // default violet
    if (color === "violet") hexColor = "#8b5cf6";
    if (color === "blue") hexColor = "#3b82f6";
    if (color === "emerald") hexColor = "#10b981";
    if (color === "orange") hexColor = "#f97316";

    return (
        <div className="bg-[#121212] border border-white/5 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
            {/* Subtle top glow based on card color */}
            <div className={`absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-${color}-500/30 to-transparent`} />
            
            <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3 items-center">
                    <div className={`w-10 h-10 rounded-xl bg-${color}-500/10 flex items-center justify-center text-${color}-400`}>
                        {icon}
                    </div>
                    <div>
                        <h3 className="text-white font-medium">{title}</h3>
                        <p className="text-muted-foreground text-xs mt-0.5">Compared to last month</p>
                    </div>
                </div>
            </div>

            <div className="flex items-end justify-between z-10 relative">
                <div className="flex items-center gap-3">
                    <span className="text-4xl font-bold text-white tracking-tight">{value}</span>
                    <div className={`px-2 py-0.5 rounded text-xs font-semibold ${isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                        {isPositive ? '+' : ''}{trend}
                    </div>
                </div>
            </div>

            <div className="h-[60px] w-full mt-4 -mx-1">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id={`color-${title}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={hexColor} stopOpacity={0.3}/>
                                <stop offset="95%" stopColor={hexColor} stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <YAxis domain={['dataMin - 5', 'dataMax + 5']} hide />
                        <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke={hexColor} 
                            strokeWidth={2}
                            fillOpacity={1} 
                            fill={`url(#color-${title})`} 
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            
            {/* Ambient hover glow behind chart */}
            <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-1/2 bg-${color}-500/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />
        </div>
    );
}
