// JS Strict Mode
"use strict";

// Packages
const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the nested schemas with custom validation
const EnglishStandardSchema = new Schema({
  IELTSDegree: { type: Number, enum: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9] },
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
const CurStandardSchema = new Schema({
  SaudiCur: { type: Number, min: 0, max: 100 },
  BritishCur: { type: Number, min: 0, max: 100 },
  AmericanDiploma: { type: Number, min: 0, max: 4 },
}, { _id: false });
// Define Chance Schema
const chanceSchema = new Schema(
  {
    chanceName: {
      type: String,
      required: [true, "chanceName is required"],
      minlength: 6,
      trim: true,
    },
    chanceLink: {
      type: String,
      trim: true,
    },
    chancePrice: {
      type: String,
      trim: true,
    },
    provider: {
      type: String,
      required: [true, "provider is required"],
      minlength: 6,
      trim: true,
    },
    specialConditions: {
      type: Boolean,
      required: [true, "specialConditions is required"],
    },
    chanceCategory: {
      type: String,
      required: [true, "chanceCategory is required"],
    },
    marketingDesc: {
      type: String,
      required: [true, "marketingDesc is required"],
    },
    chanceDesc: {
      type: String,
      required: [true, "chanceDesc is required"],
    },
    chanceSubcategory: {
      type: String,
      required: [true, "chanceSubcategory is required"],
    },
    chanceRegStartDate: {
      type: String,
      required: [true, "chanceStartRegDate is required"],
    },
    chanceRegEndDate: {
      type: String,
      required: [true, "chanceRegEndDate is required"],
    },
    chanceStartDate: {
      type: String,
      required: [true, "chanceStartDate is required"],
    },
    chanceEndDate: {
      type: String,
      required: [true, "chanceEndDate is required"],
    },
    chancePriority: {
      type: String,
      required: [true, "chancePriority is required"],
      enum: {
        values: ["saudi", "all"],
        message: "{VALUE} is not supported",
      },
    },
    programStatus: {
      type: String,
      required: [true, "programStatus is required"],
      enum: {
        values: ["حضوري", "عن بعد"],
        message: "{VALUE} is not supported",
      },
    },
    cities: {
      type: Array
    },
    chanceImage: {
      type: String,
    },
    // applicantNat: {
    //   type: String,
    //   required: [true, "applicantNat is required"],
    //   enum: {
    //     values: [
    //       'أفغاني', 'ألباني', 'جزائري', 'أمريكي', 'أندوري', 'أنغولي', 'أنتيغوي', 'أرجنتيني',
    //       'أرميني', 'أسترالي', 'نمساوي', 'أذربيجاني', 'باهاماسي', 'بحريني', 'بنغلاديشي',
    //       'باربادوسي', 'بيلاروسي', 'بلجيكي', 'بليزي', 'بنين', 'بوتاني', 'بوليفي', 'بوسني',
    //       'برازيلي', 'بريطاني', 'بلغاري', 'بوركيني', 'بورمي', 'بوروندي', 'كمبودي', 'كاميروني',
    //       'كندي', 'كاب فيردي', 'تشادي', 'تشيلي', 'صيني', 'كولومبي', 'كوموري', 'كوستاريكي',
    //       'كرواتي', 'كوبي', 'قبرصي', 'تشيكي', 'كونغولي', 'دنماركي', 'جيبوتي', 'دومينيكي',
    //       'إكوادوري', 'مصري', 'إماراتي', 'غيني استوائي', 'إريتري', 'إستوني', 'إثيوبي', 'فنلندي',
    //       'فرنسي', 'غابوني', 'غامبي', 'جورجي', 'ألماني', 'غاني', 'يوناني', 'غرينادي', 'غواتيمالي',
    //       'غيني', 'غوياني', 'هايتي', 'هندوراسي', 'هنغاري', 'آيسلندي', 'هندي', 'إندونيسي', 'إيراني',
    //       'عراقي', 'إيرلندي', 'فلسطيني', 'إيطالي', 'جامايكي', 'ياباني', 'أردني', 'كازاخستاني',
    //       'كيني', 'كيريباتي', 'كوري', 'كويتي', 'قرغيزستاني', 'لاوسي', 'لاتفي', 'لبناني', 'ليبي',
    //       'ليتواني', 'لوكسمبورغي', 'مدغشقري', 'مالاوي', 'ماليزي', 'مالديفي', 'مالي', 'مالطي',
    //       'ماوريتاني', 'مكسيكي', 'مولدوفي', 'موناكوي', 'منغولي', 'مغربي', 'موزمبيقي', 'ناميبي',
    //       'نيبالي', 'هولندي', 'نيوزيلندي', 'نيجيري', 'نيكاراغوي', 'نيجيري', 'نرويجي', 'عماني',
    //       'باكستاني', 'بنمي', 'بابواني', 'باراغوي', 'بيروفي', 'فلبيني', 'بولندي', 'برتغالي',
    //       'قطري', 'روماني', 'روسي', 'رواندي', 'سانت لوسي', 'سلفادوري', 'ساموائي',
    //       'سنغالي', 'صربي', 'سيشلي', 'سنغافوري', 'سلوفاكي', 'سلوفيني', 'سومالي', 'جنوب أفريقي',
    //       'إسباني', 'سريلانكي', 'سوداني', 'سورينامي', 'سوازيلندي', 'سويدي', 'سويسري', 'سوري',
    //       'تايواني', 'طاجيكستاني', 'تنزاني', 'تايلاندي', 'توغولي', 'تونسي', 'تركي', 'تركماني',
    //       'توفالي', 'أوغندي', 'أوكراني', 'أوروغواي', 'أوزبكستاني', 'فانواتي', 'فنزويلي', 'فيتنامي',
    //       'يمني', 'زامبي', 'زيمبابوي'
    //     ],
    //     message: "{VALUE} is not supported",
    //   },
    // },
    applicantAge: {
      type: String,
      required: [true, "applicantAge is required"],
    },
    applicantEdus: {
      type: Array,
      required: [true, "applicantEdus is required"],
    },
    applicantGender: {
      type: String,
      required: [true, "applicantGender is required"],
      enum: {
        values: ["أنثى", "ذكر", "كلاهما"],
        message: "{VALUE} is not supported",
      },
    },
    documentsContent: {
      type: String,
      required: [true, "documentsContent is required"],
    },
    notesContent: {
      type: String,
      required: [true, "notesContent is required"],
    },
    EnglishStandard: EnglishStandardSchema,
    BrainStandard: BrainStandardSchema,
    CurStandard: CurStandardSchema,
    noOfClicks: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Export Chance Model
const Chance = mongoose.model("Chance", chanceSchema);
module.exports = Chance;
