import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEmailThread extends Document {
    leadId: string;
    direction: 'outbound' | 'inbound';
    subject: string;
    body: string;
    sentAt: Date;
    sentiment?: 'interested' | 'objection' | 'not_now' | 'unsubscribed' | 'neutral';
    messageId?: string; // For syncing with Resend headers
}

const EmailThreadSchema = new Schema<IEmailThread>(
    {
        leadId: { type: String, required: true },
        direction: { type: String, enum: ['outbound', 'inbound'], required: true },
        subject: { type: String, required: true },
        body: { type: String, required: true },
        sentAt: { type: Date, default: Date.now },
        sentiment: { type: String, enum: ['interested', 'objection', 'not_now', 'unsubscribed', 'neutral'] },
        messageId: { type: String },
    },
    { timestamps: true }
);

export const EmailThread: Model<IEmailThread> =
    mongoose.models.EmailThread || mongoose.model<IEmailThread>('EmailThread', EmailThreadSchema);
