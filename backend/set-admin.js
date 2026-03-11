// Run this script ONCE to set a user's role to 'admin' in MongoDB
// Usage: node set-admin.js <phone_number>
// Example: node set-admin.js 9876543210

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

const phone = process.argv[2];

if (!phone) {
    console.error('Usage: node set-admin.js <phone_number>');
    process.exit(1);
}

mongoose.connect(process.env.MONGO_URI).then(async () => {
    const user = await User.findOne({ phone });

    if (!user) {
        console.error(`No user found with phone: ${phone}`);
        process.exit(1);
    }

    const prevRole = user.role;
    user.role = 'admin';
    await user.save();

    console.log(`✅ User role updated: ${phone}`);
    console.log(`   Before: ${prevRole}  →  After: admin`);
    console.log(`   User ID: ${user._id}`);
    process.exit(0);
}).catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
});
