import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMarketingPlan extends Document {
    companyId: string;
    name?: string;
    focus?: string;
    createdAt: Date;
    updatedAt: Date;
    social: {
        instagram: {
            postsPerWeek: string;
            reelsPerWeek: string;
            contentIdeas: { id: string; concept: string; format: string; target: string }[];
            captionTemplates: string[];
            hashtagSets: string[];
        };
        facebook: {
            postsPerWeek: string;
            adStrategy: string;
            audienceTargeting: string;
            adCopyIdeas: { headline: string; description: string }[];
        };
        linkedin: {
            postsPerWeek: string;
            outreachStrategy: string;
            postIdeas: { id: string; concept: string }[];
        };
        other: { platform: string; strategy: string }[];
    };
    emailScripts: { purpose: string; subject: string; body: string }[];
    smsScripts: { purpose: string; message: string }[];
    paidMedia: {
        totalMonthlyBudgetRecommended: number;
        googleAds: {
            monthlyBudget: number;
            campaignTypes: string[];
            keywords: string[];
            negativeKeywords: string[];
            estimatedCPC: number;
            estimatedMonthlyClicks: number;
            estimatedConversions: number;
            adCopyIdeas: { headline: string; description: string }[];
            landingPageRecommendations: string;
        };
        metaAds: {
            monthlyBudget: number;
            audienceTargeting: { interests: string[]; demographics: string; lookalike: string };
            adFormats: string[];
            estimatedReach: number;
            estimatedCPM: number;
            creativeIdeas: string[];
        };
        otherChannels: { channel: string; monthlyBudget: number; strategy: string; estimatedROI: string }[];
    };
    contentCalendar: { week: string; tasks: { title: string; explanation: string; completed: boolean }[] }[];
    generatedAt: Date;
}

const MarketingPlanSchema = new Schema<IMarketingPlan>(
    {
        companyId: { type: String, required: true },
        name: String,
        focus: String,
        social: {
            instagram: {
                postsPerWeek: String,
                reelsPerWeek: String,
                contentIdeas: [{ id: String, concept: String, format: String, target: String }],
                captionTemplates: [String],
                hashtagSets: [String],
            },
            facebook: {
                postsPerWeek: String,
                adStrategy: String,
                audienceTargeting: String,
                adCopyIdeas: [{ headline: String, description: String }],
            },
            linkedin: {
                postsPerWeek: String,
                outreachStrategy: String,
                postIdeas: [{ id: String, concept: String }],
            },
            other: [{ platform: String, strategy: String }],
        },
        emailScripts: [{ purpose: String, subject: String, body: String }],
        smsScripts: [{ purpose: String, message: String }],
        paidMedia: {
            totalMonthlyBudgetRecommended: Number,
            googleAds: {
                monthlyBudget: Number,
                campaignTypes: [String],
                keywords: [String],
                negativeKeywords: [String],
                estimatedCPC: Number,
                estimatedMonthlyClicks: Number,
                estimatedConversions: Number,
                adCopyIdeas: [{ headline: String, description: String }],
                landingPageRecommendations: String,
            },
            metaAds: {
                monthlyBudget: Number,
                audienceTargeting: { interests: [String], demographics: String, lookalike: String },
                adFormats: [String],
                estimatedReach: Number,
                estimatedCPM: Number,
                creativeIdeas: [String],
            },
            otherChannels: [{ channel: String, monthlyBudget: Number, strategy: String, estimatedROI: String }],
        },
        contentCalendar: [{ 
            week: String, 
            tasks: [{ title: String, explanation: String, completed: { type: Boolean, default: false } }] 
        }],
        generatedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

export const MarketingPlan: Model<IMarketingPlan> =
    mongoose.models.MarketingPlan || mongoose.model<IMarketingPlan>('MarketingPlan', MarketingPlanSchema);
