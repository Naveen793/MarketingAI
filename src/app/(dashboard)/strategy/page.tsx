import connectToDatabase from "@/lib/mongodb";
import { auth } from "@/auth";
import { MarketingPlan } from "@/models/MarketingPlan";
import { Company } from "@/models/Company";
import Link from "next/link";
import { Plus, Target, CalendarDays, ArrowRight } from "lucide-react";
import NewCampaignButton from "./NewCampaignButton";
import DeleteCampaignButton from "./DeleteCampaignButton";

export default async function StrategyHubPage() {
    await connectToDatabase();

    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        return <div>Please log in</div>;
    }

    const companies = await Company.find({ userId }).select('_id companyName').lean();
    
    const defaultCompany = companies[0];
    const companyIds = companies.map(c => c._id.toString());
    
    const plans = await MarketingPlan.find({ companyId: { $in: companyIds } }).sort({ createdAt: -1 }).lean();

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Marketing Campaigns</h1>
                    <p className="text-muted-foreground mt-1">Manage and generate new marketing strategies for your business.</p>
                </div>

                {defaultCompany ? (
                   <NewCampaignButton />
                ) : (
                    <Link href="/onboarding" className="bg-primary hover:bg-primary/90 text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                        <Plus className="w-4 h-4" />
                        Setup Company First
                    </Link>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map((plan: any) => {
                    const company = companies.find(c => c._id.toString() === plan.companyId.toString());
                    return (
                        <Link key={plan._id.toString()} href={`/strategy/${plan._id}`} className="block group">
                            <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all hover:border-primary/30 h-full flex flex-col">
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                            <Target className="w-5 h-5" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-medium bg-secondary text-secondary-foreground px-2 py-1 rounded-md">
                                                {plan.focus || 'General Strategy'}
                                            </span>
                                            <div>
                                                <DeleteCampaignButton planId={plan._id.toString()} />
                                            </div>
                                        </div>
                                    </div>
                                    <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                                        {plan.name || `${company?.companyName || 'Company'} Campaign`}
                                    </h3>
                                    <p className="text-sm text-muted-foreground flex items-center gap-2 mt-2">
                                        <CalendarDays className="w-4 h-4" />
                                        {new Date(plan.generatedAt || plan.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="mt-6 flex items-center text-sm font-medium text-primary">
                                    View Strategy Details <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    )
                })}
            </div>

            {plans.length === 0 && (
                <div className="text-center py-12 border border-dashed border-border rounded-xl bg-accent/30">
                    <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium">No active campaigns</h3>
                    <p className="text-muted-foreground mt-1 mb-4">You haven't generated any marketing strategies yet.</p>
                </div>
            )}
        </div>
    );
}
