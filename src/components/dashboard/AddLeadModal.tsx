"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Loader2 } from "lucide-react";

export function AddLeadModal() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    // Form State
    const [pocName, setPocName] = useState("");
    const [pocEmail, setPocEmail] = useState("");
    const [pocPhone, setPocPhone] = useState("");
    const [leadCompanyName, setLeadCompanyName] = useState("");
    const [industry, setIndustry] = useState("");
    const [notes, setNotes] = useState("");

    const handleFillTestData = () => {
        setPocName("John Smith");
        setPocEmail("john.smith@example.com");
        setPocPhone("+1 (555) 123-4567");
        setLeadCompanyName("TechFlow Inc.");
        setIndustry("Software Development");
        setNotes("Targeting their recent expansion into the European market. Emphasize our global reach capabilities.");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch("/api/agents/outreach-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    pocName,
                    pocEmail,
                    pocPhone,
                    leadCompanyName,
                    industry,
                    notes
                })
            });

            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.error || "Failed to add lead");
            }

            setOpen(false);
            
            // Redirect straight to the new lead's profile to review the drafted email
            router.push(`/leads/${data.leadId}`);
            
        } catch (error) {
            console.error(error);
            alert("Error adding lead. Check console.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="bg-primary hover:bg-primary/90 shadow-[0_0_15px_rgba(124,58,237,0.3)] text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                    <Plus className="w-4 h-4" />
                    Add New Lead
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-[#121212] border-white/10 text-white">
                <DialogHeader className="flex flex-row items-start justify-between">
                    <div>
                        <DialogTitle className="text-xl">Add Target Lead</DialogTitle>
                        <DialogDescription className="text-muted-foreground mt-1.5 pr-4">
                            Enter the prospect's details. Marketing Geni will automatically draft a highly-personalized outreach email based on their profile and your active Strategy.
                        </DialogDescription>
                    </div>
                    <button 
                        onClick={handleFillTestData}
                        type="button"
                        className="text-xs bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white px-3 py-1.5 rounded-md transition-colors whitespace-nowrap border border-white/10"
                    >
                        Fill Test Data
                    </button>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="font-medium text-gray-300">Contact Name</label>
                            <input 
                                required
                                value={pocName}
                                onChange={(e) => setPocName(e.target.value)}
                                className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary/50" 
                                placeholder="Jane Doe" 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="font-medium text-gray-300">Contact Email</label>
                            <input 
                                required
                                type="email"
                                value={pocEmail}
                                onChange={(e) => setPocEmail(e.target.value)}
                                className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary/50" 
                                placeholder="jane@example.com" 
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="font-medium text-gray-300">Company Name</label>
                            <input 
                                required
                                value={leadCompanyName}
                                onChange={(e) => setLeadCompanyName(e.target.value)}
                                className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary/50" 
                                placeholder="Acme Corp" 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="font-medium text-gray-300">Industry</label>
                            <input 
                                required
                                value={industry}
                                onChange={(e) => setIndustry(e.target.value)}
                                className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary/50" 
                                placeholder="Logistics" 
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="font-medium text-gray-300">Contact Phone <span className="text-xs text-muted-foreground font-normal">(Optional)</span></label>
                        <input 
                            value={pocPhone}
                            onChange={(e) => setPocPhone(e.target.value)}
                            className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary/50" 
                            placeholder="+1 (555) 000-0000" 
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="font-medium text-gray-300">Target Context / Notes</label>
                        <textarea 
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary/50 min-h-[80px]" 
                            placeholder="Any specific angles to mention? e.g. Saw they just raised Series A. Emphasize scaling." 
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button 
                            type="button" 
                            onClick={() => setOpen(false)}
                            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg text-sm font-medium flex items-center justify-center min-w-[140px] transition-colors disabled:opacity-50"
                        >
                            {isLoading ? (
                                <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Drafting...</>
                            ) : (
                                "Add Lead & Draft"
                            )}
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
