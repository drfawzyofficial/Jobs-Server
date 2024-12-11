// JS Strict Mode
"use strict";

// Import Models
const Student = require('../../models/Student');

// Import Utilities
const sendResponse = require('../../utils/sendResponse');

/**
 * Method for updating a student's profile picture.
 * Updates the avatar field with the new image URL.
 */
const uploadImage = async (req, res) => {
    try {
        // Update the student's avatar with the new image URL
        await Student.findByIdAndUpdate(
            { _id: req.user._id },
            { avatar: `${process.env.SERVER_URL}/uploads/avatars/${req.user._id}-avatar.png` }
        );

        // Send success response
        return sendResponse(res, 200, "تم تحديث الصورة بنجاح");
    } catch (err) {
        // Send error response if any issues occur
        console.error("Error updating image:", err.message);
        return sendResponse(res, 500, err.message, "حدث خطأ في خادم السيرفر");
    }
};

// Export the uploadImage function
module.exports = uploadImage;
