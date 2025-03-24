// JS Strict Mode
"use strict";

// Import Packages
const bcrypt = require('bcryptjs');

// Import Models
const Student = require('../../models/Student');

// Import Utilities
const sendResponse = require('../../utils/sendResponse');
const { isRequired, isString, isMinLength, matchesRegex, isConfirmed } = require("../../utils/funcs");


/**
 * Method for changing a student's password.
 * Validates the current password and updates it with the new password.
 */
const changePassword = async (req, res) => {
    try {

        let { current_password, new_password, new_password_confirmation } = req.body;
        const errors = {};
        // Find the student by their ID
        const student = await Student.findById(req.user._id);
        if (!student) {
            return sendResponse(res, 404, "الحساب غير موجود");
        }

        // Validate the current password
        const isMatch = await student.validatePassword(current_password);
        if (!isMatch) {
            return sendResponse(res, 202, "كلمة السر خاطئة");
        }

        if (!isRequired(new_password) || !isString(new_password) || !isMinLength(new_password, 6) || !matchesRegex(new_password, /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]/)) {
            errors["new_password"] = ["يجب أن تتكون كلمة المرور الجديدة من 6 أحرف على الأقل وتحتوي على حرف كبير وحرف صغير ورقم."];
        }

        if (!isRequired(new_password_confirmation) || !isConfirmed(new_password, new_password_confirmation)) {
            errors["new_password_confirmation "] = ["تأكيد كلمة المرور غير متطابق، الرجاء التأكد من إدخال نفس كلمة المرور."];
        }

        // Check for validation errors
        if (Object.keys(errors).length) {
            return sendResponse(res, 400, "فشل في عملية تحقق المدخلات", { errors });
        }

        // Hash the new password
        new_password = await student.cryptPassword(req.body.new_password);

        // Update the student's password
        await Student.findByIdAndUpdate(req.user._id, { password: new_password });

        // Send success response
        return sendResponse(res, 200, "تم تحديث كلمة السر بنجاح");
    } catch (err) {
        // Log the error for debugging and send error response
        console.error("Error in changePassword:", err.message);
        return sendResponse(res, 500, err.message, "حدث خطأ في خادم السيرفر");
    }
};

// Export the changePassword function
module.exports = changePassword;
