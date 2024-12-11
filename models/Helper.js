// JS Strict Mode
"use strict";

// Packages
const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define Helper Schema
const helperSchema = new Schema(
  {
    chanceCategories: {
      type: Array,
      required: [true, "حقل الفئات إجباري"],
    },
    chanceSubcategories: {
      type: Array,
      required: [true, "حقل الفئات الفرعية إجباري"],
    },
    applicantEdus: {
      type: Array,
      required: [true, "حقل المراحل التعليمية إجباري"],
    },
  },
  { timestamps: true }
);

// Export Helper Model
const Helper = mongoose.model("Helper", helperSchema);
module.exports = Helper;
