// JS Strict Mode
"use strict";

const cities = [
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

// Import Packages
const moment = require("moment");

// Import Models
const Helper = require("../models/Helper");

// Import Utilities
const sendResponse = require("../utils/sendResponse");
const { inRange, matchesRegex } = require("../utils/funcs");

/**
 * Middleware for additional chance validation.
 * Checks various fields like chance price, dates, applicant details, and English standards.
 */
module.exports = async (req, res, next) => {
    try {
        // ExtrACT request data
        const data = req.body;
        const errors = {};

        // Retrieve helper data and filter out invalid placeholders
        const helper = await Helper.findById({ _id: process.env.HELPER_ID });
        const chanceCategories = helper.chanceCategories;
        const chanceSubcategories = helper.chanceSubcategories;
        const applicantEdus = helper.applicantEdus;
        const programStatusArr = ["حضوري", "عن بعد"];
        const IELTSs = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, "0", "0.5", "1", "1.5", "2", "2.5", "3", "3.5", "4", "4.5", "5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9"]
        const AmericanDiplomaDegrees = [0, 0.25, 0.5, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 3.25, 3.5, 3.75, 4, "0", "0.25", "0.5", "0.75", "1", "1.25", "1.5", "1.75", "2", "2.25", "2.5", "2.75", "3", "3.25", "3.5", "3.75", "4"]
        
        const CEFRs = ["A1", "A2", "B1", "B2", "C1", "C2"];

        // Validate chance price
        if (data.chancePrice && isNaN(data.chancePrice)) {
            errors["chancePrice"] = ['يجب أن يكون السعر رقمًا'];
        }
        if (data.chancePrice && data.chancePrice < 0) {
            errors["chancePrice"] = ['لا يمكن أن يكون السعر أقل من الصفر'];
        }

        // Validate chance start and end dates
        if (!matchesRegex(data.chanceRegStartDate, /^\d{4}-\d{2}-\d{2}$/) || !matchesRegex(data.chanceRegEndDate, /^\d{4}-\d{2}-\d{2}$/)  || !matchesRegex(data.chanceStartDate, /^\d{4}-\d{2}-\d{2}$/) || !matchesRegex(data.chanceEndDate, /^\d{4}-\d{2}-\d{2}$/)) {
            errors["chanceDate"] = ["يجب أن يكون التاريخ صالح لبداية ونهاية تسجيل الفرصة وكذلك لبداية ونهاية دورة الفرصة"];
        }
       
        if (new Date(data.chanceRegEndDate) < new Date(data.chanceRegStartDate)) {
            errors["chanceRegEndDate"] = ['لا يمكن أن يكون ميعاد نهاية تسجيل الفرصة أقل من تاريخ ميعاد بداية تسجيل الفرصة'];
        }

        if (new Date(data.chanceStartDate) < new Date(data.chanceRegEndDate)) {
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

        // Validate chancePriority
        if (!["saudi", "all"].includes(data.chancePriority))
            errors["chancePriority"] = ['يجب أن يكون متطلب الشروط إحدى القيم: saudi أو all'];

        // Validate program status 
        if (!programStatusArr.includes(data.programStatus)) {
            errors["programStatus"] = ['يجب أن تكون حالة البرنامج حضوري أو عن بعد'];
        }

        if (![true, false].includes(data.specialConditions))
            errors["specialConditions"] = ['يجب أن يكون متطلب الشروط إحدى القيم: true أو false'];

        if (data.programStatus === "حضوري") {
            const allICitiesExist = data.cities.every(item => cities.includes(item));
            if (allICitiesExist == false)
                errors["cities"] = ['يجب أن تكون المدن المحددة في حالة حضوري صحيحة'];
        }
        else {
            req.body.cities = [];
        }


        // Validate applicant details
        const allItemsExist = data.applicantEdus.every(item => applicantEdus.includes(item));
        if (allItemsExist == false)
            errors["applicantEdus"] = ['يجب أن تكون المرحلة التعليمية صحيحة'];


        if(data.applicantAge) {
            if (!inRange(data.applicantAge, 18, 60)) {
                errors["applicantAge"] = ['يجب أن يكون العمر بين الـ 18 و60'];
            }
        }

        // if (!applicantNats.includes(data.applicantNat)) {
        //     errors["applicantNat"] = ['يجب أن تكون الجنسية صحيحة'];
        // }

        if (!["ذكر", "أنثى", "كلاهما"].includes(data.applicantGender)) {
            errors["applicantGender"] = ['يجب أن يكون الجنس صحيحًا'];
        }

        // EnglishStandard Object is mandatory 
        if (!data.EnglishStandard) {
            errors["EnglishStandard"] = ["يجب أن يكون معيار اللغة الإنجليزية صحيحًا"];
        } else {
            // Define the properties to check
            const propertiesToCheck = ["IELTS", "TOEFL", "TOEIC", "DUOLINGO", "STEP", "CEFR"];

            // Check if the object contains at least one of the properties
            const hasProperty = propertiesToCheck.some(prop => data.EnglishStandard.hasOwnProperty(prop));

            // Output the result
            if (!hasProperty) {
                errors["EnglishStandard"] = ['يجب أن يحتوى معيار اللغة الإنجليزية على إحدى خصائها'];
            }

            // Validate English standards
            if (data.EnglishStandard.IELTS && !IELTSs.includes(data.EnglishStandard.IELTS)) {
                errors["IELTS"] = ['يجب أن تكون درجة الـ IELTS بين 0 و9'];
            }
            if (data.EnglishStandard.TOEFL && !inRange(data.EnglishStandard.TOEFL, 0, 120)) {
                errors["TOEFL"] = ['يجب أن تكون درجة الـ TOEFL بين 0 و120'];
            }
            if (data.EnglishStandard.TOEIC && !inRange(data.EnglishStandard.TOEIC, 0, 990)) {
                errors["TOEIC"] = ['يجب أن تكون درجة الـ TOEIC بين 0 و990'];
            }
            if (data.EnglishStandard.DUOLINGO && !inRange(data.EnglishStandard.DUOLINGO, 0, 160)) {
                errors["DUOLINGO"] = ['يجب أن تكون درجة الـ DUOLINGO بين 0 و160'];
            }
            if (data.EnglishStandard.STEP && !inRange(data.EnglishStandard.STEP, 0, 100)) {
                errors["STEP"] = ['يجب أن تكون درجة الـ STEP بين 0 و100'];
            }
            if (data.EnglishStandard.CEFR && !CEFRs.includes(data.EnglishStandard.CEFR)) {
                errors["CEFR"] = ['يجب أن يكون درجة الـ CEFR صحيحًا'];
            }
        }


        if (!data.BrainStandard) {
            errors["BrainStandard"] = ["يجب أن يكون معيار القدرات العقلية صحيحًا"];
        } else {
            // Define the properties to check
            const propertiesToCheck = ["SAT", "Qudrat", "GAT", "ACT", "Talent", "AchivementTest", "SAAT"];

            // Check if the object contains at least one of the properties
            const hasProperty = propertiesToCheck.some(prop => data.BrainStandard.hasOwnProperty(prop));

            // Output the result
            if (!hasProperty) {
                errors["BrainStandard"] = ['يجب أن يحتوى معيار القدرات العقلية على إحدى خصائها'];
            }
            // Validate Brain standards
            if (data.BrainStandard.SAT && !inRange(data.BrainStandard.SAT, 0, 1600)) {
                errors["SAT"] = ['يجب أن تكون درجة الـ SAT بين 0 و1600'];
            }
            if (data.BrainStandard.Qudrat && !inRange(data.BrainStandard.Qudrat, 0, 100)) {
                errors["Qudrat"] = ['يجب أن تكون درجة القدرات بين 0 و100'];
            }
            if (data.BrainStandard.GAT && !inRange(data.BrainStandard.GAT, 0, 100)) {
                errors["GAT"] = ['يجب أن تكون درجة الـ GAT بين 0 و100'];
            }
            if (data.BrainStandard.ACT && !inRange(data.BrainStandard.ACT, 0, 36)) {
                errors["ACT"] = ['يجب أن تكون درجة الـ ACT بين 0 و36'];
            }
            if (data.BrainStandard.Talent && !inRange(data.BrainStandard.Talent, 0, 2000)) {
                errors["Talent"] = ['يجب أن تكون درجة مقياس موهبة بين 0 و2000'];
            }
            if (data.BrainStandard.AchivementTest && !inRange(data.BrainStandard.AchivementTest, 0, 100)) {
                errors["AchivementTest"] = ['يجب أن تكون درجة الاختبار التحصيلي بين 0 و100'];
            }

            if (data.BrainStandard.SAAT && !inRange(data.BrainStandard.SAAT, 0, 100)) {
                errors["SAAT"] = ['يجب أن تكون درجة الـ SAAT بين 0 و100'];
            }
        }



        if (!data.CurStandard) {
            errors["CurStandard"] = ['يجب أن يكون معيار المنهج صحيحًا'];
        } else {
            // Define the properties to check
            const propertiesToCheck = ["SaudiCur", "BritishCur", "AmericanDiploma"];

            // Check if the object contains at least one of the properties
            const hasProperty = propertiesToCheck.some(prop => data.CurStandard.hasOwnProperty(prop));

            // Output the result
            if (!hasProperty) {
                errors["CurStandard"] = ['يجب أن يحتوى معيار المنهج على إحدى خصائها'];
            }
            // Validate Curriculum standards
            if (data.CurStandard.SaudiCur && !inRange(data.CurStandard.SaudiCur, 0, 100)) {
                errors["SaudiCur"] = ['يجب أن تكون درجة المنهج السعودي بين 0 و100'];
            }
            if (data.CurStandard.BritishCur && !inRange(data.CurStandard.BritishCur, 0, 100)) {
                errors["BritishCur"] = ['يجب أن تكون درجة المنهج البريطاني بين 0 و100'];
            }
            if (data.CurStandard.AmericanDiploma && !AmericanDiplomaDegrees.includes(data.CurStandard.AmericanDiploma)) {
                errors["AmericanDiploma"] = ['يجب أن تكون درجة الدبلومة الأمريكية بين 0 و4'];
            }
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
