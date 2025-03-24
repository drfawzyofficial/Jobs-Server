// JS Strict Mode
"use strict";

// Import Models
const Student = require('../../models/Student');

// Import Utilities
const sendResponse = require('../../utils/sendResponse');

/**
 * Controller for enabling student notifications.
 */
const enableNotifications = async (req, res) => {
    try {
        let enable_notifications = req.body.enable_notifications;
        
        // Check if "enable_notifications" is explicitly true or false
        if (typeof enable_notifications !== "boolean") {
            return sendResponse(res, 400, "يجب تحديد ما إذا كانت الإشعارات مفعلة أو معطلة");
        }

        // Update the student's notifications
        await Student.findByIdAndUpdate(req.user._id, { $set: { enable_notifications: enable_notifications } });

        // Send success response
        return sendResponse(res, 200, "تم التعديل بنجاح الاشعارات بنجاح");
    } catch (err) {
        // Log the error for debugging and send error response
        console.error("Error in enableNotifications:", err.message);
        return sendResponse(res, 500, err.message, "حدث خطأ في خادم السيرفر");
    }
};

// Export the enableNotifications function
module.exports = enableNotifications;
