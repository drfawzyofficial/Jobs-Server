// JS Strict Mode
"use strict";

// Import Models
const Student = require('../../models/Student');

// Import Utilities
const sendResponse = require('../../utils/sendResponse');

/**
 * Method for retrieving a student's profile data.
 * Fetches the student's details using their ID.
 */
const getStudentData = async (req, res) => {
    try {
        // Find the student by their ID
        const student = await Student.findOne({ _id: req.user._id });

        // Send success response with the student data
        return sendResponse(res, 200, "استرجاع بيانات الطالب", student);
    } catch (err) {
        // Log the error for debugging and send error response
        console.error("Error in getStudentData:", err.message);
        return sendResponse(res, 500, err.message, "حدث خطأ في خادم السيرفر");
    }
};

// Export the getStudentData function
module.exports = getStudentData;
