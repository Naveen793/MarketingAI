import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICampaignGoal extends Document {
    companyId: string;
    title: string;
    description: string;
    category: 'revenue' | 'leads' | 'social' | 'ads' | 'email';
    targetValue: number;
    currentValue: number;
    unit: string;
    deadline: Date;
    milestones: { label: string; targetValue: number; dueDate: Date; achieved: boolean }[];
    status: 'on_track' | 'at_risk' | 'completed' | 'missed';
    createdAt: Date;
    updatedAt: Date;
}

const CampaignGoalSchema = new Schema<ICampaignGoal>(
    {
        companyId: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String },
        category: {
            type: String,
            enum: ['revenue', 'leads', 'social', 'ads', 'email'],
            required: true,
        },
        targetValue: { type: Number, required: true },
        currentValue: { type: Number, default: 0 },
        unit: { type: String, required: true }, // e.g. '₹', 'leads', 'followers'
        deadline: { type: Date, required: true },
        milestones: [
            {
                label: String,
                targetValue: Number,
                dueDate: Date,
                achieved: { type: Boolean, default: false },
            },
        ],
        status: {
            type: String,
            enum: ['on_track', 'at_risk', 'completed', 'missed'],
            default: 'on_track',
        },
    },
    { timestamps: true }
);

export const CampaignGoal: Model<ICampaignGoal> =
    mongoose.models.CampaignGoal || mongoose.model<ICampaignGoal>('CampaignGoal', CampaignGoalSchema);
