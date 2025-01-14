// JS Strict Mode
"use strict";

// Import Packages
const bcrypt = require("bcryptjs");
const moment = require("moment");

// Import Models
const Student = require('../../models/Student');
const Code = require('../../models/Code');
const Helper = require("../../models/Helper");

// Import Utilities
const sendResponse = require('../../utils/sendResponse');
const sendEmail = require('../../utils/sendEmail');
const { inRange, isValidDate } = require("../../utils/funcs");

// Variables
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

const IELTSDegrees = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, "0", "0.5", "1", "1.5", "2", "2.5", "3", "3.5", "4", "4.5", "5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9"];
const CEFRDegrees = ["A1", "A2", "B1", "B2", "C1", "C2"];

/**
 * Method for student signup.
 * Creates a new student account and sends a verification code via email.
 */
const studentSignup = async (req, res) => {
    try {
        // Extract student details from the request body
        const { first_name, last_name, email, phone, password, applicantGender, applicantEdu, saudinationality, saudiCity, tookEnglishTest, tookBrainTest, interests, Subinterests } = req.body;
        const errors = {};
        var DOB = req.body.DOB;
        var EnglishStandard = req.body.EnglishStandard;
        var BrainStandard = req.body.BrainStandard;

        const helper = await Helper.findById(process.env.HELPER_ID);

        if (first_name.trim().length < 3)
            errors["first_name"] = ["يجب أن يكون الاسم الأول مكون من 3 أحرف"];

        if (last_name.trim().length < 3)
            errors["last_name"] = ["يجب أن يكون الاسم الأخير مكون من 3 أحرف"];

        if (!isValidDate(DOB))
            errors["DOB"] = ["يجب أن يكون التاريخ صالح"];


        if (!helper.applicantEdus.includes(applicantEdu))
            errors["applicantEdu"] = ["يجب أن يكون المرحلة التعليمية صحيحة"]

        if (!saudiCities.includes(saudiCity))
            errors["saudiCity"] = ["يجب أن تكون المدينة صحيحة"];


        if (tookEnglishTest === false) {
            EnglishStandard = { IELTSDegree: '', TOFELDegree: '', TOEICDegree: '', DUOLINGODegree: '', stepDegree: '', CEFRDegree: '' };
        } else {
            if (!EnglishStandard)
                errors["EnglishStandard"] = ["يجب أن يكون معيار اللغة الإنجليزية صحيحًا"];
            else {

                // Define the properties to check
                const propertiesToCheck = ["IELTSDegree", "TOFELDegree", "TOEICDegree", "DUOLINGODegree", "stepDegree", "CEFRDegree"];

                // Check if the object contains at least one of the properties
                const hasProperty = propertiesToCheck.some(prop => EnglishStandard.hasOwnProperty(prop));

                // Output the result
                if (!hasProperty) {
                    errors["EnglishStandard"] = ['يجب أن يحتوى معيار اللغة الإنجليزية على إحدى خصائها'];
                }

                // Validate English standards
                if (EnglishStandard.IELTSDegree && !IELTSDegrees.includes(EnglishStandard.IELTSDegree)) {
                    errors["IELTSDegree"] = ['يجب أن تكون درجة الأيلتس بين 0 و9'];
                }
                if (EnglishStandard.TOFELDegree && !inRange(EnglishStandard.TOFELDegree, 0, 120)) {
                    errors["TOFELDegree"] = ['يجب أن تكون درجة التويفل بين 0 و120'];
                }
                if (EnglishStandard.TOEICDegree && !inRange(EnglishStandard.TOEICDegree, 0, 990)) {
                    errors["TOEICDegree"] = ['يجب أن تكون درجة التويك بين 0 و990'];
                }
                if (EnglishStandard.DUOLINGODegree && !inRange(EnglishStandard.DUOLINGODegree, 0, 160)) {
                    errors["DUOLINGODegree"] = ['يجب أن تكون درجة الدولينجو بين 0 و160'];
                }
                if (EnglishStandard.stepDegree && !inRange(EnglishStandard.stepDegree, 0, 100)) {
                    errors["stepDegree"] = ['يجب أن تكون درجة الاستب بين 0 و100'];
                }
                if (EnglishStandard.CEFRDegree && !CEFRDegrees.includes(EnglishStandard.CEFRDegree)) {
                    errors["CEFRDegree"] = ['يجب أن يكون معيار السيفر صحيحًا'];
                }
            }

        }

        if (tookBrainTest === false) {
            BrainStandard = { Sat: '', Qudrat: '', GAT: '', act: '', Talent: '', AchievementTest: '', SAAT: '' };
        } else {
            if (!BrainStandard)
                errors["BrainStandard"] = ["يجب أن يكون معيار القدرات العقلية صحيحًا"];
            else {
                // Define the properties to check
                const propertiesToCheck = ["Sat", "Qudrat", "GAT", "act", "Talent", "AchievementTest", "SAAT"];

                // Check if the object contains at least one of the properties
                const hasProperty = propertiesToCheck.some(prop => BrainStandard.hasOwnProperty(prop));

                // Output the result
                if (!hasProperty) {
                    errors["BrainStandard"] = ['يجب أن يحتوى معيار القدرات العقلية على إحدى خصائها'];
                }
                // Validate Brain standards
                if (BrainStandard.Sat && !inRange(BrainStandard.Sat, 0, 1600)) {
                    errors["Sat"] = ['يجب أن تكون درجة الـ Sat بين 0 و1600'];
                }
                if (BrainStandard.Qudrat && !inRange(BrainStandard.Qudrat, 0, 100)) {
                    errors["Qudrat"] = ['يجب أن تكون درجة الكودرات بين 0 و100'];
                }
                if (BrainStandard.GAT && !inRange(BrainStandard.GAT, 0, 100)) {
                    errors["GAT"] = ['يجب أن تكون درجة الجات بين 0 و100'];
                }
                if (BrainStandard.act && !inRange(BrainStandard.act, 0, 36)) {
                    errors["act"] = ['يجب أن تكون درجة الاكت بين 0 و36'];
                }
                if (BrainStandard.Talent && !inRange(BrainStandard.Talent, 0, 2000)) {
                    errors["Talent"] = ['يجب أن تكون درجة التالنت بين 0 و2000'];
                }
                if (BrainStandard.AchievementTest && !inRange(BrainStandard.AchievementTest, 0, 100)) {
                    errors["AchievementTest"] = ['يجب أن تكون درجة الاختبار التحصيلي بين 0 و100'];
                }

                if (BrainStandard.SAAT && !inRange(BrainStandard.SAAT, 0, 100)) {
                    errors["SAAT"] = ['يجب أن تكون درجة الـ SAAT بين 0 و100'];
                }
            }
        }

        const isSubset_interests = interests.every(element => helper.chanceCategories.includes(element));
        if (!isSubset_interests)
            errors["interests"] = ["خطأ في قيم التصنيفات الرئيسية"];

        const isSubset_Subinterests = Subinterests.every(element => helper.chanceSubcategories.includes(element));
        if (!isSubset_Subinterests)
            errors["Subinterests"] = ["خطأ في قيم التصنيفات الفرعية"];


        // Check for validation errors
        if (Object.keys(errors).length) {
            return sendResponse(res, 400, "فشل في عملية تحقق المدخلات", { errors });
        }

        // Create and save a new student
        const student = await new Student({ first_name, last_name, email, phone, password, applicantGender, DOB, applicantEdu, saudinationality, saudiCity, tookEnglishTest, EnglishStandard, tookBrainTest, BrainStandard, interests, Subinterests }).save();

        // Generate a random verification code (5 digits)
        const generatedCode = Math.floor(Math.random() * 90000) + 10000;

        // Hash the generated code using bcrypt
        const salt = await bcrypt.genSalt(Number(process.env.SALT_WORK_FACTOR));
        const hashedCode = await bcrypt.hash(String(generatedCode), salt);

        // Save the hashed code in the database, associated with the student's ID
        await new Code({ _studentID: student._id, code: hashedCode, for: "Signup" }).save();

        // Prepare mail configuration and content
        const mail = {
            mailService: process.env.SYSTEM_SERVICE_NODEMAILER,
            mailHost: process.env.SYSTEM_HOST_NODEMAILER,
            mailPort: Number(process.env.SYSTEM_PORT_NODEMAILER),
            mailAddress: process.env.SYSTEM_EMAIL_NODEMAILER,
            mailPassword: process.env.SYSTEM_PASS_NODEMAILER
        };
        const content = {
            subject: "تأكيد البريد الإلكتروني",
            title: "منصة الفرص",
            message: `الكود الخاص بك هو ${generatedCode}. لاحظ أن الكود صالح فقط لمدة ساعة واحدة `
        };

        // Send verification code via email
        await sendEmail(mail, student, content);

        // Send success response
        return sendResponse(res, 201, "تم إنشاء حساب الطالب بنجاح");
    } catch (err) {
        // Log the error for debugging and send error response
        console.error("Error in studentSignup:", err.message);
        return sendResponse(res, 500, err.message, "حدث خطأ في خادم السيرفر");
    }
};

// Export the studentSignup function
module.exports = studentSignup;
