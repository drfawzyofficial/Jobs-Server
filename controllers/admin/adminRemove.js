// JS Strict Mode
"use strict";

// Import Models
const Admin = require('../../models/Admin');

// Import Utils 
const sendResponse = require('../../utils/sendResponse');

// adminRemove method for removing a admin
const adminRemove = async (req, res) => {
    try {
        let admin = await Admin.findById({ _id: req.body._id });
        if(!admin) 
            return sendResponse(res, 404, "المسؤول  غير موجود");
         admin = await Admin.findByIdAndRemove({ _id: req.body._id });
        return sendResponse(res, 200, "تم حذف المسؤول  بنجاح", admin);
    } catch (err) {
        return sendResponse(res, 500, err.message, "حدث خطأ في خادم السيرفر");
    }
}

// Export adminRemove
module.exports = adminRemove;