import { Resend } from 'resend';

const apiKey = process.env.RESEND_API_KEY!;

if (!apiKey) {
    throw new Error('Please define the RESEND_API_KEY environment variable inside .env.local');
}

export const resend = new Resend(apiKey);
