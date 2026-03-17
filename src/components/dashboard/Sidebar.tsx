import Link from "next/link";
import { LayoutDashboard, Users, Target, CheckCircle, Settings, LogOut } from "lucide-react";
import { signOut } from "@/auth";
import { cn } from "@/lib/utils";

const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Strategy & Onboarding", href: "/strategy", icon: Target },
    { name: "Leads", href: "/leads", icon: Users },
    { name: "Goals", href: "/goals", icon: CheckCircle },
    { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
    return (
        <aside className="w-64 border-r border-border bg-card flex flex-col h-full sticky top-0 overflow-y-auto hidden md:flex">
            <div className="h-16 flex items-center px-6 border-b border-border">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xl">
                        M
                    </div>
                    <span className="font-semibold text-lg tracking-tight">MarketAI Pro</span>
                </div>
            </div>
            <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors group",
                            "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        )}
                    >
                        <item.icon className="w-5 h-5 opacity-70 group-hover:opacity-100" />
                        {item.name}
                    </Link>
                ))}
            </nav>
            <div className="p-4 border-t border-border">
                <form action={async () => {
                    "use server";
                    await signOut();
                }}>
                    <button type="submit" className="flex w-full items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:text-red-400 transition-colors group">
                        <LogOut className="w-5 h-5 opacity-70 group-hover:opacity-100" />
                        Log out
                    </button>
                </form>
            </div>
        </aside>
    );
}
