// JS Strict Mode
"use strict";

// Import Models
const Helper = require('../../models/Helper');

// Import Utils 
const sendResponse = require('../../utils/sendResponse');

// deleteChanceCategory method for deleting a chanceCategory
const deleteChanceCategory = async (req, res) => {
    try {
        let chanceCategory = req.body.chanceCategory;
        let helper =  await Helper.findById({_id: process.env.HELPER_ID});
        let chanceCategories = helper.chanceCategories;
        if (typeof (chanceCategory) === 'string') {
            if (!chanceCategories.includes(chanceCategory)) {
                return sendResponse(res, 400, "تصنيف الفرصة غير موجودة للحذف");
            } else {
                await Helper.findByIdAndUpdate({_id: process.env.HELPER_ID}, { $pull: { chanceCategories: chanceCategory } });
                return sendResponse(res, 200, "تم حذف التصنيف بنجاح", chanceCategory);
            }
        } else return sendResponse(res, 400, "حقل تصنيف الفرصة يجب أن يكون اسمًا"); 
    } catch (err) {
        return sendResponse(res, 500, err.message, "حدث خطأ في خادم السيرفر");
    }
}

// Export deleteChanceCategory
module.exports = deleteChanceCategory;