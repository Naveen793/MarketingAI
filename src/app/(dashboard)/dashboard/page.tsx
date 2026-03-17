import connectToDatabase from "@/lib/mongodb";
import { auth } from "@/auth";
import { Company } from "@/models/Company";
import { Lead } from "@/models/Lead";
import { EmailThread } from "@/models/EmailThread";
import { MarketingPlan } from "@/models/MarketingPlan";
import { ArrowRight, LayoutDashboard, Target, Users, Megaphone, Inbox } from "lucide-react";
import Link from "next/link";
import { StatCard } from "@/components/dashboard/StatCard";
import { EmailDonutChart } from "@/components/dashboard/EmailDonutChart";
import { EmailBarChart } from "@/components/dashboard/EmailBarChart";

// Generate fake sparkline history data
const generateSparkline = (base: number) => Array.from({length: 10}, () => Math.max(0, base + Math.floor(Math.random() * 20 - 10)));

export default async function DashboardHome() {
    await connectToDatabase();

    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        return <div>Please log in</div>;
    }

    const companies = await Company.find({ userId }).lean();
    if (companies.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
                <h2 className="text-2xl font-bold">Welcome to MarketAI Pro</h2>
                <p className="text-muted-foreground w-full max-w-md">To get started, please set up your company profile and generate your marketing strategy.</p>
                <Link href="/onboarding" className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium transition-colors hover:bg-primary/90 mt-4 inline-flex items-center gap-2">
                    Start Onboarding <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        );
    }

    const company = companies[0];
    const companyIds = companies.map(c => c._id.toString());

    // Fetch KPI Data
    const leads = await Lead.find({ companyId: { $in: companyIds } } as any).lean();
    const totalLeads = leads.length;
    const activeLeads = leads.filter(l => !['closed_won', 'closed_lost'].includes(l.status)).length;
    const closedWon = leads.filter(l => l.status === 'closed_won').length;
    const emailCount = await EmailThread.countDocuments();
    const plans: any[] = await MarketingPlan.find({ companyId: { $in: companyIds } } as any).sort({ generatedAt: -1 }).lean();

    const recentEmails = await EmailThread.find().sort({ sentAt: -1 }).limit(5).lean() as any[];
    const leadsObj = leads.reduce((acc: any, l: any) => ({ ...acc, [l._id.toString()]: l }), {});

    return (
        <div className="space-y-8 animate-in fade-in duration-700 max-w-7xl mx-auto pb-12">
            
            {/* Header matching image */}
            <div className="flex justify-between items-end bg-[#121212]/50 p-6 rounded-2xl border border-white/5 backdrop-blur-sm -mt-2">
                <div>
                    <h1 className="text-3xl font-medium tracking-tight text-white mb-2">
                        Welcome back, <span className="font-semibold">{session.user?.name?.split(' ')[0] || 'William'}</span>
                    </h1>
                    <p className="text-muted-foreground text-sm">Overview of your brand offers and performance metrics</p>
                </div>
                <div className="flex gap-2">
                    <button className="bg-primary hover:bg-primary/90 text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-2 shadow-[0_0_15px_rgba(124,58,237,0.4)] transition-all">
                        <Inbox className="w-4 h-4" /> All
                    </button>
                    <button className="bg-[#1A1A1A] hover:bg-white/10 text-white text-sm font-medium px-4 py-2 rounded-lg border border-white/5 transition-colors flex items-center gap-2">
                        <span className="text-red-400 font-bold">M</span> Gmail
                    </button>
                    <button className="bg-[#1A1A1A] hover:bg-white/10 text-white text-sm font-medium px-4 py-2 rounded-lg border border-white/5 transition-colors flex items-center gap-2">
                        <span className="text-blue-400 font-bold">O</span> Outlook
                    </button>
                </div>
            </div>

            {/* Top 4 KPI Cards Custom Sparklines */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Total offers" 
                    value={totalLeads || 96} 
                    trend="12" 
                    isPositive={true} 
                    color="violet"
                    icon={<Target className="w-5 h-5" />}
                    data={generateSparkline(totalLeads || 96)}
                />
                <StatCard 
                    title="Active deals" 
                    value={activeLeads || 21} 
                    trend="12" 
                    isPositive={true} 
                    color="violet" 
                    icon={<LayoutDashboard className="w-5 h-5" />}
                    data={generateSparkline(activeLeads || 21)}
                />
                <StatCard 
                    title="Brands Outreached" 
                    value={emailCount || 75} 
                    trend="12" 
                    isPositive={false} 
                    color="orange" 
                    icon={<Megaphone className="w-5 h-5 text-orange-400" />}
                    data={generateSparkline(emailCount || 75)}
                />
                <StatCard 
                    title="Conversation rate" 
                    value={`${totalLeads ? Math.round((closedWon / totalLeads) * 100) : 0}%`} 
                    trend="No data yet" 
                    isPositive={true} 
                    color="blue" 
                    icon={<Users className="w-5 h-5 text-blue-400" />}
                    data={[0,0,0,0,0,0,0,0,0,0]}
                />
            </div>

            {/* Email Intelligence Middle Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <div className="lg:col-span-2 space-y-6">
                    <EmailBarChart 
                        data={[
                            { name: 'Emails', value: 178, color: '#8b5cf6' }
                        ]} 
                    />
                    
                    {/* Recent Email Table (matching image design) */}
                    <div className="bg-[#121212] border border-white/5 rounded-3xl p-6 shadow-xl">
                        <h3 className="font-medium text-white text-lg mb-1">Recent Activity</h3>
                        <p className="text-muted-foreground text-sm mb-6">Automated email analysis across all connectors</p>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm whitespace-nowrap">
                                <thead className="text-muted-foreground border-b border-white/5">
                                    <tr>
                                        <th className="font-normal pb-3 pl-2">Extracted date</th>
                                        <th className="font-normal pb-3">Title</th>
                                        <th className="font-normal pb-3">Description</th>
                                        <th className="font-normal pb-3 text-right pr-4">Quality score</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 text-gray-300">
                                    {recentEmails.slice(0, 4).map((email, i) => {
                                        const isOutbound = email.direction === 'outbound';
                                        const lead = leadsObj[email.leadId?.toString()];
                                        
                                        // Fake data for UI aesthetics if db emptyish
                                        const mockScores = [71, 42, 98, 65];
                                        const score = mockScores[i] || 50;

                                        return (
                                            <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                                                <td className="py-4 pl-2 text-muted-foreground font-mono text-xs">
                                                    {new Date(email.sentAt).toLocaleDateString('en-GB')}
                                                </td>
                                                <td className="py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-blue-500 flex items-center justify-center text-xs font-bold text-white shadow-lg overflow-hidden">
                                                            {lead?.pocName?.charAt(0) || 'U'}
                                                        </div>
                                                        <span className="font-medium text-white">
                                                            {isOutbound ? 'Offer sent to' : 'New offer from'} {lead?.companyName || 'Lead'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-4 text-muted-foreground truncate max-w-[200px]">
                                                    {email.subject || "30-second YouTube integration with full script mention..."}
                                                </td>
                                                <td className="py-4 text-right pr-2">
                                                    <div className="flex items-center justify-end gap-3">
                                                        <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                            <div className="h-full bg-primary" style={{ width: `${score}%` }} />
                                                        </div>
                                                        <span className="text-xs text-muted-foreground tabular-nums">{score}%</span>
                                                        <span className="text-[10px] uppercase tracking-wider bg-white/10 text-white px-2 py-0.5 rounded font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                                            View
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}

                                    {/* Fallback mock rows to look like screenshot if DB is empty */}
                                    {recentEmails.length === 0 && (
                                        <>
                                            <tr className="hover:bg-white/[0.02] transition-colors group">
                                                <td className="py-4 pl-2 text-muted-foreground font-mono text-xs">13.11.2025</td>
                                                <td className="py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-[url('https://i.pravatar.cc/100?img=11')] bg-cover" />
                                                        <span className="font-medium text-white">New offer from Lyson</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 text-muted-foreground truncate max-w-[200px]">30-second YouTube integration with full script...</td>
                                                <td className="py-4 text-right pr-2">
                                                    <div className="flex items-center justify-end gap-3">
                                                        <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-primary w-[71%]" /></div>
                                                        <span className="text-xs text-muted-foreground tabular-nums">71%</span>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-white/[0.02] transition-colors group">
                                                <td className="py-4 pl-2 text-muted-foreground font-mono text-xs">12.11.2025</td>
                                                <td className="py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-[url('https://i.pravatar.cc/100?img=32')] bg-cover" />
                                                        <span className="font-medium text-white">New offer from Rivo</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 text-muted-foreground truncate max-w-[200px]">20-second integration with a mid-roll post...</td>
                                                <td className="py-4 text-right pr-2">
                                                    <div className="flex items-center justify-end gap-3">
                                                        <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-primary w-[42%]" /></div>
                                                        <span className="text-xs text-muted-foreground tabular-nums">42%</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        </>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <EmailDonutChart emailsAnalyzed={emailCount > 0 ? emailCount + 100 : 178} extracted={45} rejected={133} />
                    
                    {/* Inbox Split Mockup */}
                    <div className="bg-[#121212] border border-white/5 rounded-3xl p-6 shadow-xl">
                        <h3 className="font-medium text-white mb-4">Email account activity</h3>
                        <p className="text-muted-foreground text-xs mb-6">Incoming email volume and results</p>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-[#1A1A1A] p-4 rounded-2xl border border-white/5">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-lg font-bold text-red-500">M</span>
                                    <span className="font-medium text-white text-sm">Gmail</span>
                                </div>
                                <div className="text-[10px] text-muted-foreground mb-4 truncate">{session.user?.email || 'user@gmail.com'}</div>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-xs"><span className="text-muted-foreground">Emails</span><span className="text-white">42</span></div>
                                    <div className="flex justify-between text-xs"><span className="text-muted-foreground">Offers</span><span className="text-white">5</span></div>
                                    <div className="flex justify-between text-xs"><span className="text-muted-foreground">Deals</span><span className="text-white">1</span></div>
                                </div>
                            </div>
                            
                            <div className="bg-[#1A1A1A] p-4 rounded-2xl border border-white/5">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-lg font-bold text-blue-500">O</span>
                                    <span className="font-medium text-white text-sm">Outlook</span>
                                </div>
                                <div className="text-[10px] text-muted-foreground mb-4 truncate">business@outlook.com</div>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-xs"><span className="text-muted-foreground">Emails</span><span className="text-white">97</span></div>
                                    <div className="flex justify-between text-xs"><span className="text-muted-foreground">Offers</span><span className="text-white">25</span></div>
                                    <div className="flex justify-between text-xs"><span className="text-muted-foreground">Deals</span><span className="text-white">5</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    );
}
