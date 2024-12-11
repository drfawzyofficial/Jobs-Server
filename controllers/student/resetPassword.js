// JS Strict Mode
"use strict";

// Import Models
const Student = require('../../models/Student');
const Code = require('../../models/Code');

// Import Utilities
const sendResponse = require('../../utils/sendResponse');

/**
 * Method for validating a reset password request using a code.
 * Checks if the provided code matches the stored code for the student.
 */
const resetPassword = async (req, res) => {
    try {
        // Extract identifier and code from the request body
        const { identifier, code } = req.body;

        // Find the student by email or phone
        const student = await Student.findOne({
            $or: [{ email: identifier }, { phone: identifier }]
        });
        if (!student) {
            return sendResponse(res, 400, "البريد الإلكتروني أو رقم الهاتف خطأ");
        }

        // Validate the provided code
        if (!code || code.trim().length === 0) {
            return sendResponse(res, 400, "حقل الكود المرسل مطلوب");
        }

        // Find the code associated with the student
        const sent_code = await Code.findOne({ _studentID: student._id, for: "ResetPassword" });
        if (!sent_code) {
            return sendResponse(res, 401, "تم انتهاء صلاحية الكود");
        }

        // Verify if the provided code matches the stored code
        const isMatch = await sent_code.checkCode(code);
        if (!isMatch) {
            return sendResponse(res, 400, "الكود غير متطابق");
        }

        // Send success response if the code matches
        return sendResponse(res, 200, "الكود متطابق");
    } catch (err) {
        // Log the error for debugging and send error response
        console.error("Error in resetPassword:", err.message);
        return sendResponse(res, 500, err.message, "حدث خطأ في خادم السيرفر");
    }
};

// Export the resetPassword function
module.exports = resetPassword;
