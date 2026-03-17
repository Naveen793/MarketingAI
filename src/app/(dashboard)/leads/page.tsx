import connectToDatabase from "@/lib/mongodb";
import { Lead } from "@/models/Lead";
import Link from "next/link";
import { Search, Mail, Phone, Building2, MoreHorizontal } from "lucide-react";
import { AddLeadModal } from "@/components/dashboard/AddLeadModal";

export default async function LeadsPage() {
    await connectToDatabase();

    // In production, filter by companyId/userId
    const leads = await Lead.find().sort({ createdAt: -1 }).lean();

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'new': return 'bg-blue-500/10 text-blue-500';
            case 'contacted': return 'bg-amber-500/10 text-amber-500';
            case 'replied': return 'bg-purple-500/10 text-purple-500';
            case 'objection': return 'bg-red-500/10 text-red-500';
            case 'call_scheduled': return 'bg-emerald-500/10 text-emerald-500';
            case 'closed_won': return 'bg-green-500/10 text-green-500 bg-green-500/20';
            case 'closed_lost': return 'bg-gray-500/10 text-gray-500';
            default: return 'bg-accent text-accent-foreground';
        }
    };

    const getStatusLabel = (status: string) => {
        return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Lead Management</h1>
                    <p className="text-muted-foreground mt-1">Track and nurture your prospects with AI agents.</p>
                </div>

                {/* Interactive Add Lead Dialog */}
                <AddLeadModal />
            </div>

            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b border-border flex items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search leads by name, company, or email..."
                            className="w-full bg-accent/50 border border-border rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-muted-foreground uppercase bg-accent/50 border-b border-border">
                            <tr>
                                <th className="px-6 py-4 font-medium">Contact File</th>
                                <th className="px-6 py-4 font-medium">Company</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {leads.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                                        No leads found. Set up your first prospect to let the AI draft outreach.
                                    </td>
                                </tr>
                            ) : (
                                leads.map((lead: any) => (
                                    <tr key={lead._id.toString()} className="hover:bg-accent/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-foreground">{lead.pocName}</div>
                                            <div className="flex items-center gap-3 mt-1 text-muted-foreground text-xs">
                                                <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {lead.pocEmail}</span>
                                                {lead.pocPhone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {lead.pocPhone}</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Building2 className="w-4 h-4 text-muted-foreground" />
                                                <span className="font-medium">{lead.leadCompanyName}</span>
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-1">{lead.industry}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${getStatusColor(lead.status)}`}>
                                                {getStatusLabel(lead.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link href={`/leads/${lead._id}`} className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
