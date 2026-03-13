const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const User = require('../models/User');

dotenv.config();

const run = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env');
    process.exit(1);
  }

  await connectDB();

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.findOneAndUpdate(
    { email: email.toLowerCase() },
    { password: hashedPassword, isAdmin: true },
    { new: true, upsert: true }
  );

  console.log(`Admin password updated for ${user.email}`);
  process.exit(0);
};

run().catch((err) => {
  console.error('Failed to update admin password:', err.message);
  process.exit(1);
});
