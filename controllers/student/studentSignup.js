// JS Strict Mode
"use strict";

// Import Packages
const bcrypt = require("bcryptjs");

// Import Models
const Student = require('../../models/Student');
const Code = require('../../models/Code');

// Import Utilities
const sendResponse = require('../../utils/sendResponse');
const sendEmail = require('../../utils/sendEmail');

const saudiCities = ["الرياض", "جدة", "مكة", "المدينة المنورة", "الدمام", "الخبر", "الطائف", "بريدة", "الجبيل", "حفر الباطن", "الظهران", "ينبع", "أبها", "خميس مشيط", "القصيم", "القطيف", "نجران", "تبوك", "جازان", "عرعر", "سكاكا", "الخرج", "الباحة", "بيشة", "القنفذة", "الدوادمي", "رجال ألمع", "محايل عسير", "شرورة", "رابغ", "المجمعة", "بدر", "الرس", "عنيزة", "حائل", "وادي الدواسر", "صبيا", "العيص", "ضباء", "تيماء", "بدر الجنوب", "طريف", "الأفلاج", "الحوطة", "مرات", "رنية", "ليلى", "السليل", "تنومة", "بلجرشي", "المندق", "قلوة", "العلا", "ساجر", "البكيرية", "الزلفي", "دومة الجندل", "عفيف", "الحريق", "الدوادمي", "القريات", "الطريف", "تربة", "رأس تنورة", "الساحل الشرقي", "سدير", "ثادق"];

/**
 * Method for student signup.
 * Creates a new student account and sends a verification code via email.
 */
const studentSignup = async (req, res) => {
    try {
        // Extract student details from the request body
        const { fullname, email, phone, password, nationality, interests, EnglishStandard, BrainStandard } = req.body;
        let saudiCity = req.body.saudiCity;

       

        if (nationality === "سعودي") {
            if (!saudiCities.includes(saudiCity))
                return sendResponse(
                    res,
                    400,
                    "المدينة التي أدخلتها خاطئة"
                );
        }
        else {
            saudiCity = "";
        }


        // Create and save a new student
        const student = await new Student({ fullname, email, phone, password, nationality, saudiCity, interests, EnglishStandard, BrainStandard }).save();

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
