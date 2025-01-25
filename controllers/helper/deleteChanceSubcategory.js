// JS Strict Mode
"use strict";

// comment

// Import Models
const Helper = require('../../models/Helper');

// Import Utils 
const sendResponse = require('../../utils/sendResponse');

// deletechancesubcategory method for deleting a chanceCategory
const deletechancesubcategory = async (req, res) => {
    try {
        let chanceSubcategory = req.body.chanceSubcategory;
        let helper =  await Helper.findById({_id: process.env.HELPER_ID});
        let chanceSubcategories = helper.chanceSubcategories;
        if (typeof (chanceSubcategory) === 'string') {
            if (!chanceSubcategories.includes(chanceSubcategory)) {
                return sendResponse(res, 400, "حقل تصنيف الفرصة الفرعي غير موجودة للحذف");
            } else {
                await Helper.findByIdAndUpdate({_id: process.env.HELPER_ID}, { $pull: { chanceSubcategories: chanceSubcategory } });
                return sendResponse(res, 200, "تم حذف تصنيف الفرصة الفرعي بنجاح", chanceSubcategory);
            }
        } else return sendResponse(res, 400, "حقل تصنيف الفرصة الفرغي يجب أن يكون اسمًا"); 
    } catch (err) {
        return sendResponse(res, 500, err.message, "حدث خطأ في خادم السيرفر");
    }
}

// Export deletechancesubcategory
module.exports = deletechancesubcategory;