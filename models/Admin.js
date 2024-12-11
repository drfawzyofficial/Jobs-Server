// JS Strict Mode
"use strict";

// Packages
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { Schema } = mongoose;
const SALT_WORK_FACTOR = process.env.SALT_WORK_FACTOR;

// Define Admin Schema
const adminSchema = new Schema(
  {
    fullname: {
      type: String,
      required: [true, "حقل الاسم إجباري"],
      minlength: 6,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, "حقل البريد الإلكتروني إجباري"],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'من فضلك أدخل بريد إلكتروني صالح',
      ],
    },
    password: {
      type: String,
      required: [true, "حقل كلمة السر إجباري"],
      minlength: 6,
      trim: true,
    }
  },
  { timestamps: true }
);

// Pre-save middleware to hash the password before saving
adminSchema.pre("save", async function save(next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(Number(SALT_WORK_FACTOR));
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

// Method to validate password
adminSchema.methods.validatePassword = async function (data) {
  return bcrypt.compare(data, this.password);
};

// Method to encrypt a new password
adminSchema.methods.cryptPassword = async function (data) {
  const salt = await bcrypt.genSalt(Number(SALT_WORK_FACTOR));
  return await bcrypt.hash(data, salt);
};

// Export Admin Model
const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
