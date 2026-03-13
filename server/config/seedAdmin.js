const bcrypt = require('bcryptjs');
const User = require('../models/User');

const seedAdmin = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    return;
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({
    name: process.env.ADMIN_NAME || 'Clinic Admin',
    email: email.toLowerCase(),
    password: hashedPassword,
    isAdmin: true,
  });
};

module.exports = seedAdmin;
