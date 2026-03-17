import connectToDatabase from "@/lib/mongodb";
import { MarketingPlan } from "@/models/MarketingPlan";
import { Company } from "@/models/Company";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, BarChart, Bot } from "lucide-react";
import TimelineTracker from "./TimelineTracker";
import { StrategyChat } from "@/components/dashboard/StrategyChat";
import { SocialPostGenerator } from "@/components/dashboard/SocialPostGenerator";
import { EmailSequenceChat } from "@/components/dashboard/EmailSequenceChat";

export default async function StrategyDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const planId = resolvedParams.id;

    await connectToDatabase();
    let plan = null;
    try {
        plan = await MarketingPlan.findById(planId).lean();
    } catch {
        // Invalid ID format
    }
    
    if (!plan) {
        redirect("/strategy");
    }

    // Convert Mongoose ObjectIds to plain strings/objects to avoid Next.js serialization warnings
    const safePlan = JSON.parse(JSON.stringify(plan));

    const company = await Company.findById(plan.companyId).lean();
    if (!company) {
        redirect("/strategy");
    }

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            <div className="flex items-center gap-4">
                <Link href="/strategy" className="p-2 hover:bg-accent rounded-full transition-colors text-muted-foreground">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Strategy: {company.companyName}</h1>
                    <p className="text-muted-foreground mt-2">
                        {plan.focus ? `Focus: ${plan.focus}` : "General Go-to-Market Plan"} • Generated on {new Date(plan.generatedAt || plan.createdAt).toLocaleDateString()}
                    </p>
                </div>
            </div>

            <Tabs defaultValue="timeline" className="w-full">
                <TabsList className="w-full justify-start border-b border-border mb-6 flex-wrap h-auto bg-transparent p-0 rounded-none gap-4">
                    <TabsTrigger value="timeline" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent shadow-none px-2 py-3 font-semibold text-primary flex items-center gap-2">
                        <BarChart className="w-4 h-4" />
                        Analytics & Execution
                    </TabsTrigger>
                    <TabsTrigger value="google-ads" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent shadow-none px-2 py-3">Google Ads</TabsTrigger>
                    <TabsTrigger value="meta-ads" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent shadow-none px-2 py-3">Meta Ads</TabsTrigger>
                    <TabsTrigger value="social" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent shadow-none px-2 py-3">Organic Social</TabsTrigger>
                    <TabsTrigger value="email" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent shadow-none px-2 py-3">Email Sequences</TabsTrigger>
                    <TabsTrigger value="sms" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent shadow-none px-2 py-3">SMS Scripts</TabsTrigger>
                    <TabsTrigger value="geni" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent shadow-none px-2 py-3 font-semibold text-primary flex items-center gap-2"><Bot className="w-4 h-4" /> Marketing Geni</TabsTrigger>
                </TabsList>

                <TabsContent value="google-ads" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card>
                            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Monthly Budget</CardTitle></CardHeader>
                            <CardContent><div className="text-2xl font-bold">${plan.paidMedia.googleAds.monthlyBudget}</div></CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Est. Clicks</CardTitle></CardHeader>
                            <CardContent><div className="text-2xl font-bold">{plan.paidMedia.googleAds.estimatedMonthlyClicks}</div></CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Est. Conversions</CardTitle></CardHeader>
                            <CardContent><div className="text-2xl font-bold">{plan.paidMedia.googleAds.estimatedConversions}</div></CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Avg CPC</CardTitle></CardHeader>
                            <CardContent><div className="text-2xl font-bold">${plan.paidMedia.googleAds.estimatedCPC}</div></CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Keywords List</CardTitle>
                                <CardDescription>Target keywords for Search campaigns</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {plan.paidMedia.googleAds.keywords.map((kw: string) => (
                                        <span key={kw} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">{kw}</span>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Ad Copy Ideas</CardTitle>
                                <CardDescription>Winning creative combinations</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {plan.paidMedia.googleAds.adCopyIdeas.map((ad: any, i: number) => (
                                    <div key={i} className="bg-accent/50 p-4 rounded-lg border border-border">
                                        <p className="font-semibold text-primary">{ad.headline}</p>
                                        <p className="text-sm text-muted-foreground mt-1">{ad.description}</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="meta-ads" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card>
                            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Monthly Budget</CardTitle></CardHeader>
                            <CardContent><div className="text-2xl font-bold">${plan.paidMedia?.metaAds?.monthlyBudget || 0}</div></CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Est. Reach</CardTitle></CardHeader>
                            <CardContent><div className="text-2xl font-bold">{plan.paidMedia?.metaAds?.estimatedReach?.toLocaleString() || "0"}</div></CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Avg. CPM</CardTitle></CardHeader>
                            <CardContent><div className="text-2xl font-bold">${plan.paidMedia?.metaAds?.estimatedCPM || "0"}</div></CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Ad Formats</CardTitle></CardHeader>
                            <CardContent>
                                <div className="text-lg font-semibold">{plan.paidMedia?.metaAds?.adFormats?.join(", ") || "Mixed"}</div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Audience Targeting</CardTitle>
                                <CardDescription>Demographics, lookalikes, and core interests</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-semibold text-primary mb-1">Demographics</h4>
                                    <p className="text-sm">{plan.paidMedia?.metaAds?.audienceTargeting?.demographics || "N/A"}</p>
                                </div>
                                {plan.paidMedia?.metaAds?.audienceTargeting?.lookalike && (
                                    <div>
                                        <h4 className="text-sm font-semibold text-primary mb-1">Lookalike</h4>
                                        <p className="text-sm">{plan.paidMedia.metaAds.audienceTargeting.lookalike}</p>
                                    </div>
                                )}
                                <div>
                                    <h4 className="text-sm font-semibold text-primary mb-2">Interests</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {plan.paidMedia?.metaAds?.audienceTargeting?.interests?.map((interest: string) => (
                                            <span key={interest} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">{interest}</span>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Creative Ideas</CardTitle>
                                <CardDescription>Winning ad concepts for Reels, Carousels, and Images</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {plan.paidMedia?.metaAds?.creativeIdeas?.map((idea: string, i: number) => (
                                    <div key={i} className="bg-accent/50 p-4 rounded-lg flex gap-3 items-start border border-border">
                                        <div className="bg-primary/20 text-primary w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">{i+1}</div>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{idea}</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="social">
                    <Card>
                        <CardHeader><CardTitle>Instagram Content Ideas</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            {safePlan.social.instagram.contentIdeas.map((idea: any, i: number) => (
                                <SocialPostGenerator 
                                    key={i} 
                                    concept={idea.concept} 
                                    format={idea.format} 
                                    target={idea.target} 
                                    companyName={company.companyName} 
                                />
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="email">
                    <Card>
                        <CardHeader><CardTitle>Email Sequences</CardTitle></CardHeader>
                        <CardContent className="space-y-6">
                            {plan.emailScripts.map((script: any, i: number) => (
                                <div key={i} className="border border-border rounded-lg overflow-hidden">
                                    <div className="bg-accent/50 px-4 py-2 border-b border-border flex justify-between items-center">
                                        <span className="text-sm font-medium uppercase text-muted-foreground">{script.purpose}</span>
                                        <span className="font-semibold">{script.subject}</span>
                                    </div>
                                    <div className="p-4 bg-background text-sm whitespace-pre-wrap">
                                        {script.body}
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <EmailSequenceChat 
                        companyName={company.companyName} 
                        targetAudience={company.targetAudience} 
                        productFocus={company.productsToSell.map((p: any) => p.name).join(", ")}
                    />
                </TabsContent>

                <TabsContent value="sms">
                    <Card>
                        <CardHeader><CardTitle>SMS Scritps</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            {plan.smsScripts.map((script: any, i: number) => (
                                <div key={i} className="bg-accent/50 p-4 rounded-lg border border-border">
                                    <div className="text-sm font-medium text-primary mb-2 uppercase">{script.purpose}</div>
                                    <div className="text-sm">{script.message}</div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="timeline">
                    <Card>
                        <CardHeader>
                            <CardTitle>Analytics & Execution</CardTitle>
                            <CardDescription>Track your campaign progress and visual step-by-step flow</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <TimelineTracker plan={safePlan} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="geni">
                    {/* The specialized AI Strategy interaction tab */}
                    <StrategyChat planId={planId} companyName={company.companyName} />
                </TabsContent>

            </Tabs>
        </div>
    );
}
