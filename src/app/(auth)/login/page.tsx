"use client";

import { useState } from "react";
import { ArrowRight, Lock, Mail, Activity, Zap, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const isRegistered = searchParams.get("registered");
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({...form, [e.target.name]: e.target.value});
    };

    const fillTestCredentials = () => {
        setForm({
            email: "demo@marketai.pro",
            password: "password123",
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await signIn("credentials", {
                redirect: false,
                email: form.email,
                password: form.password,
            });

            if (res?.error) {
                setError("Invalid email or password");
            } else {
                router.push("/dashboard");
            }
        } catch (e) {
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-4 overflow-hidden relative selection:bg-primary/30">
            {/* Dark abstract glowing background reminiscent of the image design */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[130px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-blue-500/10 blur-[130px] rounded-full pointer-events-none" />

            <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center z-10 flex-row-reverse">
                
                {/* Form side */}
                <div className="w-full max-w-md mx-auto lg:order-2">
                    <div className="bg-[#121212]/80 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] relative">
                        {/* Glow on top edge of the card */}
                        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-white mb-2">Welcome back</h2>
                            <p className="text-muted-foreground text-sm">Sign in to your autonomous marketing suite.</p>
                        </div>

                        {isRegistered && (
                            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 shrink-0" />
                                <span className="text-sm font-medium">Account created! Please sign in.</span>
                            </div>
                        )}

                        {error && (
                            <div className="mb-6 p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg text-center">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="flex justify-end mb-2">
                                <button 
                                    type="button" 
                                    onClick={fillTestCredentials}
                                    className="text-xs flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors border border-primary/20"
                                >
                                    <Zap className="w-3 h-3" />
                                    Use Demo Account
                                </button>
                            </div>
                            
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Work Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-3 w-5 h-5 text-muted-foreground/50" />
                                    <input 
                                        type="email" 
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-[#1A1A1A] border border-white/10 text-white rounded-xl pl-11 pr-4 py-3 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-medium placeholder:font-normal placeholder:text-muted-foreground/50" 
                                        placeholder="william@company.com" 
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Password</label>
                                    <Link href="#" className="text-xs text-primary hover:text-primary/80 transition-colors">Forgot?</Link>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-3 w-5 h-5 text-muted-foreground/50" />
                                    <input 
                                        type="password" 
                                        name="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-[#1A1A1A] border border-white/10 text-white rounded-xl pl-11 pr-4 py-3 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-medium placeholder:font-normal placeholder:text-muted-foreground/50" 
                                        placeholder="••••••••" 
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="group w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] mt-6 shadow-[0_0_20px_rgba(124,58,237,0.3)] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {loading ? "Authenticating..." : "Sign In"}
                                {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                            </button>
                        </form>

                        <div className="mt-8 text-center text-sm text-muted-foreground">
                            Don't have an account?{" "}
                            <Link href="/signup" className="text-white hover:text-primary font-medium hover:underline underline-offset-4 transition-colors">
                                Create one
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Graphics side */}
                <div className="hidden lg:flex flex-col justify-center space-y-8 pl-8 lg:order-1 border-r border-white/5 pr-12">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-medium mb-4">
                            <Zap className="w-4 h-4" /> Next-Gen Marketing AI
                        </div>
                        <h1 className="text-5xl font-extrabold tracking-tight text-white leading-tight">
                            MarketAI <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Pro</span>
                        </h1>
                        <p className="text-muted-foreground mt-4 text-lg max-w-md">
                            Continue building your autonomous pipeline. Login to view active campaigns, deal health, and automated executions.
                        </p>
                    </div>

                    {/* Funnel visualization matching dark aesthetic */}
                    <div className="bg-[#121212] border border-white/5 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="flex justify-between items-center mb-6 relative">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                                    <Activity className="w-4 h-4" />
                                </div>
                                <span className="font-semibold text-white">Conversion Trend</span>
                            </div>
                            <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">+12% MoM</span>
                        </div>
                        <div className="space-y-3 relative">
                            {/* Bar charts simulation */}
                            <div className="flex items-end gap-2 h-24">
                                {[30, 45, 25, 60, 80, 50, 95].map((height, i) => (
                                    <div key={i} className="flex-1 bg-white/5 rounded-t-sm hover:bg-primary/50 transition-colors" style={{ height: `${height}%` }}>
                                        {i === 6 && <div className="w-full h-full bg-primary shadow-[0_0_10px_rgba(124,58,237,0.5)] rounded-t-sm" />}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    );
}
