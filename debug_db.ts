const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
} else {
    console.log("No .env.local found");
}

import mongoose from 'mongoose';
import { Company } from './src/models/Company';
import { MarketingPlan } from './src/models/MarketingPlan';
import { Lead } from './src/models/Lead';

async function run() {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/marketai-pro");
    const companies = await Company.find().lean();
    console.log("Companies:", companies.map(c => ({ _id: c._id, name: c.companyName })));
    
    const plans = await MarketingPlan.find().lean();
    console.log("Plans companyIds:", plans.map(p => ({ _id: p._id, companyId: p.companyId })));
    
    const leads = await Lead.find().lean();
    console.log("Leads companyIds:", leads.map(l => ({ _id: l._id, companyId: l.companyId })));
    
    process.exit(0);
}
run();
