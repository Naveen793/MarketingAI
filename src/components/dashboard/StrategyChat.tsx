"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

export function StrategyChat({ planId, companyName }: { planId: string, companyName: string }) {
    const [messages, setMessages] = useState<{role: 'user' | 'model', parts: [{ text: string }] }[]>([
        { role: 'model', parts: [{ text: `Hi! I'm Marketing Geni. I've analyzed the strategy for **${companyName}**. What would you like to know or adjust?` }] }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const endOfMessagesRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = input.trim();
        setInput("");
        
        // Append user message to UI
        const newMessages = [...messages, { role: 'user' as const, parts: [{ text: userMsg }] as [{ text: string }] }];
        setMessages(newMessages);
        setIsLoading(true);

        try {
            // Drop the initial welcome message from the history sent to the API if it's not strictly necessary,
            // or send the entire history minus the new message for context.
            const historyForApi = messages.map(msg => ({
                role: msg.role,
                parts: msg.parts
            })).filter((msg, idx) => idx !== 0); // Remove the hardcoded welcome to avoid context confusion, though Gemini handles it fine usually.

            const res = await fetch(`/api/agents/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    planId,
                    history: historyForApi,
                    message: userMsg
                })
            });

            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.error || "Failed to fetch response");
            }

            setMessages(prev => [...prev, { role: 'model', parts: [{ text: data.response }] }]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'model', parts: [{ text: "Sorry, I ran into an error processing your request. Please try again." }] }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-[#121212] border border-white/5 rounded-3xl h-[600px] flex flex-col overflow-hidden relative shadow-xl">
            {/* Ambient Background glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-[80px] pointer-events-none" />

            {/* Header */}
            <div className="border-b border-white/5 p-4 flex items-center gap-3 bg-black/20 backdrop-blur-md z-10">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 shadow-[0_0_15px_rgba(124,58,237,0.3)]">
                    <Bot className="w-5 h-5 text-primary" />
                </div>
                <div>
                    <h3 className="font-bold text-white leading-tight">Marketing Geni</h3>
                    <p className="text-xs text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Online & analyzing strategy
                    </p>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 z-10">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'model' && (
                            <div className="w-8 h-8 rounded-full bg-primary/20 shrink-0 flex items-center justify-center border border-primary/20 mt-1">
                                <Bot className="w-4 h-4 text-primary" />
                            </div>
                        )}
                        
                        <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-4 text-sm ${msg.role === 'user' ? 'bg-primary text-white rounded-br-sm' : 'bg-[#1A1A1A] border border-white/5 text-gray-200 rounded-bl-sm shadow-md'}`}>
                            {msg.role === 'user' ? (
                                <p className="whitespace-pre-wrap">{msg.parts[0].text}</p>
                            ) : (
                                <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10 prose-a:text-primary">
                                    <ReactMarkdown>{msg.parts[0].text}</ReactMarkdown>
                                </div>
                            )}
                        </div>

                        {msg.role === 'user' && (
                            <div className="w-8 h-8 rounded-full bg-white/10 shrink-0 flex items-center justify-center border border-white/10 mt-1">
                                <User className="w-4 h-4 text-white" />
                            </div>
                        )}
                    </div>
                ))}
                
                {isLoading && (
                    <div className="flex gap-3 justify-start">
                        <div className="w-8 h-8 rounded-full bg-primary/20 shrink-0 flex items-center justify-center border border-primary/20">
                            <Bot className="w-4 h-4 text-primary" />
                        </div>
                        <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-4 rounded-bl-sm flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </div>
                )}
                <div ref={endOfMessagesRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/5 bg-black/20 backdrop-blur-md z-10">
                <form onSubmit={handleSend} className="relative flex items-center">
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask Geni about your targeted audience, budget, or request new ad copy..."
                        className="w-full bg-[#1A1A1A] border border-white/10 rounded-full pl-6 pr-14 py-3.5 text-sm text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground"
                        disabled={isLoading}
                    />
                    <button 
                        type="submit" 
                        disabled={!input.trim() || isLoading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_10px_rgba(124,58,237,0.3)]"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 translate-x-[-1px] translate-y-[1px]" />}
                    </button>
                </form>
                <div className="text-center mt-2 text-[10px] text-muted-foreground">
                    Marketing Geni can make mistakes. Verify important budget and strategy outputs.
                </div>
            </div>
        </div>
    );
}
