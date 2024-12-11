// JS Strict Mode
"use strict";

// Import Models
const Student = require('../../models/Student');
const Code = require('../../models/Code');

// Import Utilities
const sendResponse = require('../../utils/sendResponse');

/**
 * Method for submitting the verification code sent to the student's email address.
 * Verifies the code and activates the student's account.
 */
const submitCode = async (req, res) => {
    try {
        // Find the student by their ID
        const student = await Student.findById(req.user._id);
        if (student.is_verified) {
            return sendResponse(res, 400, "الحساب مفعل سابقًا");
        }

        // Find the code associated with the student's ID
        const code = await Code.findOne({ _studentID: req.user._id, for: "Signup" });
        if (!code) {
            return sendResponse(res, 400, "تم انتهاء صلاحية الكود");
        }

        // Check if the provided code matches the stored code
        const isMatch = await code.checkCode(req.body.code);
        if (!isMatch) {
            return sendResponse(res, 400, "الكود غير متطابق");
        }

        // Update the student's verification status and delete the used code
        await Student.findByIdAndUpdate(req.user._id, { is_verified: true });
        await Code.findOneAndDelete({ _studentID: req.user._id });

        // Send success response
        return sendResponse(res, 200, "تم تفعيل الحساب بنجاح");
    } catch (err) {
        // Log the error for debugging and send error response
        console.error("Error in submitCode:", err.message);
        return sendResponse(res, 500, err.message, "حدث خطأ في خادم السيرفر");
    }
};

// Export the submitCode function
module.exports = submitCode;
