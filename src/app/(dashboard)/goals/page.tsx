"use client";

import { useEffect, useState } from "react";
import { Target, TrendingUp, Presentation, Megaphone, Mail, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const categoryIcons: any = {
    revenue: TrendingUp,
    leads: Target,
    social: Presentation,
    ads: Megaphone,
    email: Mail,
};

export default function GoalsPage() {
    const [goals, setGoals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        fetchGoals();
    }, []);

    const fetchGoals = async () => {
        const res = await fetch("/api/goals");
        const data = await res.json();
        setGoals(data);
        setLoading(false);
    };

    const handleSuggestGoals = async () => {
        setGenerating(true);
        await fetch("/api/agents/goals", { method: "POST" });
        await fetchGoals();
        setGenerating(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Campaign Goals</h1>
                    <p className="text-muted-foreground mt-1">Track your KPIs and milestones recommended by AI.</p>
                </div>
                <button
                    onClick={handleSuggestGoals}
                    disabled={generating}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:ring-2 focus:ring-primary focus:ring-offset-2 flex items-center gap-2 disabled:opacity-50"
                >
                    {generating ? <Clock className="w-4 h-4 animate-spin" /> : <TrendingUp className="w-4 h-4" />}
                    {generating ? "Suggesting Goals..." : "Auto-Suggest Goals"}
                </button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-pulse">
                    {[...Array(3)].map((_, i) => <div key={i} className="h-64 bg-card rounded-xl border border-border"></div>)}
                </div>
            ) : goals.length === 0 ? (
                <div className="text-center py-24 border-2 border-dashed border-border rounded-xl bg-card">
                    <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium">No goals tracked yet</h3>
                    <p className="text-muted-foreground mb-6 max-w-sm mx-auto">Generate recommended KPIs based on your custom marketing strategy, or add them manually.</p>
                    <button onClick={handleSuggestGoals} disabled={generating} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium">
                        Generate suggested KPIs
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {goals.map((goal) => {
                        const Icon = categoryIcons[goal.category] || Target;
                        const progress = goal.currentValue / goal.targetValue * 100;
                        const isCompleted = progress >= 100;

                        const statusColors: any = {
                            on_track: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
                            at_risk: "bg-orange-500/10 text-orange-600 border-orange-500/20",
                            completed: "bg-blue-500/10 text-blue-600 border-blue-500/20",
                            missed: "bg-red-500/10 text-red-600 border-red-500/20",
                        };

                        return (
                            <div key={goal._id} className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
                                <div className="p-5 border-b border-border space-y-4 flex-1">
                                    <div className="flex justify-between items-start">
                                        <div className="bg-primary/10 p-2.5 rounded-lg text-primary">
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <span className={cn("text-xs px-2.5 py-1 rounded-full border font-medium capitalize flex items-center gap-1.5", statusColors[goal.status] || statusColors.on_track)}>
                                            {goal.status === 'at_risk' && <AlertTriangle className="w-3 h-3" />}
                                            {goal.status === 'completed' && <CheckCircle className="w-3 h-3" />}
                                            {goal.status.replace('_', ' ')}
                                        </span>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-lg">{goal.title}</h3>
                                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{goal.description}</p>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm font-medium">
                                            <span>{goal.currentValue.toLocaleString()} {goal.unit}</span>
                                            <span className="text-muted-foreground">{goal.targetValue.toLocaleString()} {goal.unit}</span>
                                        </div>
                                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                            <div className={cn("h-full rounded-full transition-all duration-500", isCompleted ? "bg-blue-500" : goal.status === 'at_risk' ? "bg-orange-500" : "bg-primary")} style={{ width: Math.min(progress, 100) + "%" }} />
                                        </div>
                                    </div>
                                </div>

                                {goal.milestones && goal.milestones.length > 0 && (
                                    <div className="bg-muted/30 p-4 border-t border-border">
                                        <h4 className="text-xs uppercase font-semibold text-muted-foreground mb-3 tracking-wider">Milestones</h4>
                                        <div className="space-y-3">
                                            {goal.milestones.map((ms: any, i: number) => (
                                                <div key={i} className="flex items-center gap-3 text-sm">
                                                    <div className={cn("w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0", ms.achieved ? "bg-emerald-500 border-emerald-500" : "border-muted-foreground/30")}>
                                                        {ms.achieved && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                                    </div>
                                                    <span className={cn("flex-1", ms.achieved && "text-muted-foreground line-through")}>{ms.label}</span>
                                                    <span className="text-xs text-muted-foreground font-mono">{new Date(ms.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
