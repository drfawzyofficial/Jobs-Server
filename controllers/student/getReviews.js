// JS Strict Mode
"use strict";

// Import Packages
const mongoose = require('mongoose');

// Import Models
const Review = require('../../models/Review');
const Chance = require('../../models/Chance');

// Import Utils 
const sendResponse = require('../../utils/sendResponse');

// getWishlists method for getting wishlists
const getReviews = async (req, res) => {
    try {
        const chance = await Chance.findById({ _id: req.body._chanceID });
        const page_no = parseInt(req.query.page_no);
        const pageSize = 8;
        if (!page_no) {
            return sendResponse(res, 400, "رقم الصفحة إجباري");
        }
        if (page_no < 0) {
            return sendResponse(res, 400, "رقم الصفحة لا يمكن أن يكون رقمًا سلبيًا");
        }
        const skip = (page_no - 1) * pageSize;
        if (!chance) return sendResponse(res, 401, "الفرصة غير موجودة");
        const reviewsCount = Math.ceil(await Review.find({ _chanceID: mongoose.Types.ObjectId(req.body._chanceID), accepted: true }).count() / 8);
        const reviews = await Review.aggregate([{ $match: { _chanceID: mongoose.Types.ObjectId(req.body._chanceID), accepted: true } }, { $skip: skip }, { $limit: pageSize }]);
        const populatedReviews = await Review.populate(reviews, { path: '_studentID' });
        console.log(populatedReviews);
        return sendResponse(res, 200, "تم استرجاع التقييمات بنجاح", { reviews: populatedReviews, reviewsCount });
    } catch (err) {
        console.log(err.message);
        return sendResponse(res, 500, err.message, "حدث خطأ في خادم السيرفر");
    }
}

// Export getReviews
module.exports = getReviews;