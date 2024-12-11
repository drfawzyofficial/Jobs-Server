// JS Strict Mode
"use strict";

// Import Models
const Helper = require('../../models/Helper');

// Import Utils 
const sendResponse = require('../../utils/sendResponse');

// helperPost method for creating a chance
const helperPost = async (req, res) => {
    try {
        let data = req.body;
        let errors = {};
        let helper =  await Helper.findById({_id: process.env.HELPER_ID});
        let chanceCategories = helper.chanceCategories;
        let chanceSubcategories = helper.chanceSubcategories;
        let applicantEdus = helper.applicantEdus;


        if (typeof (data.chanceCategory) === 'string') {
            if (data.chanceCategory.trim() && chanceCategories.includes(data.chanceCategory.trim())) {
                errors["chanceCategory"] = ['تصنيف الفرصة موجود مُسبقًا'];
            }
        } else errors["chanceCategory"] = ['حقل تصنيف الفرصة يجب أن يكون اسمًا'];

        if (typeof (data.chanceSubcategory) === 'string') {
            if (data.chanceSubcategory.trim() && chanceSubcategories.includes(data.chanceSubcategory.trim())) {
                errors["chanceSubcategory"] = ['تصنيف الفرصة الفرعي موجود مُسبقًا'];
            }
        } else errors["chanceSubcategory"] = ['حقل تصنيف الفرصة يجب أن يكون اسمًا'];



        if (typeof (data.applicantEdu) === 'string') {
            if (data.applicantEdu.trim() && applicantEdus.includes(data.applicantEdu.trim())) {
                errors["applicantEdu"] = ['المرحلة التعليمية موجودة مُسبقًا'];
            }
        } else errors["applicantEdu"] = ['حقل المرحلة التعليمية يجب أن يكون اسمًا'];


        if(data.chanceCategory.trim().length === 0 && data.chanceSubcategory.trim().length === 0 && data.applicantEdu.trim().length === 0) {
            errors["additionalError"] = ['يجب إدخال حقل واحد على الأقل'];
        }

        if (Object.keys(errors).length) {
            const result = { errors: errors }
            return sendResponse(res, 400, "فشل التحقق من صحة المدخلات", result);
        }
        
        if(data.chanceCategory.trim()) {
            await Helper.findByIdAndUpdate({_id: process.env.HELPER_ID}, { $push: { chanceCategories: data.chanceCategory.trim() } });
        }

        if(data.chanceSubcategory.trim()) {
            await Helper.findByIdAndUpdate({_id: process.env.HELPER_ID}, { $push: { chanceSubcategories: data.chanceSubcategory.trim() } });
        }
        
        if(data.applicantEdu.trim()) {
            await Helper.findByIdAndUpdate({_id: process.env.HELPER_ID}, { $push: { applicantEdus: data.applicantEdu.trim() } });
        }

        return sendResponse(res, 200, "تم الإضافة بنجاح", req.body);
        
    } catch (err) {
        console.log(err.message)
        return sendResponse(res, 500, err.message, "حدث خطأ في خادم السيرفر");
    }
}

// Export helperPost
module.exports = helperPost;