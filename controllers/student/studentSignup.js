// JS Strict Mode
"use strict";

// Import Packages
const bcrypt = require("bcryptjs");

// Import Models
const Student = require('../../models/Student');
const Code = require('../../models/Code');
const Helper = require("../../models/Helper");

// Import Utilities
const sendResponse = require('../../utils/sendResponse');
const sendEmail = require('../../utils/sendEmail');

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

/**
 * Method for student signup.
 * Creates a new student account and sends a verification code via email.
 */
const studentSignup = async (req, res) => {
    try {
        // Extract student details from the request body
        const { first_name, last_name, email, phone, password, applicantGender, DOB, applicantEdu, saudinationality, saudiCity, tookEnglishTest, tookBrainTest, interests, Subinterests } = req.body;

        var EnglishStandard = req.body.EnglishStandard;
        var BrainStandard = req.body.BrainStandard;

        const helper = await Helper.findById(process.env.HELPER_ID);

        if (!helper.applicantEdus.includes(applicantEdu)) {
            return sendResponse(
                res,
                400,
                "يجب أن يكون المرحلة التعليمية صحيحة"
            );
        }


        
        if (!["ذكر", "أنثى"].includes(applicantGender)) {
            return sendResponse(
                res,
                400,
                "يجب أن يكون الجنس صحيح"
            );
        }



        if (!saudiCities.includes(saudiCity))
            return sendResponse(
                res,
                400,
                "المدينة التي أدخلتها خاطئة"
            );
      
        
        if (tookEnglishTest === false) {
            EnglishStandard = { IELTSDegree: '', TOFELDegree: '', TOEICDegree: '', DUOLINGODegree: '', stepDegree: '', CEFRDegree: ''};
        }

        if (tookBrainTest === false) {
            BrainStandard = { Sat: '', Qudrat: '',  GAT: '', act: '', Talent: '', AchievementTest: '', SAAT: '' };
        }



        const isSubset_interests = interests.every(element => helper.chanceCategories.includes(element));
        if(!isSubset_interests) 
            return sendResponse(
                res,
                400,
                "خطأ في قيم التصنيفات الرئيسية"
            );

        const isSubset_Subinterests = Subinterests.every(element => helper.chanceSubcategories.includes(element));
        if(!isSubset_Subinterests) 
            return sendResponse(
                res,
                400,
                "خطأ في قيم التصنيفات الفرعية"
            );

        // Create and save a new student
        const student = await new Student({ first_name, last_name, email, phone, password, applicantGender, DOB, applicantEdu,  saudinationality, saudiCity, tookEnglishTest, EnglishStandard, tookBrainTest, BrainStandard, interests, Subinterests }).save();

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
