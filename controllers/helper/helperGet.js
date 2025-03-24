// JS Strict Mode
"use strict";

// Import Models
const Helper = require('../../models/Helper');

// Import Utils 
const sendResponse = require('../../utils/sendResponse');

// helperGet method for getting the helper
const helperGet = async (req, res) => {
    try {
        console.log(process.env.HELPER_ID);
        const helper = await Helper.findById({ _id: process.env.HELPER_ID });
        return sendResponse(res, 200, "تمت الاستعادة بنجاح", helper);
    } catch (err) {
        console.log(err.message)
        return sendResponse(res, 500, err.message, "حدث خطأ في خادم السيرفر");
    }
}

// Export helperGet
module.exports = helperGet;