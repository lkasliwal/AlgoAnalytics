const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    unique: true,
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isVerified: {
    type: Boolean,
    default: false,
    required: true
  },
  adminVerified: {
    type: Boolean,
    default: false
  }
})

userSchema.pre('save', async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  }
})

userSchema.methods.comparePassword = async function (newPassword) {
  const result = await bcrypt.compare(newPassword, this.password);
  return result;
};

module.exports = mongoose.model('User', userSchema)