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
  Talent: { type: Number, min: 0, max: 2000 },
  AchievementTest: { type: Number, min: 0, max: 100 },
  SAAT: { type: Number, min: 0, max: 100 },
}, { _id: false });



// Define Student Schema
const studentSchema = new Schema(
  {
    first_name: {
      type: String,
      required: [true, "حقل الاسم الأول اجباري"],
      minlength: 6,
      trim: true,
    },
    last_name: {
      type: String,
      required: [true, "حقل الاسم الثاني إجباري"],
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
    // nationality: {
    //   type: String,
    //   required: [true, 'حقل الجنسية مطلوب'],
    //   enum: {
    //     values: [
    //       'أفغاني', 'ألباني', 'جزائري', 'أمريكي', 'أندوري', 'أنغولي', 'أنتيغوي',
    //       'أرجنتيني', 'أرميني', 'أسترالي', 'نمساوي', 'أذربيجاني', 'باهاماسي', 'بحريني',
    //       'بنغلاديشي', 'باربادوسي', 'بيلاروسي', 'بلجيكي', 'بليزي', 'بنين', 'بوتاني', 'بوليفي',
    //       'بوسني', 'برازيلي', 'بريطاني', 'بلغاري', 'بوركيني', 'بورمي', 'بوروندي', 'كمبودي',
    //       'كاميروني', 'كندي', 'كاب فيردي', 'تشادي', 'تشيلي', 'صيني', 'كولومبي', 'كوموري',
    //       'كوستاريكي', 'كرواتي', 'كوبي', 'قبرصي', 'تشيكي', 'كونغولي', 'دنماركي', 'جيبوتي',
    //       'دومينيكي', 'إكوادوري', 'مصري', 'إماراتي', 'غيني استوائي', 'إريتري', 'إستوني',
    //       'إثيوبي', 'فنلندي', 'فرنسي', 'غابوني', 'غامبي', 'جورجي', 'ألماني', 'غاني', 'يوناني',
    //       'غرينادي', 'غواتيمالي', 'غيني', 'غوياني', 'هايتي', 'هندوراسي', 'هنغاري', 'آيسلندي',
    //       'هندي', 'إندونيسي', 'إيراني', 'عراقي', 'إيرلندي', 'فلسطيني', 'إيطالي', 'جامايكي',
    //       'ياباني', 'أردني', 'كازاخستاني', 'كيني', 'كيريباتي', 'كوري', 'كويتي', 'قرغيزستاني',
    //       'لاوسي', 'لاتفي', 'لبناني', 'ليبي', 'ليتواني', 'لوكسمبورغي', 'مدغشقري', 'مالاوي',
    //       'ماليزي', 'مالديفي', 'مالي', 'مالطي', 'موريتاني', 'مكسيكي', 'مولدوفي', 'موناكوي',
    //       'منغولي', 'مغربي', 'موزمبيقي', 'ناميبي', 'نيبالي', 'هولندي', 'نيوزيلندي', 'نيجيري',
    //       'نيكاراغوي', 'نيجيري', 'نرويجي', 'عماني', 'باكستاني', 'بنمي', 'بابواني', 'باراغوي',
    //       'بيروفي', 'فلبيني', 'بولندي', 'برتغالي', 'قطري', 'روماني', 'روسي', 'رواندي', 'سانت لوسي',
    //       'سلفادوري', 'ساموائي', 'سعودي', 'سنغالي', 'صربي', 'سيشلي', 'سنغافوري', 'سلوفاكي',
    //       'سلوفيني', 'سومالي', 'جنوب أفريقي', 'إسباني', 'سريلانكي', 'سوداني', 'سورينامي',
    //       'سوازيلندي', 'سويدي', 'سويسري', 'سوري', 'تايواني', 'طاجيكستاني', 'تنزاني', 'تايلاندي',
    //       'توغولي', 'تونسي', 'تركي', 'تركماني', 'توفالي', 'أوغندي', 'أوكراني', 'أوروغواي',
    //       'أوزبكستاني', 'فانواتي', 'فنزويلي', 'فيتنامي', 'يمني', 'زامبي', 'زيمبابوي'
    //     ], // Include all available nationalities
    //     message: '{VALUE} ليست جنسية صالحة'
    //   }
    // },
    saudiresiding: {
      type: Boolean,
      required: [true, "حقل تحديد الإقامة إجباري"],
    },
    saudiCity: {
      type: String,
      enum: saudiCities, // Only valid Saudi cities are allowed
      validate: {
        validator: function(value) {
          if (this.saudiresiding === true) {
            return value && saudiCities.includes(value); // Check that saudiCity is provided and is in the saudiCities array
          }
          return true; 
        },
        message: 'يجب أن تكون المدينة صحيحة'
      }
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
