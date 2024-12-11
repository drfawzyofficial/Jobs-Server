// JS Strict Mode
"use strict";

// Import Models
const Chance = require('../../models/Chance');
const Review = require('../../models/Review');
// Import Utils 
const sendResponse = require('../../utils/sendResponse');

// adminChanceReviewAccept method for accepting the review
const adminChanceReviewAccept = async (req, res) => {
    try {
        let review = await Review.findOne({ _id: req.body.review_id });
        if(!review)
            return sendResponse(res, 401, "التقييم غير موجود");
        
        console.log(req.body.review_id );

        await Review.findByIdAndUpdate({ _id: req.body.review_id  }, { accepted: true }, { new: true });

        return sendResponse(res, 200, "تم قبول الفرصة بنجاح");
    } catch (err) {
        return sendResponse(res, 500, err.message, "حدث خطأ في خادم السيرفر");
    }
}

// Export adminChanceReviewDelete
module.exports = adminChanceReviewAccept;