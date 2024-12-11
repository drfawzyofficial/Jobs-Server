// JS Strict Mode
"use strict";

// Import Packages

// Import Models
const Student = require('../../models/Student');

// Import Utils 
const sendResponse = require('../../utils/sendResponse');

// getStudents method for getting students data
const getStudents = async (req, res) => {
    try {
        let page_no = parseInt(req.query.page_no);
        if(!page_no) {
            return sendResponse(res, 400, "رقم الصفحة إجباري");
        }
        if(page_no < 0) {
            return sendResponse(res, 400, "رقم الصفحة لا يمكن أن يكون رقمًا سلبيًا");
        }
        const studentsCount = Math.ceil(await Student.find({ }).count() / 10)
        const students =  await Student.find({ }).limit(10).skip(10 * (page_no - 1)).exec()
        return sendResponse(res, 200, "تم استرجاع بيانات الطلاب بنجاح", {students, studentsCount});
    } catch (err) {
        return sendResponse(res, 500, err.message, "حدث خطأ في خادم السيرفر");
    }
}

// Export getStudents
module.exports = getStudents;