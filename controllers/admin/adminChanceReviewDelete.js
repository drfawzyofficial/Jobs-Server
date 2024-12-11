// JS Strict Mode
"use strict";

// Import Models
const Review = require('../../models/Review');
// Import Utils 
const sendResponse = require('../../utils/sendResponse');

// adminChanceReviewDelete method for deleting the review
const adminChanceReviewDelete = async (req, res) => {
    try {
        let review = await Review.findOne({ _id: req.body.review_id });
        if(!review)
            return sendResponse(res, 401, "التقييم غير موجود");

        await Review.findByIdAndDelete({ _id: req.body.review_id  });

        return sendResponse(res, 200, "تم حذف تقييم الفرصة بنجاح");
    } catch (err) {
        return sendResponse(res, 500, err.message, "حدث خطأ في خادم السيرفر");
    }
}

// Export adminChanceReviewDelete
module.exports = adminChanceReviewDelete;