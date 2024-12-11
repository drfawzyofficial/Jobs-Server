// JS Strict Mode
"use strict";

// Import Models
const Chance = require('../../models/Chance');

// Import Utils 
const sendResponse = require('../../utils/sendResponse');

// adminChancesGet method for getting all chances
const adminChancesGet = async (req, res) => {
    try {
        let page_no = parseInt(req.query.page_no);
        if(!page_no) {
            return sendResponse(res, 400, "رقم الصفحة إجباري");
        }
        if(page_no < 0) {
            return sendResponse(res, 400, "رقم الصفحة لا يمكن أن يكون رقمًا سلبيًا");
        }
        const chancesCount = Math.ceil(await Chance.find({ }).count() / 8)
        const chances =  await Chance.find({ }).limit(8).skip(8 * (page_no - 1)).exec()
        console.log(chances);
        return sendResponse(res, 200, "تم استعادة جميع الفرص بنجاح", {chances, chancesCount});
    } catch (err) {
        return sendResponse(res, 500, err.message, "حدث خطأ في خادم السيرفر");
    }
}

// Export adminChancesGet
module.exports = adminChancesGet;