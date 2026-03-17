"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowLeft, Wand2 } from "lucide-react";
import Link from "next/link";

export default function NewLeadPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        pocName: "",
        pocEmail: "",
        pocPhone: "",
        leadCompanyName: "",
        industry: "",
        notes: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const fillTestData = () => {
        setForm({
            pocName: "Sarah Connor",
            pocEmail: "sarah.connor@cyberdyne.demo",
            pocPhone: "+1 (555) 019-8372",
            leadCompanyName: "Cyberdyne Systems",
            industry: "Robotics & AI",
            notes: "Met at the regional AI conference. They are looking to overhaul their legacy communication systems and upgrade to a fully automated pipeline by Q3. Price sensitive but value-driven."
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                companyId: "demo_company_1", // In real app, from auth session
                pocName: form.pocName,
                pocEmail: form.pocEmail,
                pocPhone: form.pocPhone,
                leadCompanyName: form.leadCompanyName,
                industry: form.industry,
                notes: form.notes,
            };

            // Create lead & draft outreach email via Agent
            const res = await fetch("/api/agents/outreach-email", {
                method: "POST",
                body: JSON.stringify(payload),
            });
            const data = await res.json();

            if (data.success) {
                router.push(`/leads/${data.leadId}`);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-8">
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/leads" className="p-2 hover:bg-accent rounded-full transition-colors text-muted-foreground">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Add New Lead</h1>
                        <p className="text-muted-foreground mt-1">
                            Let the AI draft the perfect cold email based on your marketing strategy.
                        </p>
                    </div>
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

            <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-8 shadow-sm space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Contact Name (POC)</label>
                        <input name="pocName" value={form.pocName} onChange={handleChange} required type="text" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/50" placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Contact Email</label>
                        <input name="pocEmail" value={form.pocEmail} onChange={handleChange} required type="email" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/50" placeholder="john@example.com" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Contact Phone (Optional)</label>
                        <input name="pocPhone" value={form.pocPhone} onChange={handleChange} type="tel" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/50" placeholder="+1 (555) 123-4567" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Company Name</label>
                        <input name="leadCompanyName" value={form.leadCompanyName} onChange={handleChange} required type="text" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/50" placeholder="Acme Logistics" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium">Industry</label>
                        <input name="industry" value={form.industry} onChange={handleChange} required type="text" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/50" placeholder="e.g. Logistics" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium">Context / Notes (Optional)</label>
                        <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} className="w-full bg-background border border-border rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/50" placeholder="Found them on LinkedIn. They recently raised series A..." />
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
                                Drafting Email...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5" />
                                Save & Draft Outreach
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
