import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILead extends Document {
    companyId: string;
    pocName: string;
    pocEmail: string;
    pocPhone?: string;
    leadCompanyName: string;
    industry: string;
    notes?: string;
    status: 'new' | 'contacted' | 'replied' | 'objection' | 'call_scheduled' | 'closed_won' | 'closed_lost';
    callScript?: string;
    callDebriefHistory: { summary: string; nextSteps: string; date: Date }[];
    closingRecommendation?: string;
    createdAt: Date;
    updatedAt: Date;
}

const LeadSchema = new Schema<ILead>(
    {
        companyId: { type: String, required: true },
        pocName: { type: String, required: true },
        pocEmail: { type: String, required: true },
        pocPhone: { type: String },
        leadCompanyName: { type: String, required: true },
        industry: { type: String, required: true },
        notes: { type: String },
        status: {
            type: String,
            enum: ['new', 'contacted', 'replied', 'objection', 'call_scheduled', 'closed_won', 'closed_lost'],
            default: 'new',
        },
        callScript: { type: String },
        callDebriefHistory: [
            {
                summary: String,
                nextSteps: String,
                date: { type: Date, default: Date.now },
            },
        ],
        closingRecommendation: { type: String },
    },
    { timestamps: true }
);

export const Lead: Model<ILead> = mongoose.models.Lead || mongoose.model<ILead>('Lead', LeadSchema);
