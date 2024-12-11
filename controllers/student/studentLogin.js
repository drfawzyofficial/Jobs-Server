// JS Strict Mode
"use strict";

// Import Packages
const jwt = require('jsonwebtoken');

// Import Models
const Student = require('../../models/Student');

// Import Utilities
const sendResponse = require('../../utils/sendResponse');

/**
 * Method for logging in a student.
 * Validates the student's email and password, sets the online status, and returns a JWT token.
 */
const studentLogin = async (req, res) => {
    try {
        // Extract identifier and password from the request body
        const { identifier, password } = req.body;

        // Validate that both fields are provided
        if (!identifier || !password) {
            return sendResponse(res, 400, "جميع الحقول مطلوبة");
        }

        // Find the student by email or phone
        const student = await Student.findOne({
            $or: [{ email: identifier }, { phone: identifier }]
        });

        if (!student) {
            return sendResponse(res, 401, "الطالب غير موجود");
        }

        // Validate the provided password
        const isMatch = await student.validatePassword(password);
        if (!isMatch) {
            return sendResponse(res, 401, "كلمة المرور خاطئة");
        }

        // Set the student's online status to true
        await Student.findByIdAndUpdate(
            { _id: student._id },
            { online: true },
            { new: true }
        );

        // Generate a JWT token for the student
        const token = jwt.sign({ _id: student._id }, process.env.JWT_KEY);

        // Prepare the response data with the token
        const result = { token };

        // Send success response with the generated token
        return sendResponse(res, 200, "تم تسجيل الدخول بنجاح", result);
    } catch (err) {
        // Log the error for debugging and send error response
        console.error("Error in studentLogin:", err.message);
        return sendResponse(res, 500, err.message, "حدث خطأ في خادم السيرفر");
    }
};

// Export the studentLogin function
module.exports = studentLogin;
