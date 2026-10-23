const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './lms-backend/.env' });
const User = require('./lms-backend/models/User.model');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const existing = await User.findOne({ email: 'admin@lms.com' });
    if (existing) {
      console.log('Admin already exists:', existing.email);
    } else {
      const admin = new User({
        name: 'Administrator',
        email: 'admin@lms.com',
        password: 'password123',
        role: 'admin',
      });
      await admin.save();
      console.log('Created admin user with email admin@lms.com and password password123');
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();