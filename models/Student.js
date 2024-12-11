// JS Strict Mode
"use strict";

// Packages
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { Schema } = mongoose;

// Constants
const SALT_WORK_FACTOR = process.env.SALT_WORK_FACTOR;

// All Saduia Cities
const saudiCities = ["الرياض", "جدة", "مكة", "المدينة المنورة", "الدمام", "الخبر", "الطائف", "بريدة", "الجبيل", "حفر الباطن", "الظهران", "ينبع", "أبها", "خميس مشيط", "القصيم", "القطيف", "نجران", "تبوك", "جازان", "عرعر", "سكاكا", "الخرج", "الباحة", "بيشة", "القنفذة", "الدوادمي", "رجال ألمع", "محايل عسير", "شرورة", "رابغ", "المجمعة", "بدر", "الرس", "عنيزة", "حائل", "وادي الدواسر", "صبيا", "العيص", "ضباء", "تيماء", "بدر الجنوب", "طريف", "الأفلاج", "الحوطة", "مرات", "رنية", "ليلى", "السليل", "تنومة", "بلجرشي", "المندق", "قلوة", "العلا", "ساجر", "البكيرية", "الزلفي", "دومة الجندل", "عفيف", "الحريق", "الدوادمي", "القريات", "الطريف", "تربة", "رأس تنورة", "الساحل الشرقي", "سدير", "ثادق", ""];

