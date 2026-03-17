import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct {
    name: string;
    description: string;
    price: string;
    usp: string; // Unique Selling Proposition
}

export interface ICompany extends Document {
    userId: string; // References the User
    companyName: string;
    industry: string;
    description: string;
    productsToSell: IProduct[];
    targetAudience: string;
    geographies: string;
    competitors: string;
    brandTone: string;
    createdAt: Date;
}

const ProductSchema = new Schema<IProduct>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: String, required: true },
    usp: { type: String, required: true },
});

const CompanySchema = new Schema<ICompany>(
    {
        userId: { type: String, required: true },
        companyName: { type: String, required: true },
        industry: { type: String, required: true },
        description: { type: String, required: true },
        productsToSell: [ProductSchema],
        targetAudience: { type: String, required: true },
        geographies: { type: String, required: true },
        competitors: { type: String, required: true },
        brandTone: { type: String, default: 'Professional' },
    },
    { timestamps: true }
);

export const Company: Model<ICompany> =
    mongoose.models.Company || mongoose.model<ICompany>('Company', CompanySchema);
