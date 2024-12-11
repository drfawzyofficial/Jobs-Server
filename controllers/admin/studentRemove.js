// JS Strict Mode
"use strict";

// Import Models
const Student = require('../../models/Student');

// Import Utils 
const sendResponse = require('../../utils/sendResponse');

// studentRemove method for removing a student
const studentRemove = async (req, res) => {
    try {
        let student = await Student.findById({ _id: req.body._id });
        if(!student) 
            return sendResponse(res, 404, "الطالب غير موجود");
         student = await Student.findByIdAndRemove({ _id: req.body._id });
        return sendResponse(res, 200, "تم حذف الطالب بنجاح", student);
    } catch (err) {
        return sendResponse(res, 500, err.message, "حدث خطأ في خادم السيرفر");
    }
}

// Export studentRemove
module.exports = studentRemove;