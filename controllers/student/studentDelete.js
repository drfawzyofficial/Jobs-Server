// JS Strict Mode
"use strict";

// Import Models
const Student = require('../../models/Student');

// Import Utilities
const sendResponse = require('../../utils/sendResponse');

/**
 * Controller for deleting a student.
 * Deletes the student record from the database based on the provided user ID.
 */
const studentDelete = async (req, res) => {
    try {
        // Delete the student using the ID from the request user
        await Student.findByIdAndDelete(req.user._id);

        // Send success response
        return sendResponse(res, 200, "تم حذف الطالب بنجاح");
    } catch (err) {
        // Log the error for debugging and send error response
        console.error("Error in studentDelete:", err.message);
        return sendResponse(res, 500, err.message, "حدث خطأ في خادم السيرفر");
    }
};

// Export the studentDelete function
module.exports = studentDelete;
