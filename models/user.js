const mongoose = require('mongoose');
const validator = require('validator');
const crypto = require('crypto-js');
const bcrypt = require('bcrypt');
const { getConfValue } = require('../utils/confService');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minLength: [4, 'Name should contain minimun 4 character.'],
  },
  email: {
    type: String,
    required: [true, 'Email is required!'],
    unique: [true, 'Email should be unique!'],
    minLength: [4, 'Email should contain minimun 4 character.'],
    validate: [validator.isEmail, 'Invalid email format'],
    lowercase: true,
  },
  role: {
    type: String,
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Password is required!'],
    minLength: [8, 'Password should contain minimun 8 character.'],
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, 'Confirm Password is required!'],
    minLength: [8, 'Confirm Password  should contain minimun 8 character.'],
    validate: {
      validator: function (value) {
        return this.password === value;
      },
      message: 'Password and confirm password should match.',
    },
  },
  isActive: {
    type: Boolean,
    default: true,
    select: false,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  passwordChangedAt: Date,
  image: String,
});

userSchema.pre('save', async function (next) {
  const passwordModified = this.isModified('password');
  if (!passwordModified) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = new Date();
  next();
});

userSchema.pre(/^find/, function (next) {
  this.where({ isActive: { $ne: false } });
  next();
});

// static methods
userSchema.statics.findSingleUserWithPassword = async (params = {}) =>
  await User.findOne(params).select('+password');

userSchema.statics.findUserWithPassword = async (params = {}) =>
  await User.find(params).select('+password');

//instance methods

userSchema.methods.validatePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
