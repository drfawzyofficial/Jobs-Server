// JS Strict Mode
"use strict";

// Variables
const applicantNats = [
    'أفغاني', 'ألباني', 'جزائري', 'أمريكي', 'أندوري', 'أنغولي', 'أنتيغوي', 'أرجنتيني',
    'أرميني', 'أسترالي', 'نمساوي', 'أذربيجاني', 'باهاماسي', 'بحريني', 'بنغلاديشي',
    'باربادوسي', 'بيلاروسي', 'بلجيكي', 'بليزي', 'بنين', 'بوتاني', 'بوليفي', 'بوسني',
    'برازيلي', 'بريطاني', 'بلغاري', 'بوركيني', 'بورمي', 'بوروندي', 'كمبودي', 'كاميروني',
    'كندي', 'كاب فيردي', 'تشادي', 'تشيلي', 'صيني', 'كولومبي', 'كوموري', 'كوستاريكي',
    'كرواتي', 'كوبي', 'قبرصي', 'تشيكي', 'كونغولي', 'دنماركي', 'جيبوتي', 'دومينيكي',
    'إكوادوري', 'مصري', 'إماراتي', 'غيني استوائي', 'إريتري', 'إستوني', 'إثيوبي', 'فنلندي',
    'فرنسي', 'غابوني', 'غامبي', 'جورجي', 'ألماني', 'غاني', 'يوناني', 'غرينادي', 'غواتيمالي',
    'غيني', 'غوياني', 'هايتي', 'هندوراسي', 'هنغاري', 'آيسلندي', 'هندي', 'إندونيسي', 'إيراني',
    'عراقي', 'إيرلندي', 'فلسطيني', 'إيطالي', 'جامايكي', 'ياباني', 'أردني', 'كازاخستاني',
    'كيني', 'كيريباتي', 'كوري', 'كويتي', 'قرغيزستاني', 'لاوسي', 'لاتفي', 'لبناني', 'ليبي',
    'ليتواني', 'لوكسمبورغي', 'مدغشقري', 'مالاوي', 'ماليزي', 'مالديفي', 'مالي', 'مالطي',
    'ماوريتاني', 'مكسيكي', 'مولدوفي', 'موناكوي', 'منغولي', 'مغربي', 'موزمبيقي', 'ناميبي',
    'نيبالي', 'هولندي', 'نيوزيلندي', 'نيجيري', 'نيكاراغوي', 'نيجيري', 'نرويجي', 'عماني',
    'باكستاني', 'بنمي', 'بابواني', 'باراغوي', 'بيروفي', 'فلبيني', 'بولندي', 'برتغالي',
    'قطري', 'روماني', 'روسي', 'رواندي', 'سانت لوسي', 'سلفادوري', 'ساموائي',
    'سنغالي', 'صربي', 'سيشلي', 'سنغافوري', 'سلوفاكي', 'سلوفيني', 'سومالي', 'جنوب أفريقي',
    'إسباني', 'سريلانكي', 'سوداني', 'سورينامي', 'سوازيلندي', 'سويدي', 'سويسري', 'سوري',
    'تايواني', 'طاجيكستاني', 'تنزاني', 'تايلاندي', 'توغولي', 'تونسي', 'تركي', 'تركماني',
    'توفالي', 'أوغندي', 'أوكراني', 'أوروغواي', 'أوزبكستاني', 'فانواتي', 'فنزويلي', 'فيتنامي',
    'يمني', 'زامبي', 'زيمبابوي'
];

const cities = ["الرياض", "جدة", "مكة", "المدينة المنورة", "الدمام", "الخبر", "الطائف", "بريدة", "الجبيل", "حفر الباطن", "الظهران", "ينبع", "أبها", "خميس مشيط", "القصيم", "القطيف", "نجران", "تبوك", "جازان", "عرعر", "سكاكا", "الخرج", "الباحة", "بيشة", "القنفذة", "الدوادمي", "رجال ألمع", "محايل عسير", "شرورة", "رابغ", "المجمعة", "بدر", "الرس", "عنيزة", "حائل", "وادي الدواسر", "صبيا", "العيص", "ضباء", "تيماء", "بدر الجنوب", "طريف", "الأفلاج", "الحوطة", "مرات", "رنية", "ليلى", "السليل", "تنومة", "بلجرشي", "المندق", "قلوة", "العلا", "ساجر", "البكيرية", "الزلفي", "دومة الجندل", "عفيف", "الحريق", "الدوادمي", "القريات", "الطريف", "تربة", "رأس تنورة", "الساحل الشرقي", "سدير", "ثادق"];

