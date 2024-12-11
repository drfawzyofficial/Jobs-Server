// JS Strict Mode
"use strict";

// Import Models
const Student = require('../../models/Student');

// Import Utilities
const sendResponse = require('../../utils/sendResponse');

/**
 * Method for logging out a student.
 * Sets the student's online status to false.
 */
const studentLogout = async (req, res) => {
    try {
        // Update the student's online status to false
        await Student.findByIdAndUpdate(
            { _id: req.user._id },
            { online: false },
            { new: true }
        );

        // Send success response
        return sendResponse(res, 200, "تم تسجيل الخروج بنجاح");
    } catch (err) {
        // Log the error and send error response
        console.error("Error in studentLogout:", err.message);
        return sendResponse(res, 500, err.message, "حدث خطأ في خادم السيرفر");
    }
};

// Export the studentLogout function
module.exports = studentLogout;
