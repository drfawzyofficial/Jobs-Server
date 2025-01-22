// JS Strict Mode
"use strict";

// Import Packages

// Import Models
const Admin = require('../../models/Admin');

// Import Utils 
const sendResponse = require('../../utils/sendResponse');

// getAdmins method for getting students data
const getAdmins = async (req, res) => {
    try {
        const admins = await Admin.find({ _id: {$ne: req.user._id}});
        return sendResponse(res, 200, "تم استرجاع بيانات المسؤولين بنجاح", admins);
    } catch (err) {
        return sendResponse(res, 500, err.message, "حدث خطأ في خادم السيرفر");
    }
}

// Export getAdmins
module.exports = getAdmins;