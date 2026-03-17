"use client";

import { useState } from "react";
import { Loader2, Send, Mail, Copy, CheckCircle2 } from "lucide-react";

interface EmailSequenceChatProps {
    companyName: string;
    targetAudience: string;
    productFocus: string;
}

export function EmailSequenceChat({ companyName, targetAudience, productFocus }: EmailSequenceChatProps) {
    const [prompt, setPrompt] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [generatedEmail, setGeneratedEmail] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setIsLoading(true);
        setGeneratedEmail(null);
        setCopied(false);

        try {
            const res = await fetch("/api/agents/draft-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    message: `Draft an email response to a lead who said: "${prompt}". 
                              Make it sound professional but conversational, formatted properly as an email. 
                              Only output the email body itself, no introductory or concluding chat text.`,
                    systemContext: `You are an expert Sales Development Representative drafting emails for ${companyName}. 
                                    You sell: ${productFocus}. Your target audience is: ${targetAudience}.`
                })
            });

            if (!res.ok) throw new Error("Failed to generate email");
            
            const data = await res.json();
            setGeneratedEmail(data.response);
        } catch (error) {
            console.error("Failed to draft email", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = () => {
        if (!generatedEmail) return;
        navigator.clipboard.writeText(generatedEmail);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="border border-primary/20 bg-card rounded-xl overflow-hidden mt-8 shadow-[0_0_20px_rgba(124,58,237,0.1)]">
            <div className="bg-primary/10 p-4 border-b border-primary/20 flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-primary">Custom Draft Generator</h3>
            </div>
            
            <div className="p-4 space-y-4">
                <p className="text-sm text-muted-foreground">
                    Did a lead reply with an unexpected objection or question? Paste their response below, and the AI will draft the perfect reply.
                </p>
                
                <div className="relative">
                    <textarea 
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g. 'We don't have the budget right now, maybe next quarter?'"
                        className="w-full bg-accent/30 border border-border rounded-lg p-3 min-h-[100px] text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                    />
                    <button 
                        onClick={handleGenerate}
                        disabled={isLoading || !prompt.trim()}
                        className="absolute bottom-3 right-3 bg-primary hover:bg-primary/90 text-white p-2 rounded-md transition-colors disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </button>
                </div>
                
                {generatedEmail && (
                    <div className="mt-4 pt-4 border-t border-border animate-in fade-in slide-in-from-top-2">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-semibold text-primary uppercase tracking-wider">AI Drafted Reply</span>
                            <button 
                                onClick={handleCopy}
                                className="text-xs flex items-center gap-1 text-muted-foreground hover:text-white transition-colors"
                            >
                                {copied ? <CheckCircle2 className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                                {copied ? "Copied!" : "Copy"}
                            </button>
                        </div>
                        <div className="bg-black/40 border border-border/50 p-4 rounded-lg text-sm text-gray-300 whitespace-pre-wrap font-mono">
                            {generatedEmail}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
