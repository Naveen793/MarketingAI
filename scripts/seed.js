const { loadEnvConfig } = require('@next/env');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');

loadEnvConfig(path.resolve(__dirname, '..'));

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    const db = mongoose.connection.db;
    const hashedPassword = await bcrypt.hash('password123', 10);
    await db.collection('users').updateOne(
        { email: 'demo@marketai.pro' },
        { 
            $set: { 
                name: 'Demo User', 
                email: 'demo@marketai.pro', 
                password: hashedPassword,
                createdAt: new Date(),
                updatedAt: new Date()
            } 
        },
        { upsert: true }
    );
    console.log('Demo user seeded successfully!');
    process.exit(0);
}).catch(console.error);
