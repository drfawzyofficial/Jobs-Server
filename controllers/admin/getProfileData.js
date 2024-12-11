// JS Strict Mode
"use strict";

// Import Packages

// Import Models
const Admin = require('../../models/Admin');
// Import Utils 
const sendResponse = require('../../utils/sendResponse');

// getProfileData method for getting profile data
const getProfileData = async (req, res) => {
    try {
        const admin = await Admin.findOne({ _id: req.user._id });
        return sendResponse(res, 200, "Profile Data", admin);
    } catch (err) {
        return sendResponse(res, 500, err.message, "حدث خطأ في خادم السيرفر");
    }
}

// Export getProfileData
module.exports = getProfileData;