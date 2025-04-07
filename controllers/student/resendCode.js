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
 * Method for resending a verification code to the student's email address.
 * Generates a new code, saves it, and sends it via email.
 */
const resendCode = async (req, res) => {
    try {
        // Find the student by their ID
        const student = await Student.findById(req.user._id);
        if (student.is_verified) {
            return sendResponse(res, 400, "الحساب مفعل سابقًا");
        }

        // Check if there is an existing code and delete it
        const existingCode = await Code.findOne({ _studentID: req.user._id, for: "Signup" });
        const generatedCode = Math.floor(Math.random() * 90000) + 10000;
        const salt = await bcrypt.genSalt(Number(process.env.SALT_WORK_FACTOR));
        const hashedCode = await bcrypt.hash(String(generatedCode), salt);

        if (existingCode) {
            await Code.findOneAndDelete({ _studentID: req.user._id, for: "Signup" });
        }

        // Save the new code in the database
        await new Code({ _studentID: student._id, code: hashedCode, for: "Signup" }).save();

        // Prepare mail configuration and content
        const mail = {
            mailService: process.env.SYSTEM_SERVICE_NODEMAILER,
            mailHost: process.env.SYSTEM_HOST_NODEMAILER,
            mailPort: Number(process.env.SYSTEM_PORT_NODEMAILER),
            mailAddress: process.env.SYSTEM_EMAIL_NODEMAILER,
            mailPassword: process.env.SYSTEM_PASS_NODEMAILER,
        };
        const content = {
            subject: "تأكيد البريد الإلكتروني",
            title: "منصة الفرص",
            message: `الرمز الخاص بك هو ${generatedCode}. لاحظ أن الرمز صالح فقط لمدة ساعة واحدة `
        };

        // Send the code to the student's email
        await sendEmail(mail, student, content);

        // Send success response
        return sendResponse(res, 200, "تم إعادة إرسال الرمز بنجاح");
    } catch (err) {
        // Log the error for debugging and send error response
        console.error("Error in resendCode:", err.message);
        return sendResponse(res, 500, err.message, "حدث خطأ في خادم السيرفر");
    }
};

// Export the resendCode function
module.exports = resendCode;
