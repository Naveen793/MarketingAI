import connectToDatabase from "@/lib/mongodb";
import { Lead } from "@/models/Lead";
import { EmailThread } from "@/models/EmailThread";
import { Company } from "@/models/Company"; // Added Company import
import { MarketingPlan } from "@/models/MarketingPlan"; // Added MarketingPlan import
import { auth } from "@/auth"; // Added auth import
import { redirect, notFound } from "next/navigation"; // Added notFound import
import { CheckCircle2, Mail, Phone, Building2, User, Clock, Send, Bot } from "lucide-react";
import { GenerateCallScriptForm, LogCallDebriefForm, DraftCustomEmailForm, GenerateOutreachEmailForm, SimulateLeadReplyForm } from "@/components/dashboard/LeadForms";
import { LeadStatusDropdown } from "@/components/dashboard/LeadStatusDropdown";

export default async function LeadProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    await connectToDatabase();

    const session = await auth();
    const userId = session?.user?.id;

    const lead = await Lead.findById(resolvedParams.id).lean() as any; // Modified lead retrieval and cast
    if (!lead) notFound(); // Changed redirect to notFound

    // Retrieve all of the user's companies to get all active campaigns
    const userCompanies = await Company.find({ userId }).select('_id').lean();
    const userCompanyIds = userCompanies.map(c => c._id.toString());

    // If no userId (e.g. demo mode fallback), just find all campaigns
    const campaignQuery = userId && userCompanyIds.length > 0 
        ? { companyId: { $in: userCompanyIds } } 
        : {};

    const company = await Company.findById(lead.companyId).lean(); // Added company retrieval
    const threads = await EmailThread.find({ leadId: lead._id.toString() } as any).sort({ sentAt: 1 }).lean(); // Modified threads retrieval and cast
    
    const companyNamesById: Record<string, string> = {};
    for (const c of userCompanies) {
        companyNamesById[c._id.toString()] = (c as any).companyName || 'Company';
    }

    // Fetch all Marketing Plans (referred to as Campaigns in UI) across the user's account
    const plans = await MarketingPlan.find(campaignQuery as any).sort({ createdAt: -1 }).select('name focus _id companyId').lean() as any[];
    
    const formattedCampaigns = plans.map(p => ({
        _id: p._id.toString(),
        title: p.name || `${companyNamesById[p.companyId] || 'Company'} Campaign`
    }));

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'new': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'contacted': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'replied': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
            case 'objection': return 'bg-red-500/10 text-red-500 border-red-500/20';
            case 'call_scheduled': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'closed_won': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'closed_lost': return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
            default: return 'bg-accent text-accent-foreground border-border';
        }
    };

    const getStatusLabel = (status: string) => {
        return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const pendingDrafts = threads.filter(t => t.direction === 'outbound' && lead.status === 'new');

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header Profile Card */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-muted-foreground">
                        <User className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">{lead.pocName}</h1>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1"><Building2 className="w-4 h-4" /> {lead.leadCompanyName}</span>
                            <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {lead.pocEmail}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${getStatusColor(lead.status)}`}>
                        {getStatusLabel(lead.status)}
                    </span>
                    <div className="flex items-center gap-2 mt-2">
                        <LeadStatusDropdown leadId={lead._id.toString()} currentStatus={lead.status} />
                        {lead.status === 'replied' || lead.status === 'objection' ? (
                            <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all">
                                <CheckCircle2 className="w-4 h-4" /> Prep for Call
                            </button>
                        ) : null}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Col: Threads */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Mail className="w-5 h-5 text-primary" />
                        Email Thread
                    </h2>

                    <div className="space-y-4">
                        {threads.map((msg: any) => {
                            const isDraft = msg.direction === 'outbound' && lead.status === 'new';
                            return (
                                <div key={msg._id.toString()} className={`bg-card border rounded-xl overflow-hidden shadow-sm ${msg.direction === 'inbound' ? 'border-l-4 border-l-purple-500 border-y-border border-r-border' : 'border-border'}`}>

                                    <div className="bg-accent/30 px-4 py-3 border-b border-border flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            {msg.direction === 'outbound' ? (
                                                <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1">
                                                    <Bot className="w-3 h-3" /> Sent by AI
                                                </span>
                                            ) : (
                                                <span className="bg-purple-500/20 text-purple-500 px-2 py-0.5 rounded text-xs font-medium">
                                                    Lead Reply
                                                </span>
                                            )}
                                            <span className="font-semibold text-sm">{msg.subject}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            {msg.sentiment && msg.sentiment !== 'neutral' && (
                                                <span className="bg-card border border-border px-2 py-0.5 rounded uppercase tracking-wider">
                                                    {msg.sentiment}
                                                </span>
                                            )}
                                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(msg.sentAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <div className="p-4 text-sm whitespace-pre-wrap">
                                        {msg.body}
                                    </div>

                                    {isDraft && (
                                        <div className="bg-blue-500/5 p-3 border-t border-border flex justify-between items-center">
                                            <span className="text-xs text-blue-500 font-medium">✨ AI mapped value prop successfully. Needs your approval to send.</span>
                                            {/* Interactive form to send via our server action api */}
                                            <form action="/api/emails/send" method="POST">
                                                <input type="hidden" name="threadId" value={msg._id.toString()} />
                                                <input type="hidden" name="leadId" value={lead._id.toString()} />
                                                <button type="submit" className="bg-primary hover:bg-primary/90 text-white px-4 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
                                                    <Send className="w-4 h-4" /> Approve & Send
                                                </button>
                                            </form>
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {threads.length === 0 && (
                            <div className="text-center p-8 bg-card border border-border rounded-xl flex flex-col items-center justify-center gap-4">
                                <p className="text-muted-foreground text-sm">No emails yet. Was the AI unable to draft one? Wait a moment or check logs.</p>
                                <GenerateOutreachEmailForm leadId={lead._id.toString()} campaigns={formattedCampaigns} />
                            </div>
                        )}

                        {threads.length > 0 && (
                            <div className="mt-8 border-t border-border pt-6">
                                <SimulateLeadReplyForm leadId={lead._id.toString()} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Col: Details & Scripter */}
                <div className="space-y-6">
                    <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
                        <h3 className="font-semibold border-b border-border pb-2">Lead Information</h3>
                        <div className="space-y-3 text-sm">
                            <div>
                                <span className="text-muted-foreground block text-xs uppercase mb-0.5">Industry</span>
                                <p className="font-medium">{lead.industry}</p>
                            </div>
                            {lead.notes && (
                                <div>
                                    <span className="text-muted-foreground block text-xs uppercase mb-0.5">Context / Notes</span>
                                    <p className="bg-accent/50 p-2 rounded-md italic">{lead.notes}</p>
                                </div>
                            )}
                            <div>
                                <span className="text-muted-foreground block text-xs uppercase mb-0.5">Created At</span>
                                <p>{new Date(lead.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>

                    {lead.callScript ? (
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5 shadow-sm space-y-4">
                            <h3 className="font-semibold text-emerald-600 border-b border-emerald-500/20 pb-2">AI Call Script</h3>
                            <div className="text-sm prose prose-sm dark:prose-invert max-w-none max-h-96 overflow-y-auto whitespace-pre-wrap">
                                {/* Without react-markdown installed yet, we just render as text. In production we'd use react-markdown here */}
                                {lead.callScript}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5 shadow-sm space-y-4">
                            <h3 className="font-semibold text-emerald-600 border-b border-emerald-500/20 pb-2">Prep for Call</h3>
                            <p className="text-sm text-emerald-600/80">Generate a custom script based on the email history.</p>
                            <GenerateCallScriptForm leadId={lead._id.toString()} />
                        </div>
                    )}

                    {/* Custom Email / Action Item Generator */}
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-5 shadow-sm space-y-4 mt-6">
                        <h3 className="font-semibold text-purple-600 border-b border-purple-500/20 pb-2">Draft Custom Reply</h3>
                        <p className="text-sm text-purple-600/80">Instruct the AI to write a highly contextual response for this lead.</p>
                        <DraftCustomEmailForm leadId={lead._id.toString()} />
                    </div>

                    {/* Post-Call Debrief Form */}
                    {lead.status === 'call_scheduled' && (
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-5 shadow-sm space-y-4 mt-6">
                            <h3 className="font-semibold text-blue-600 border-b border-blue-500/20 pb-2">Log Call Debrief</h3>
                            <LogCallDebriefForm leadId={lead._id.toString()} />
                        </div>
                    )}

                    {/* Render Debrief History */}
                    {lead.callDebriefHistory && lead.callDebriefHistory.length > 0 && (
                        <div className="space-y-4 mt-6">
                            <h3 className="font-semibold text-muted-foreground uppercase text-xs tracking-wider">Analysis History</h3>
                            {lead.callDebriefHistory.map((debrief: any, i: number) => (
                                <div key={i} className="bg-card border border-border rounded-lg p-4 text-sm space-y-3 shadow-sm">
                                    <div className="flex justify-between items-center text-xs text-muted-foreground border-b border-border pb-2">
                                        <span>{new Date(debrief.date).toLocaleDateString()}</span>
                                        <span className="bg-primary/10 text-primary px-2 py-0.5 rounded font-medium">{lead.closingRecommendation}</span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-xs uppercase text-muted-foreground mb-1 block">Summary</span>
                                        <p>{debrief.summary}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-xs uppercase text-muted-foreground mb-1 block">Next Steps</span>
                                        <p className="whitespace-pre-wrap">{debrief.nextSteps}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
