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
        if(!chance) return sendResponse(res, 401, "الفرصة غير موجودة");
        const reviews = await Review.aggregate([{ $match: { _chanceID: mongoose.Types.ObjectId(req.body._chanceID), accepted: true } }, { $sample: { size: 12 } }]);
        const populatedReviews = await Review.populate(reviews, { path: '_studentID' }); 
        return sendResponse(res, 200, "تم استرجاع التقييمات بنجاح", { reviews: populatedReviews });
    } catch (err) {
        console.log(err.message);
        return sendResponse(res, 500, err.message, "حدث خطأ في خادم السيرفر");
    }
}

// Export getReviews
module.exports = getReviews;