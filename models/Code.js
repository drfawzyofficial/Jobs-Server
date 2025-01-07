// JS Strict Mode
"use strict";

// Packages
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { Schema } = mongoose;

// Define Code Schema
const codeSchema = new Schema(
  {
    _studentID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Student", // Reference to the Student model
    },
    code: {
      type: String,
      required: true,
    },
    for: {
      type: String,
      required: true,
      enum: {
        values: ["Signup", "ResetPassword"],
        message: "{VALUE} غير صحيحة",
      },
    },
    expireAt: {
      type: Date,
      default: Date.now,
      index: { expires: 3600 }, // TTL index for 1 hour
    },
  }
);

// Method to check if the provided code matches the stored hashed code
codeSchema.methods.checkCode = async function (code) {
  return bcrypt.compare(code, this.code);
};

// Export Code Model
const Code = mongoose.model("Code", codeSchema);
module.exports = Code;
