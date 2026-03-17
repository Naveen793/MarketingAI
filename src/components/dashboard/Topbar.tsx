"use client";
import { Bell, Search, Hexagon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function Topbar() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    return (
        <header className="h-16 border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-30 flex items-center justify-between px-6">
            <div className="flex items-center gap-4 flex-1">
                <div className="relative w-full max-w-sm hidden md:flex items-center">
                    <Search className="w-4 h-4 absolute left-3 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search leads, campaigns..."
                        className="w-full bg-accent/50 border-none rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                    />
                </div>
            </div>
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-accent transition-colors"
                    title="Toggle theme"
                >
                    {mounted && theme === "dark" ? (
                        <Hexagon className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    ) : (
                        <Hexagon className="w-5 h-5" />
                    )}
                </button>
                <button className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-accent transition-colors">
                    <Bell className="w-5 h-5 text-muted-foreground" />
                    <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-primary ring-2 ring-card" />
                </button>
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-blue-500 overflow-hidden border border-border flex items-center justify-center text-white font-medium text-sm shadow-sm cursor-pointer">
                    GP
                </div>
            </div>
        </header>
    );
}
