// JS Strict Mode
"use strict";

// Import Models
const Contact = require('../../models/Contact');

// Import Utils 
const sendResponse = require('../../utils/sendResponse');

// studentRemove method for removing a student
const studentContactRemove = async (req, res) => {
    try {
        let contact = await Contact.findById({ _id: req.body._id });
        if(!contact) 
            return sendResponse(res, 404, "التواصل غير موجود");
         contact = await Contact.findByIdAndRemove({ _id: req.body._id });
        return sendResponse(res, 200, "تم حذف التواصل بنجاح", contact);
    } catch (err) {
        return sendResponse(res, 500, err.message, "حدث خطأ في خادم السيرفر");
    }
}

// Export studentRemove
module.exports = studentContactRemove;