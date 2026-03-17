import { useEffect, useState } from "react";
import { Bot, CheckCircle2, ChevronRight, Loader2, Cpu, Search, Sparkles, Target } from "lucide-react";
import { cn } from "@/lib/utils";

const AGENT_STEPS = [
    { id: 1, name: "Company Analyzer", description: "Parsing core identity and market positioning", icon: Search },
    { id: 2, name: "Strategy Agent", description: "Crafting multi-channel marketing campaigns", icon: Sparkles },
    { id: 3, name: "Content Agent", description: "Writing email sequences and ad copy", icon: Bot },
    { id: 4, name: "Goals Agent", description: "Predicting KPIs and milestone timelines", icon: Target },
    { id: 5, name: "Finalizing Plan", description: "Persisting data and preparing dashboard", icon: Cpu }
];

export function AgentLoader() {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        // Automatically progress through the simulated agent steps
        const totalDuration = 18000; // Expected generation time ~18 seconds
        const stepTime = totalDuration / AGENT_STEPS.length;
        
        let step = 0;
        const interval = setInterval(() => {
            step++;
            if (step < AGENT_STEPS.length) {
                setCurrentStep(step);
            } else {
                clearInterval(interval);
            }
        }, stepTime);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] animate-in fade-in duration-700">
            <div className="w-full max-w-lg bg-card border border-border rounded-xl shadow-xl overflow-hidden p-8 relative">
                
                {/* Visual pulse background effect */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 animate-pulse"></div>
                
                <div className="flex flex-col items-center text-center space-y-4 mb-10">
                    <div className="relative">
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center relative z-10">
                            <Bot className="w-10 h-10 text-primary animate-pulse" />
                        </div>
                        {/* Outer pinging rings */}
                        <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-75"></div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">Synthesizing Strategy</h2>
                        <p className="text-muted-foreground mt-1 text-sm">Our AI agent swarm is building your custom campaign...</p>
                    </div>
                </div>

                <div className="space-y-1 relative">
                    {/* Connecting line */}
                    <div className="absolute left-6 top-8 bottom-8 w-px bg-border z-0"></div>

                    {AGENT_STEPS.map((step, index) => {
                        const Icon = step.icon;
                        const isCompleted = index < currentStep;
                        const isActive = index === currentStep;
                        const isPending = index > currentStep;

                        return (
                            <div key={step.id} className={cn(
                                "relative z-10 flex items-start gap-4 p-3 rounded-lg transition-all duration-500",
                                isActive ? "bg-primary/5 border border-primary/20 scale-[1.02]" : "bg-transparent",
                                isPending && "opacity-40"
                            )}>
                                <div className={cn(
                                    "flex items-center justify-center w-8 h-8 rounded-full shrink-0 border-2 transition-colors duration-300",
                                    isCompleted ? "bg-emerald-500 border-emerald-500 text-white" : 
                                    isActive ? "bg-background border-primary text-primary" : 
                                    "bg-background border-muted text-muted-foreground"
                                )}>
                                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : 
                                     isActive ? <Loader2 className="w-4 h-4 animate-spin" /> : 
                                     <span className="text-xs font-bold">{step.id}</span>}
                                </div>
                                <div className="flex-1 mt-0.5">
                                    <h4 className={cn(
                                        "font-medium tracking-tight flex items-center gap-2",
                                        isActive && "text-primary"
                                    )}>
                                        <Icon className="w-4 h-4 text-muted-foreground" />
                                        {step.name} 
                                        {isActive && <span className="flex gap-1 ml-1"><span className="animate-bounce inline-block">.</span><span className="animate-bounce animation-delay-150 inline-block">.</span><span className="animate-bounce animation-delay-300 inline-block">.</span></span>}
                                    </h4>
                                    <p className="text-sm text-muted-foreground">{step.description}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}
