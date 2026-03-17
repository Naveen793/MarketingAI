"use client";

import { useState } from "react";
import { Loader2, Plus, MessageSquare } from "lucide-react";

export function GenerateCallScriptForm({ leadId }: { leadId: string }) {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <form onSubmit={async (e) => {
            e.preventDefault();
            setIsLoading(true);
            await fetch('/api/agents/call-script', { 
                method: 'POST', 
                body: JSON.stringify({ leadId }) 
            });
            window.location.reload();
        }}>
            <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg text-sm font-medium transition-colors focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50"
            >
                {isLoading ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin"/> Generating...</span> : "Generate Call Script"}
            </button>
        </form>
    );
}

export function LogCallDebriefForm({ leadId }: { leadId: string }) {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <form onSubmit={async (e) => {
            e.preventDefault();
            setIsLoading(true);
            const notes = (e.target as any).notes.value;
            await fetch('/api/agents/call-debrief', { 
                method: 'POST', 
                body: JSON.stringify({ leadId, rawNotes: notes }) 
            });
            window.location.reload();
        }} className="space-y-3">
            <textarea 
                name="notes" 
                rows={4} 
                placeholder="Paste raw meeting notes..." 
                className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg p-3 text-sm focus:ring-blue-500/50 outline-none text-white focus:border-blue-500/50" 
                required
                disabled={isLoading}
            ></textarea>
            <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg text-sm font-medium transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
                {isLoading ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin"/> Analyzing Notes...</span> : "Analyze Notes & Get Next Steps"}
            </button>
        </form>
    );
}

export function DraftCustomEmailForm({ leadId }: { leadId: string }) {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <form onSubmit={async (e) => {
            e.preventDefault();
            setIsLoading(true);
            const prompt = (e.target as any).prompt.value;
            await fetch('/api/agents/custom-email', { 
                method: 'POST', 
                body: JSON.stringify({ leadId, prompt }) 
            });
            window.location.reload();
        }} className="space-y-3">
            <textarea 
                name="prompt" 
                rows={3} 
                placeholder="E.g., Write a friendly follow up asking if they saw the proposal..." 
                className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg p-3 text-sm focus:ring-purple-500/50 outline-none text-white focus:border-purple-500/50" 
                required
                disabled={isLoading}
            ></textarea>
            <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg text-sm font-medium transition-colors focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
            >
                {isLoading ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin"/> Drafting Email...</span> : "Draft Custom Email"}
            </button>
        </form>
    );
}

export function GenerateOutreachEmailForm({ leadId, campaigns = [] }: { leadId: string, campaigns?: { _id: string, title?: string }[] }) {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <form onSubmit={async (e) => {
            e.preventDefault();
            setIsLoading(true);
            const campaignId = (e.target as any).campaignId?.value;
            try {
                const payload = campaignId ? { leadId, campaignId } : { leadId };
                const res = await fetch('/api/agents/outreach-email', { 
                    method: 'POST', 
                    body: JSON.stringify(payload) 
                });
                if (!res.ok) {
                    const error = await res.json();
                    throw new Error(error.error || "Failed to generate email");
                }
                window.location.reload();
            } catch (error: any) {
                alert(error.message);
                setIsLoading(false);
            }
        }} className="flex flex-col items-center gap-3 w-full max-w-sm">
            
            {campaigns.length > 0 && (
                <div className="w-full text-left">
                    <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Campaign Context (Optional)</label>
                    <select name="campaignId" className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg p-2.5 text-sm focus:ring-primary/50 text-white outline-none appearance-none cursor-pointer hover:border-white/20 transition-colors">
                        <option value="">General Outreach (No Campaign)</option>
                        {campaigns.map(c => (
                            <option key={c._id} value={c._id}>{c.title}</option>
                        ))}
                    </select>
                </div>
            )}

            <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
            >
                {isLoading ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin"/> Generating...</span> : "Start Email Thread"}
            </button>
        </form>
    );
}

export function SimulateLeadReplyForm({ leadId }: { leadId: string }) {
    const [isLoading, setIsLoading] = useState(false);
    const [replyBody, setReplyBody] = useState("");

    return (
        <form onSubmit={async (e) => {
            e.preventDefault();
            if (!replyBody.trim()) return;
            
            setIsLoading(true);
            try {
                const res = await fetch('/api/agents/email-reply', { 
                    method: 'POST', 
                    body: JSON.stringify({ leadId, replyBody }) 
                });
                if (!res.ok) {
                    const error = await res.json();
                    throw new Error(error.error || "Failed to process reply");
                }
                window.location.reload();
            } catch (error: any) {
                alert(error.message);
                setIsLoading(false);
            }
        }} className="flex flex-col items-center gap-3 w-full mt-6">
            <div className="w-full text-left">
                <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Simulate Lead Reply</label>
                <textarea 
                    value={replyBody}
                    onChange={(e) => setReplyBody(e.target.value)}
                    placeholder="Paste the lead's email reply here..."
                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg p-3 text-sm focus:ring-primary/50 text-white outline-none min-h-[100px] resize-y"
                    required
                />
            </div>

            <button 
                type="submit" 
                disabled={isLoading || !replyBody.trim()}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center gap-2"
            >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin"/> : <MessageSquare className="w-4 h-4" />}
                {isLoading ? "Analyzing & Drafting Reply..." : "Log Reply & Generate Next Response"}
            </button>
        </form>
    );
}
