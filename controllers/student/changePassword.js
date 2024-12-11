// JS Strict Mode
"use strict";

// Import Packages
const bcrypt = require('bcryptjs');

// Import Models
const Student = require('../../models/Student');

// Import Utilities
const sendResponse = require('../../utils/sendResponse');

/**
 * Method for changing a student's password.
 * Validates the current password and updates it with the new password.
 */
const changePassword = async (req, res) => {
    try {
        // Find the student by their ID
        const student = await Student.findById(req.user._id);
        if (!student) {
            return sendResponse(res, 404, "الطالب غير موجود");
        }

        // Validate the current password
        const isMatch = await student.validatePassword(req.body.current_password);
        if (!isMatch) {
            return sendResponse(res, 202, "كلمة السر خاطئة");
        }

        // Hash the new password
        const new_password = await student.cryptPassword(req.body.new_password);

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
