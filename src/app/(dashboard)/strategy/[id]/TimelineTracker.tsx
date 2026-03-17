"use client";

import { useState } from "react";
import { CheckCircle2, Circle, Mail, Target, DollarSign, Megaphone, Activity } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { StatCard } from "@/components/dashboard/StatCard";

// Generate fake sparkline history data
const generateSparkline = (base: number) => Array.from({length: 10}, () => Math.max(0, base + Math.floor(Math.random() * 20 - 10)));

export default function TimelineTracker({ plan }: { plan: any }) {
    const [calendar, setCalendar] = useState(plan.contentCalendar || []);

    const calculateProgress = () => {
        if (!calendar || calendar.length === 0) return 0;
        let total = 0;
        let completed = 0;

        calendar.forEach((week: any) => {
            if (!week.tasks) return;
            week.tasks.forEach((task: any) => {
                total++;
                const isLegacy = typeof task === 'string';
                if (!isLegacy && task.completed) completed++;
            });
        });

        return total === 0 ? 0 : Math.round((completed / total) * 100);
    };

    const toggleTask = async (weekIndex: number, taskIndex: number, currentTask: any) => {
        const isLegacy = typeof currentTask === 'string';
        // We cannot easily toggle legacy string tasks via simple patch without migration
        if (isLegacy) {
            alert("This campaign was generated with an older version. Please generate a new campaign to use task tracking.");
            return;
        }

        const newStatus = !currentTask.completed;

        // Optimistic UI update
        const newCalendar = [...calendar];
        newCalendar[weekIndex].tasks[taskIndex].completed = newStatus;
        setCalendar(newCalendar);

        try {
            const res = await fetch(`/api/agents/strategy/${plan._id}/tasks`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    weekIndex,
                    taskIndex,
                    completed: newStatus
                })
            });

            if (!res.ok) {
                // Revert on error
                const revertCalendar = [...calendar];
                revertCalendar[weekIndex].tasks[taskIndex].completed = !newStatus;
                setCalendar(revertCalendar);
                console.error("Failed to update task");
            }
        } catch (e) {
            console.error("Network error updating task", e);
        }
    };

    const progress = calculateProgress();
    const emailSmsCount = (plan.emailScripts?.length || 0) + (plan.smsScripts?.length || 0);

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
                <StatCard 
                    title="Rec. Budget" 
                    value={`$${plan.paidMedia?.totalMonthlyBudgetRecommended || 0}`} 
                    trend="0%" 
                    isPositive={true} 
                    color="emerald"
                    icon={<DollarSign className="w-5 h-5 text-emerald-400" />}
                    data={generateSparkline(plan.paidMedia?.totalMonthlyBudgetRecommended || 5000)}
                />
                <StatCard 
                    title="Est. Conversions" 
                    value={plan.paidMedia?.googleAds?.estimatedConversions || 0} 
                    trend="0%" 
                    isPositive={true} 
                    color="violet"
                    icon={<Target className="w-5 h-5 text-violet-400" />}
                    data={generateSparkline(plan.paidMedia?.googleAds?.estimatedConversions || 150)}
                />
                <StatCard 
                    title="Active Scripts" 
                    value={emailSmsCount} 
                    trend="New" 
                    isPositive={true} 
                    color="blue"
                    icon={<Mail className="w-5 h-5 text-blue-400" />}
                    data={generateSparkline(emailSmsCount * 10)}
                />
                <StatCard 
                    title="Social Ideas" 
                    value={
                        (plan.social?.instagram?.contentIdeas?.length || 0) + (plan.social?.facebook?.adCopyIdeas?.length || 0) + (plan.social?.linkedin?.postIdeas?.length || 0)
                    } 
                    trend="New" 
                    isPositive={true} 
                    color="orange"
                    icon={<Megaphone className="w-5 h-5 text-orange-400" />}
                    data={generateSparkline(100)}
                />
            </div>

            <div className="bg-[#121212] border border-white/5 rounded-3xl p-6 mb-8 flex flex-col items-start gap-4 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-[50px] pointer-events-none" />
                
                <div className="w-full flex justify-between items-center z-10 relative">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                            <Activity className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg text-white">Execution Progress</h3>
                            <p className="text-sm text-muted-foreground">Track your campaign's real-world rollout.</p>
                        </div>
                    </div>
                    <span className="text-3xl font-light text-white tracking-tight">{progress}%</span>
                </div>
                
                <div className="w-full bg-white/5 rounded-full h-3 mt-4 overflow-hidden z-10 relative">
                    <div className="bg-primary h-3 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(124,58,237,0.5)]" style={{ width: `${progress}%` }} />
                </div>
            </div>

            <div className="relative border-l-2 border-primary/20 ml-4 md:ml-8 space-y-12 pb-8 mt-12">
                {calendar.map((calendarItem: any, weekIndex: number) => (
                    <div key={weekIndex} className="relative pl-8 md:pl-12">
                        {/* Glowing timeline dot */}
                        <div className="absolute -left-[17px] top-2 w-8 h-8 rounded-full bg-[#121212] flex items-center justify-center border-2 border-primary/50 shadow-[0_0_15px_rgba(124,58,237,0.3)] z-10">
                            <span className="text-primary font-bold text-xs">{weekIndex + 1}</span>
                        </div>
                        
                        <div className="bg-[#121212] border border-white/5 rounded-2xl p-6 shadow-lg group hover:border-primary/30 transition-all text-white">
                            <h3 className="font-semibold text-lg text-white mb-6 flex items-center gap-2">
                                <span className="bg-white/10 px-3 py-1 rounded-lg text-sm text-muted-foreground">Sprint {weekIndex + 1}</span>
                                {calendarItem.week}
                            </h3>
                            
                            <ul className="space-y-4">
                                {calendarItem.tasks?.map((task: any, taskIdx: number) => {
                                    const isLegacy = typeof task === 'string';
                                    const title = isLegacy ? task : task.title;
                                    const isCompleted = isLegacy ? false : task.completed;

                                    return (
                                        <li 
                                            key={taskIdx} 
                                            className={`flex items-start gap-4 p-4 rounded-xl border transition-all duration-300 ${!isLegacy ? 'cursor-pointer hover:bg-white/5' : 'bg-transparent'} ${isCompleted ? 'bg-primary/5 border-primary/20 opacity-70' : 'bg-[#1A1A1A] border-white/5'}`}
                                            onClick={() => toggleTask(weekIndex, taskIdx, task)}
                                        >
                                            <button 
                                                className={`shrink-0 mt-0.5 transition-colors ${isCompleted ? 'text-primary drop-shadow-[0_0_5px_rgba(124,58,237,0.5)]' : 'text-muted-foreground hover:text-white'}`}
                                                disabled={isLegacy}
                                            >
                                                {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                                            </button>
                                            <div className="flex flex-col flex-1">
                                                <span className={`text-base font-medium select-none ${isCompleted ? 'line-through text-muted-foreground' : 'text-white'}`}>
                                                    {title}
                                                </span>
                                                {!isLegacy && task.explanation && (
                                                    <p className={`text-sm mt-1.5 select-none leading-relaxed ${isCompleted ? 'text-muted-foreground/50 line-through' : 'text-muted-foreground'}`}>
                                                        {task.explanation}
                                                    </p>
                                                )}
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