// Import Packages
const moment = require("moment");

// Import Models
const Helper = require("../models/Helper");

// Import Utilities
const sendResponse = require("../utils/sendResponse");
const { inRange, isValidDate } = require("../utils/funcs");

/**
 * Middleware for additional chance validation.
 * Checks various fields like chance price, dates, applicant details, and English standards.
 */
module.exports = async (req, res, next) => {
    try {
        // Extract request data
        const data = req.body;
        const errors = {};

        // Retrieve helper data and filter out invalid placeholders
        const helper = await Helper.findById({ _id: process.env.HELPER_ID });
        const chanceCategories = helper.chanceCategories;
        const chanceSubcategories = helper.chanceSubcategories;
        const applicantEdus = helper.applicantEdus;
        const programStatusArr = ["حضوري", "عن بعد"];
        const IELTSDegrees = ["0", "0.5", "1", "1.5", "2", "2.5", "3", "3.5", "4", "4.5", "5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9"]
        const CEFRDegrees = ["A1", "A2", "B1", "B2", "C1", "C2"];

        // Validate chance price
        if (data.chancePrice && isNaN(data.chancePrice)) {
            errors["chancePrice"] = ['يجب أن يكون السعر رقمًا'];
        }
        if (data.chancePrice && data.chancePrice < 0) {
            errors["chancePrice"] = ['لا يمكن أن يكون السعر أقل من الصفر'];
        }

        // Validate chance start and end dates

        if (!isValidDate(data.chanceRegStartDate) || !isValidDate(data.chanceRegEndDate) || !isValidDate(data.chanceStartDate) || !isValidDate(data.chanceEndDate)) {
            errors["DOB"] = ["يجب أن يكون التاريخ صالح"];
        }
        if (new Date(data.chanceRegStartDate) < new Date(moment(Date.now()).format('MM/DD/YYYY'))) {
            errors["chanceRegStartDate"] = ['لا يمكن أن يكون ميعاد بداية تسجيل الفرصة أقل من تاريخ اليوم'];
        }
        if (new Date(data.chanceRegEndDate) < new Date(data.chanceRegStartDate)) {
            errors["chanceRegEndDate"] = ['لا يمكن أن يكون ميعاد نهاية تسجيل الفرصة أقل من تاريخ ميعاد بداية تسجيل الفرصة'];
        }

        if (new Date(data.chanceStartDate) <  new Date(data.chanceRegEndDate )) {
            errors["chanceStartDate"] = ['لا يمكن أن يكون ميعاد بداية الفرصة أقل من تاريخ نهاية تسجيل الفرصة'];
        }
        if (new Date(data.chanceEndDate) < new Date(data.chanceStartDate)) {
            errors["chanceEndDate"] = ['لا يمكن أن يكون ميعاد نهاية الفرصة أقل من تاريخ ميعاد بداية الفرصة'];
        }

        // Validate chance category
        if (!chanceCategories.includes(data.chanceCategory)) {
            errors["chanceCategory"] = ['يجب أن يكون التصنيف صحيحًا'];
        }

        // Validate chance subcategory
        if (!chanceSubcategories.includes(data.chanceSubcategory)) {
            errors["chanceSubcategory"] = ['يجب أن يكون التصنيف الفرعي صحيحًا'];
        }

        // Validate chance image (base64 format)
        // if (data.chanceImage && !/^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/.test(data.chanceImage)) {
        //     errors["chanceImage"] = ['ملف الصورة يجب أن يكون صحيحًا'];
        // }

        // Validate program status 
        if (!programStatusArr.includes(data.programStatus)) {
            errors["programStatus"] = ['يجب أن تكون حالة البرنامج حضوري أو عن بعد'];
        }

        if(![true, false].includes(data.specialConditions))
            errors["specialConditions"] = ['يجب أن يكون متطلب الشروط إحدى القيم: true أو false'];

        if(data.programStatus === "حضوري")  {
            const allICitiesExist = data.cities.every(item => cities.includes(item));
            if(allICitiesExist == false)
                errors["cities"] = ['يجب أن تكون المدن المحددة في حالة حضوري صحيحة'];
        }
        else {
            req.body.cities = [];
        }


        // Validate applicant details
        const allItemsExist = data.applicantEdus.every(item => applicantEdus.includes(item));
        if(allItemsExist == false)
            errors["applicantEdus"] = ['يجب أن تكون المرحلة التعليمية صحيحة'];

        if (!inRange(data.applicantAge, 18, 60)) {
            errors["applicantAge"] = ['يجب أن يكون العمر بين الـ 18 و60'];
        }

        if (!applicantNats.includes(data.applicantNat)) {
            errors["applicantNat"] = ['يجب أن تكون الجنسية صحيحة'];
        }

        if (!["ذكر", "أنثى", "كلاهما"].includes(data.applicantGender)) {
            errors["applicantGender"] = ['يجب أن يكون النوع صحيح'];
        }



        // Validate English standards
        if (data.EnglishStandard.IELTSDegree && !IELTSDegrees.includes(data.EnglishStandard.IELTSDegree)) {
            errors["IELTSDegree"] = ['يجب أن تكون درجة الأيلتس بين 0 و9'];
        }
        if (data.EnglishStandard.TOFELDegree && !inRange(data.EnglishStandard.TOFELDegree, 0, 120)) {
            errors["TOFELDegree"] = ['يجب أن تكون درجة التويفل بين 0 و120'];
        }
        if (data.EnglishStandard.TOEICDegree && !inRange(data.EnglishStandard.TOEICDegree, 0, 990)) {
            errors["TOEICDegree"] = ['يجب أن تكون درجة التويك بين 0 و990'];
        }
        if (data.EnglishStandard.DUOLINGODegree && !inRange(data.EnglishStandard.DUOLINGODegree, 0, 160)) {
            errors["DUOLINGODegree"] = ['يجب أن تكون درجة الدولينجو بين 0 و160'];
        }
        if (data.EnglishStandard.stepDegree && !inRange(data.EnglishStandard.stepDegree, 0, 100)) {
            errors["stepDegree"] = ['يجب أن تكون درجة الاستب بين 0 و100'];
        }
        if (data.EnglishStandard.CEFRDegree && !CEFRDegrees.includes(data.EnglishStandard.CEFRDegree)) {
            errors["CEFRDegree"] = ['يجب أن يكون معيار السيفر صحيحًا'];
        }

        // Validate Brain standards
        if (data.BrainStandard.Sat && !inRange(data.BrainStandard.Sat, 0, 1600)) {
            errors["Sat"] = ['يجب أن تكون درجة الـ Sat بين 0 و1600'];
        }
        if (data.BrainStandard.Qudrat && !inRange(data.BrainStandard.Qudrat, 0, 100)) {
            errors["Qudrat"] = ['يجب أن تكون درجة الكودرات بين 0 و100'];
        }
        if (data.BrainStandard.GAT && !inRange(data.BrainStandard.GAT, 0, 100)) {
            errors["GAT"] = ['يجب أن تكون درجة الجات بين 0 و100'];
        }
        if (data.BrainStandard.act && !inRange(data.BrainStandard.act, 0, 36)) {
            errors["act"] = ['يجب أن تكون درجة الاكت بين 0 و36'];
        }
        if (data.BrainStandard.Talent && !inRange(data.BrainStandard.Talent, 0, 2000)) {
            errors["Talent"] = ['يجب أن تكون درجة التالنت بين 0 و2000'];
        }
        if (data.BrainStandard.AchievementTest && !inRange(data.BrainStandard.AchievementTest, 0, 100)) {
            errors["AchievementTest"] = ['يجب أن تكون درجة الاختبار التحصيلي بين 0 و100'];
        }

        if (data.BrainStandard.SAAT && !inRange(data.BrainStandard.SAAT, 0, 100)) {
            errors["SAAT"] = ['يجب أن تكون درجة الـ SAAT بين 0 و100'];
        }


        // Validate Curriculum standards
        if (data.CurStandard.SaudiCur && !inRange(data.CurStandard.SaudiCur, 0, 100)) {
            errors["SaudiCur"] = ['يجب أن تكون درجة المنهج السعودي بين 0 و100'];
        }
        if (data.CurStandard.BritishCur && !inRange(data.CurStandard.BritishCur, 0, 100)) {
            errors["BritishCur"] = ['يجب أن تكون درجة المنهج البريطاني بين 0 و100'];
        }
        if (data.CurStandard.AmericanDiploma && !inRange(data.CurStandard.AmericanDiploma, 0, 4)) {
            errors["AmericanDiploma"] = ['يجب أن تكون درجة الدبلومة الأمريكية بين 0 و4'];
        }

        // If there are validation errors, return them in the response
        if (Object.keys(errors).length > 0) {
            return sendResponse(res, 400, "فشل في عملية التحقق", { errors });
        }

        // Proceed to the next middleware if validation passes
        next();
    } catch (err) {
        // Log the error for debugging
        console.error('chance validation error:', err.message);
        // Send a server error response
        return sendResponse(res, 500, "خطأ في خادم السيرفر");
    }
};
