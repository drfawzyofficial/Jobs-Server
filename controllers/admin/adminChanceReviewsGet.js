// JS Strict Mode
"use strict";

// Import Models
const Chance = require('../../models/Chance');
const Review = require('../../models/Review');
// Import Utils 
const sendResponse = require('../../utils/sendResponse');

// adminChanceReviewsGet method for getting all chance reviews
const adminChanceReviewsGet = async (req, res) => {
    try {
        let page_no = parseInt(req.query.page_no);
        if(!page_no) {
            return sendResponse(res, 400, "رقم الصفحة إجباري");
        }
        if(page_no < 0) {
            return sendResponse(res, 400, "رقم الصفحة لا يمكن أن يكون رقمًا سلبيًا");
        }
        let chance = await Chance.findById({ _id: req.body.chance_id });
        if(!chance)
            return sendResponse(res, 401, "الفرصة غير موجودة");


        const reviewsCount = Math.ceil(await Review.find({ _chanceID: req.body.chance_id, accepted: false  }).count() / 8)
        const reviews =  await Review.find({ _chanceID: req.body.chance_id, accepted: false }).limit(8).skip(8 * (page_no - 1)).exec()
        return sendResponse(res, 200, "تم استعادة جميع الفرص بنجاح", {reviewsCount, reviews});
    } catch (err) {
        return sendResponse(res, 500, err.message, "حدث خطأ في خادم السيرفر");
    }
}

// Export adminChancesGet
module.exports = adminChanceReviewsGet;