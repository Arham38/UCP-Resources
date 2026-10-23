const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });
const User = require('./models/User.model');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const existing = await User.findOne({ email: 'admin@lms.com' });
    if (existing) {
      existing.name = 'Administrator';
      existing.role = 'admin';
      existing.password = 'admin123';
      await existing.save();
      console.log('Updated admin user: admin@lms.com (password reset to admin123)');
    } else {
      const admin = new User({
        name: 'Administrator',
        email: 'admin@lms.com',
        password: 'admin123',
        role: 'admin',
      });
      await admin.save();
      console.log('Created admin user with email admin@lms.com and password admin123');
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();