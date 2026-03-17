"use client";

import { useState } from "react";
import { Loader2, ImagePlus, RefreshCw, CheckCircle2 } from "lucide-react";
import Image from "next/image";

interface SocialPostGeneratorProps {
    concept: string;
    format: string;
    target: string;
    companyName: string;
}

export function SocialPostGenerator({ concept, format, target, companyName }: SocialPostGeneratorProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [generatedPost, setGeneratedPost] = useState<{ caption: string; imagePrompt: string; image: string | null } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const generatePost = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/agents/create-post", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    idea: { concept, format, target }, 
                    companyName 
                })
            });

            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.error || "Failed to generate post");
            }

            setGeneratedPost(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-accent/30 p-4 border border-border rounded-lg">
                <div className="flex-1">
                    <h4 className="font-semibold text-primary">{concept}</h4>
                    <p className="text-sm text-muted-foreground mt-1">Format: {format} | Target: {target}</p>
                </div>
                {!generatedPost && (
                    <button 
                        onClick={generatePost}
                        disabled={isLoading}
                        className="whitespace-nowrap bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-[0_0_15px_rgba(124,58,237,0.3)] disabled:opacity-50 flex items-center gap-2"
                    >
                        {isLoading ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Generating with AI...</>
                        ) : (
                            <><ImagePlus className="w-4 h-4" /> Generate Post (AI)</>
                        )}
                    </button>
                )}
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {generatedPost && (
                <div className="bg-card border border-border rounded-xl overflow-hidden shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="p-4 border-b border-border flex justify-between items-center bg-accent/10">
                        <div className="flex items-center gap-2 text-sm font-medium text-purple-400">
                            <CheckCircle2 className="w-4 h-4" />
                            Nano Banana 2 Image Generated
                        </div>
                        <button 
                            onClick={generatePost}
                            disabled={isLoading}
                            className="text-xs text-muted-foreground hover:text-white flex items-center gap-1 transition-colors"
                        >
                            <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} /> Try Again
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 overflow-hidden">
                        {/* Image Preview */}
                        <div className="bg-black/50 aspect-square md:aspect-auto md:h-full min-h-[300px] flex flex-col items-center justify-center relative p-4 border-r border-border">
                            {generatedPost.image ? (
                                <div className="space-y-3 w-full h-full flex flex-col pt-4 pb-4">
                                     <div className="relative w-full h-full rounded-lg overflow-hidden ring-1 ring-white/10 shadow-2xl flex-1">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img 
                                            src={generatedPost.image} 
                                            alt={concept}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                    {generatedPost.image.includes('placehold.co') && (
                                        <div className="text-[10px] text-center text-amber-500 bg-amber-500/10 px-2 py-1.5 rounded font-medium border border-amber-500/20">
                                            ⚠️ NanoBanana 2 Rate Limited. Showing mockup.
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center p-6 space-y-3">
                                    <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto text-muted-foreground">
                                        <ImagePlus className="w-8 h-8 opacity-50" />
                                    </div>
                                    <p className="text-sm text-muted-foreground">Image generation failed entirely.</p>
                                </div>
                            )}
                        </div>

                        {/* Caption Preview */}
                        <div className="p-6 flex flex-col h-full bg-accent/5">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full shrink-0"></div>
                                <div>
                                    <div className="text-sm font-bold">{companyName}</div>
                                    <div className="text-xs text-muted-foreground">Sponsored</div>
                                </div>
                            </div>
                            
                            <div className="text-sm whitespace-pre-wrap flex-1 text-gray-200">
                                {generatedPost.caption}
                            </div>
                            
                            <div className="mt-6 pt-4 border-t border-border flex justify-end gap-3">
                                <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors">
                                    Edit Post
                                </button>
                                <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-colors">
                                    Publish
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
