// JS Strict Mode
"use strict";

// Packages
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { Schema } = mongoose;

// Constants
const SALT_WORK_FACTOR = process.env.SALT_WORK_FACTOR;

// All Saduia Cities
const saudiCities = [
  "الرياض",
  "مكة المكرمة",
  "جدة",
  "المدينة المنورة",
  "الدمام",
  "الأحساء",
  "القطيف",
  "الخبر",
  "الجبيل",
  "الطائف",
  "الدرعية",
  "بريدة",
  "عنيزة",
  "الرس",
  "الخرج",
  "الدوادمي",
  "المجمعة",
  "شقراء",
  "الأفلاج",
  "حوطة بني تميم",
  "الحريق",
  "المزاحمية",
  "ثادق",
  "حريملاء",
  "الدلم",
  "القنفذة",
  "رابغ",
  "تربة",
  "الخرمة",
  "ينبع",
  "العلا",
  "البكيرية",
  "البدائع",
  "الخفجي",
  "رأس تنورة",
  "بقيق",
  "أبها",
  "خميس مشيط",
  "تبوك",
  "حائل",
  "عرعر",
  "جازان",
  "الريث",
  "ضمد",
  "نجران",
  "الباحة",
  "بلجرشي",
  "سكاكا",
  "دومة الجندل"
];

// Define the nested schemas with custom validation
const EnglishStandardSchema = new Schema({
  IELTS: { type: Number, min: 0, max: 9 },
  TOEFL: { type: Number, min: 0, max: 120 },
  TOEIC: { type: Number, min: 0, max: 990 },
  DUOLINGO: { type: Number, min: 0, max: 160 },
  STEP: { type: Number, min: 0, max: 100 },
  CEFR: { type: String, enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', ""] }
}, { _id: false });
const BrainStandardSchema = new Schema({
  Sat: { type: Number, min: 0, max: 1600 },
  Qudrat: { type: Number, min: 0, max: 100 },
  GAT: { type: Number, min: 0, max: 100 },
  ACT: { type: Number, min: 1, max: 36 },
  Talent: { type: Number, min: 0, max: 2000 },
  AchivementTest: { type: Number, min: 0, max: 100 },
  SAAT: { type: Number, min: 0, max: 100 },
}, { _id: false });



// Define Student Schema
const studentSchema = new Schema(
  {
    first_name: {
      type: String,
      required: [true, "حقل الاسم الأول اجباري"],
      minlength: 2,
      trim: true,
    },
    last_name: {
      type: String,
      required: [true, "حقل الاسم الثاني إجباري"],
      minlength: 2,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, "حقل البريد الإلكتروني اجباري"],
      unique: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please fill a valid email address',
      ],
    },
    phone: {
      type: String,
      required: [true, 'حقل رقم الهاتف إجباري'], // Required field with custom error message
      unique: true,
      match: [
        /^05\d{8}$/,
        'من فضلك أدخل رقم هاتف صحيح' // Validate phone number format with a regex pattern
      ],
      minlength: [10, 'يجب أن يتكون رقم الهاتف من 10 أرقام على الأقل'], // Minimum length of 10 digits
      maxlength: [15, 'رقم الهاتف لا يمكن أن يتجاوز 15 رقما'], // Maximum length of 15 digits
    },
    password: {
      type: String,
      required: [true, "حقل كلمة السر إجباري"],
      minlength: 6,
      trim: true,
    },
    saudinationality: {
      type: Boolean,
      required: [true, "حقل تحديد سعودي الجنسية إجباري"],
    },
    saudiCity: {
      type: String,
      enum: saudiCities,
      message: 'يجب أن تكون المدينة صحيحة'
    },
    tookEnglishTest: {
      type: Boolean,
      required: [true, "حقل تحديد اختبار اللغة الإنجليزية إجباري"],
    },
    tookBrainTest: {
      type: Boolean,
      required: [true, "حقل تحديد اختبار القدرات العقلية إجباري"],
    },
    interests: {
      type: [String],
      required: [true, 'حقل الاهتمامات إجباري'],
      validate: {
        validator: function (v) {
          return v && v.length >= 3;
        },
        message: 'برجاء اختر 3 اهتمامات على الأقل'
      }
    },
    Subinterests: {
      type: [String],
      required: [true, 'حقل الاهتمامات إجباري'],
      validate: {
        validator: function (v) {
          return v && v.length >= 3;
        },
        message: 'برجاء اختر 3 اهتمامات على الأقل'
      }
    },
    avatar: {
      type: String,
      trim: true,
      required: true,
      default: `${process.env.SERVER_URL}/uploads/avatars/avatar.png`,
    },
    applicantGender: {
      type: String,
      required: [true, "applicantGender is required"],
      enum: {
        values: ["أنثى", "ذكر", "كلاهما"],
        message: "{VALUE} is not supported",
      },
    },
    DOB: {
      type: String,
      trim: true,
    },
    applicantEdu: {
      type: String,
      required: [true, "applicantEdu is required"],
      trim: true,
    },
    EnglishStandard: EnglishStandardSchema,
    BrainStandard: BrainStandardSchema,
    dOB: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      default: "Student",
    },
    enable_notifications: {
      type: Boolean,
      required: [true, "enable_notifications is required"]
    },
    acceptConditions: {
      type: Boolean,
      required: [true, "acceptConditions is required"]
    },
    online: {
      type: Boolean,
      default: false,
    },
    is_verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Pre-save middleware to hash the password before saving
studentSchema.pre("save", async function (next) {
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
studentSchema.methods.validatePassword = async function (data) {
  return bcrypt.compare(data, this.password);
};

// Method to encrypt a new password
studentSchema.methods.cryptPassword = async function (data) {
  const salt = await bcrypt.genSalt(Number(SALT_WORK_FACTOR));
  return await bcrypt.hash(data, salt);
};

// Export Student Model
const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
