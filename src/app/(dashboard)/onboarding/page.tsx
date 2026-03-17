"use client";

import { useState } from "react";
import { Sparkles, ArrowRight, Target, Users, Map, Plus, Wand2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { AgentLoader } from "@/components/ui/AgentLoader";

export default function OnboardingPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        strategyName: "",
        companyName: "",
        industry: "",
        description: "",
        targetAudience: "",
        geographies: "",
        competitors: "",
        productName: "",
        productPrice: "",
        productUSP: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const fillTestData = () => {
        setForm({
            strategyName: "Q4 Launch Strategy",
            companyName: "Acme Corp",
            industry: "B2B SaaS",
            description: "We build AI-powered sales execution tools that help teams close 30% more deals by automating routine communications and providing real-time strategies.",
            targetAudience: "VP of Sales, CTOs, Account Executives",
            geographies: "Global (US, UK, CA, AU)",
            competitors: "Hubspot, Outreach.io, Apollo",
            productName: "MarketAI Pro Platform",
            productPrice: "$99/user/month",
            productUSP: "True end-to-end AI automation from marketing strategy through to post-call closing recommendations."
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                strategyName: form.strategyName || "General Strategy",
                companyName: form.companyName || "Acme Corp",
                industry: form.industry || "B2B SaaS",
                description: form.description || "We build AI sales tools.",
                targetAudience: form.targetAudience || "VP of Sales",
                geographies: form.geographies || "Global",
                competitors: form.competitors || "Hubspot",
                productsToSell: [
                    { 
                        name: form.productName || "Core Platform", 
                        description: "Main product", 
                        price: form.productPrice || "$99/mo", 
                        usp: form.productUSP || "AI Native" 
                    }
                ]
            };

            const res = await fetch("/api/agents/strategy", {
                method: "POST",
                body: JSON.stringify(payload),
            });
            const data = await res.json();

            if (data.success) {
                // Also trigger goals generation
                await fetch("/api/agents/goals", {
                    method: "POST",
                    body: JSON.stringify({ companyId: data.companyId, planId: data.planId })
                });

                router.push("/strategy/" + data.planId);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <AgentLoader />;
    }

    return (
        <div className="max-w-4xl mx-auto py-8">
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Create New Campaign</h1>
                    <p className="text-muted-foreground text-lg">
                        Provide the details to generate a complete marketing & sales strategy for this specific campaign.
                    </p>
                </div>
                <button
                    onClick={fillTestData}
                    type="button"
                    className="flex items-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                >
                    <Wand2 className="w-4 h-4" />
                    Fill Test Data
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Section 1 */}
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary" />
                        1. Core Identity
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium">Strategy Name <span className="text-muted-foreground text-xs font-normal ml-2">(e.g., Q4 Enterprise Outreach)</span></label>
                            <input name="strategyName" value={form.strategyName} onChange={handleChange} required type="text" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/50 text-xl font-medium placeholder:text-muted-foreground/50 border-primary/20 bg-primary/5" placeholder="Name this Marketing Strategy..." />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Company Name</label>
                            <input name="companyName" value={form.companyName} onChange={handleChange} required type="text" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/50" placeholder="e.g. Acme Corp" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Industry</label>
                            <input name="industry" value={form.industry} onChange={handleChange} required type="text" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/50" placeholder="e.g. B2B SaaS" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium">Elevator Pitch / Description</label>
                            <textarea name="description" value={form.description} onChange={handleChange} required rows={3} className="w-full bg-background border border-border rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/50" placeholder="What does your company do in 2-3 sentences?" />
                        </div>
                    </div>
                </div>

                {/* Section 2 */}
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Map className="w-5 h-5 text-primary" />
                        2. Products & Services
                    </h2>
                    <div className="space-y-4">
                        <div className="bg-background border border-border rounded-lg p-4 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground uppercase">Product Name</label>
                                    <input name="productName" value={form.productName} onChange={handleChange} required type="text" className="w-full bg-transparent border-b border-border px-2 py-1 outline-none focus:border-primary" placeholder="Core Platform" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground uppercase">Price / Model</label>
                                    <input name="productPrice" value={form.productPrice} onChange={handleChange} required type="text" className="w-full bg-transparent border-b border-border px-2 py-1 outline-none focus:border-primary" placeholder="$99/user/month" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-muted-foreground uppercase">Unique Selling Proposition (USP)</label>
                                <input name="productUSP" value={form.productUSP} onChange={handleChange} required type="text" className="w-full bg-transparent border-b border-border px-2 py-1 outline-none focus:border-primary" placeholder="10x faster than competitors..." />
                            </div>
                        </div>
                        <button type="button" className="text-sm text-primary font-medium flex items-center gap-1 hover:underline">
                            <Plus className="w-4 h-4" /> Add another product
                        </button>
                    </div>
                </div>

                {/* Section 3 */}
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary" />
                        3. Target Market
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Target Audience (Personas)</label>
                            <input name="targetAudience" value={form.targetAudience} onChange={handleChange} required type="text" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/50" placeholder="VP of Sales, CTOs" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Geographies</label>
                            <input name="geographies" value={form.geographies} onChange={handleChange} required type="text" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/50" placeholder="North America, UK" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium">Top Competitors</label>
                            <input name="competitors" value={form.competitors} onChange={handleChange} required type="text" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/50" placeholder="Competitor A, Competitor B" />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-medium flex items-center gap-2 shadow-lg shadow-primary/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Generating Strategy...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5" />
                                Generate Strategy
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
