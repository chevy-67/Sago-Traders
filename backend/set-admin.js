// Run this script to set/update a user's role to 'admin' and set a password
// Usage: node set-admin.js <phone_number> <password>
// Example: node set-admin.js 9876543210 MySecurePassword123

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

const phone = process.argv[2];
const password = process.argv[3];

if (!phone || !password) {
    console.error('Usage: node set-admin.js <phone_number> <password>');
    process.exit(1);
}

mongoose.connect(process.env.MONGO_URI).then(async () => {
    let user = await User.findOne({ phone });

    if (!user) {
        console.log(`Creating new admin user with phone: ${phone}`);
        user = new User({
            phone,
            role: 'admin',
            password: password
        });
    } else {
        console.log(`Updating existing user to admin: ${phone}`);
        user.role = 'admin';
        user.password = password;
    }

    await user.save();

    console.log(`✅ Admin user ${user.isNew ? 'created' : 'updated'} successfully: ${phone}`);
    console.log(`   Role: admin`);
    console.log(`   User ID: ${user._id}`);
    process.exit(0);
}).catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
});

