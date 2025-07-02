const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isGoogleUser: { type: Boolean, default: false }, // 👈 Add this
});

// Hash password only if not Google user
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isGoogleUser) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('User', userSchema);
