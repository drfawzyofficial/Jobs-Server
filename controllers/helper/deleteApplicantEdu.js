// JS Strict Mode
"use strict";

// Import Models
const Helper = require('../../models/Helper');

// Import Utils 
const sendResponse = require('../../utils/sendResponse');

// deleteApplicantEdu method for deleting a applicantEdu
const deleteApplicantEdu = async (req, res) => {
    try {
        let applicantEdu = req.body.applicantEdu;
        let helper =  await Helper.findById({_id: process.env.HELPER_ID});
        let applicantEdus = helper.applicantEdus.filter((el) => {
            return el !== "المرحلة" 
        });
        if (typeof (applicantEdu) === 'string') {
            if (!applicantEdus.includes(applicantEdu)) {
                return sendResponse(res, 400, "المرحلة التعليمية غير موجودة للحذف");
            } else {
                await Helper.findByIdAndUpdate({_id: process.env.HELPER_ID}, { $pull: { applicantEdus: applicantEdu } });
                return sendResponse(res, 200, "تم حذف المرحلة التعليمية بنجاح", applicantEdu);
            }
        } else return sendResponse(res, 400, "حقل المرحلة التعليمية يجب أن يكون اسمًا"); 
    } catch (err) {
        return sendResponse(res, 500, err.message, "حدث خطأ في خادم السيرفر");
    }
}

// Export deleteApplicantEdu
module.exports = deleteApplicantEdu;