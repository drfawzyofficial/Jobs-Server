// JS Strict Mode
"use strict";

// Import Models
const Helper = require('../../models/Helper');

// Import Utils 
const sendResponse = require('../../utils/sendResponse');

// helperGet method for getting the helper
const helperGet = async (req, res) => {
    try {
        const helper = await Helper.findById({ _id: process.env.HELPER_ID });
        return sendResponse(res, 200, "تم استعادة المساعدات", helper);
    } catch (err) {
        console.log(err.message)
        return sendResponse(res, 500, err.message, "حدث خطأ في خادم السيرفر");
    }
}

// Export helperGet
module.exports = helperGet;