// Define the nested schemas with custom validation
const EnglishStandardSchema = new Schema({
  IELTSDegree: { type: Number, min: 0, max: 9 },
  TOFELDegree: { type: Number, min: 0, max: 120 },
  TOEICDegree: { type: Number, min: 0, max: 990 },
  DUOLINGODegree: { type: Number, min: 0, max: 160 },
  stepDegree: { type: Number, min: 0, max: 100 },
  CEFRDegree: { type: String, enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', ""] }
}, { _id: false });
const BrainStandardSchema = new Schema({
  Sat: { type: Number, min: 0, max: 1600 },
  Qudrat: { type: Number, min: 0, max: 100 },
  GAT: { type: Number, min: 0, max: 100 },
  act: { type: Number, min: 1, max: 36 },
  Talent: { type: Number, min: 0, max: 2000 }
}, { _id: false });



// Define Student Schema
const studentSchema = new Schema(
  {
    fullname: {
      type: String,
      required: [true, "حقل الاسم اجباري"],
      minlength: 6,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, "حقل البريد الإلكتروني اجباري"],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please fill a valid email address',
      ],
    },
    phone: {
      type: String,
      required: [true, 'حقل رقم الهاتف إجباري'], // Required field with custom error message
      unique: true,
      match: [
        /^(\+?\d{1,4}[-.\s]?)?(\(?\d{1,4}\)?[-.\s]?)?[\d-.\s]{5,15}$/,
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
    nationality: {
      type: String,
      required: [true, 'حقل الجنسية مطلوب'],
      enum: {
        values: [
          'أفغاني', 'ألباني', 'جزائري', 'أمريكي', 'أندوري', 'أنغولي', 'أنتيغوي',
          'أرجنتيني', 'أرميني', 'أسترالي', 'نمساوي', 'أذربيجاني', 'باهاماسي', 'بحريني',
          'بنغلاديشي', 'باربادوسي', 'بيلاروسي', 'بلجيكي', 'بليزي', 'بنين', 'بوتاني', 'بوليفي',
          'بوسني', 'برازيلي', 'بريطاني', 'بلغاري', 'بوركيني', 'بورمي', 'بوروندي', 'كمبودي',
          'كاميروني', 'كندي', 'كاب فيردي', 'تشادي', 'تشيلي', 'صيني', 'كولومبي', 'كوموري',
          'كوستاريكي', 'كرواتي', 'كوبي', 'قبرصي', 'تشيكي', 'كونغولي', 'دنماركي', 'جيبوتي',
          'دومينيكي', 'إكوادوري', 'مصري', 'إماراتي', 'غيني استوائي', 'إريتري', 'إستوني',
          'إثيوبي', 'فنلندي', 'فرنسي', 'غابوني', 'غامبي', 'جورجي', 'ألماني', 'غاني', 'يوناني',
          'غرينادي', 'غواتيمالي', 'غيني', 'غوياني', 'هايتي', 'هندوراسي', 'هنغاري', 'آيسلندي',
          'هندي', 'إندونيسي', 'إيراني', 'عراقي', 'إيرلندي', 'فلسطيني', 'إيطالي', 'جامايكي',
          'ياباني', 'أردني', 'كازاخستاني', 'كيني', 'كيريباتي', 'كوري', 'كويتي', 'قرغيزستاني',
          'لاوسي', 'لاتفي', 'لبناني', 'ليبي', 'ليتواني', 'لوكسمبورغي', 'مدغشقري', 'مالاوي',
          'ماليزي', 'مالديفي', 'مالي', 'مالطي', 'موريتاني', 'مكسيكي', 'مولدوفي', 'موناكوي',
          'منغولي', 'مغربي', 'موزمبيقي', 'ناميبي', 'نيبالي', 'هولندي', 'نيوزيلندي', 'نيجيري',
          'نيكاراغوي', 'نيجيري', 'نرويجي', 'عماني', 'باكستاني', 'بنمي', 'بابواني', 'باراغوي',
          'بيروفي', 'فلبيني', 'بولندي', 'برتغالي', 'قطري', 'روماني', 'روسي', 'رواندي', 'سانت لوسي',
          'سلفادوري', 'ساموائي', 'سعودي', 'سنغالي', 'صربي', 'سيشلي', 'سنغافوري', 'سلوفاكي',
          'سلوفيني', 'سومالي', 'جنوب أفريقي', 'إسباني', 'سريلانكي', 'سوداني', 'سورينامي',
          'سوازيلندي', 'سويدي', 'سويسري', 'سوري', 'تايواني', 'طاجيكستاني', 'تنزاني', 'تايلاندي',
          'توغولي', 'تونسي', 'تركي', 'تركماني', 'توفالي', 'أوغندي', 'أوكراني', 'أوروغواي',
          'أوزبكستاني', 'فانواتي', 'فنزويلي', 'فيتنامي', 'يمني', 'زامبي', 'زيمبابوي'
        ], // Include all available nationalities
        message: '{VALUE} ليست جنسية صالحة'
      }
    },
    saudiCity: {
      type: String,
      enum: saudiCities, // Only valid Saudi cities are allowed
      validate: {
        validator: function(value) {
          // Only validate if nationality is 'سعودي'
          if (this.nationality === 'سعودي') {
            return value && saudiCities.includes(value); // Check that saudiCity is provided and is in the saudiCities array
          }
          return true; // If nationality is not 'سعودي', no validation needed
        },
        message: 'المدينة مطلوبة إذا كانت الجنسية سعودية ويجب أن تكون من مدن السعودية.'
      }
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
    avatar: {
      type: String,
      trim: true,
      required: true,
      default: `${process.env.SERVER_URL}/uploads/avatars/avatar.png`,
    },
    gender: {
      type: String,
      enum: {
        values: ["ذكر", "أنثى"],
        message: "القيمة المدخلة غير صحيحة",
      },
      trim: true,
    },
    applicantAge: {
      type: String,
      trim: true,
    },

    applicantEdu: {
      type: String,
      trim: true,
    },
    EnglishStandard: EnglishStandardSchema,
    BrainStandard: BrainStandardSchema,
    dOB: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
      minLength: [50, "على الأقل يجب إدخال 50 حرف"],
      maxLength: [150, "على الأكثر يجب إدخال 150 حرف"],
    },
    tags: {
      type: [String],
      trim: true,
      required: true,
    },
    role: {
      type: String,
      default: "Student",
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

// Custom validation for EnglishStandard
// EnglishStandardSchema.path('IELTSDegree').validate(function() {
//   const values = Object.values(this.toObject());
//   console.log(values);
//   return values.some(val => val !== undefined && val !== null && val !== '');
// }, 'At least one English standard score is required.');

// Custom validator to ensure at least one field is filled in BrainStandard
// BrainStandardSchema.path('Sat').validate(function() {
//   const values = Object.values(this.toObject());
//   return values.some(val => val !== undefined && val !== null && val !== '');
// }, 'At least one brain standard score is required.');

// Custom validator to ensure at least one field is filled in CurStandard
// CurStandardSchema.path('SaudiCur').validate(function() {
//   const values = Object.values(this.toObject());
//   return values.some(val => val !== undefined && val !== null && val !== '');
// }, 'At least one curriculum score is required.');




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
