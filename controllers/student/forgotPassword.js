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

/**
 * Method for handling forgot password requests.
 * Generates a verification code and sends it to the user's email or phone.
 */
const forgotPassword = async (req, res) => {
    try {
        // Extract identifier from the request body
        const { identifier } = req.body;

        // Validate that identifier is provided
        if (!identifier || identifier.trim().length === 0) {
            return sendResponse(res, 400, "حقل البريد الإلكتروني أو رقم الهاتف مطلوب");
        }

        // Find the student by email or phone
        const student = await Student.findOne({
            $or: [{ email: identifier }, { phone: identifier }]
        });
        if (!student) {
            return sendResponse(res, 401, "البريد الإلكتروني أو رقم الهاتف خطأ");
        }

        // Generate a random verification code (5 digits)
        const generatedCode = Math.floor(Math.random() * 90000) + 10000;

        // Hash the generated code using bcrypt
        const salt = await bcrypt.genSalt(Number(process.env.SALT_WORK_FACTOR));
        const hashedCode = await bcrypt.hash(String(generatedCode), salt);

        // Delete existing code if found and save the new hashed code
        await Code.findOneAndDelete({ _studentID: student._id });
        await new Code({ _studentID: student._id, code: hashedCode, for: "ResetPassword" }).save();

        // Prepare mail configuration and content
        const mail = {
            mailService: process.env.SYSTEM_SERVICE_NODEMAILER,
            mailHost: process.env.SYSTEM_HOST_NODEMAILER,
            mailPort: Number(process.env.SYSTEM_PORT_NODEMAILER),
            mailAddress: process.env.SYSTEM_EMAIL_NODEMAILER,
            mailPassword: process.env.SYSTEM_PASS_NODEMAILER
        };
        const content = {
            subject: "طلب استعادة كلمة السر",
            title: "منصة خطط",
            message: `الرمز الخاص بك هو ${generatedCode}. لاحظ أن الرمز صالح لمدة ساعة واحدة فقط`
        };

        // Send verification code via email
        await sendEmail(mail, student, content);

        // Send success response
        return sendResponse(res, 200, "تم إرسال الرمز بنجاح، يرجى التحقق من بريدك الإلكتروني أو الهاتف");
    } catch (err) {
        // Log the error for debugging and send error response
        console.error("Error in forgotPassword:", err.message);
        return sendResponse(res, 500, err.message, "حدث خطأ في خادم السيرفر");
    }
};

// Export the forgotPassword function
module.exports = forgotPassword;
