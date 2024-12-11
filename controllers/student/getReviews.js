// JS Strict Mode
"use strict";

// Import Packages
const mongoose = require('mongoose');

// Import Models
const Review = require('../../models/Review');

// Import Utils 
const sendResponse = require('../../utils/sendResponse');

// getWishlists method for getting wishlists
const getReviews = async (req, res) => {
    try {
        const reviews = await Review.aggregate([{ $match: { _chanceID: mongoose.Types.ObjectId(req.body.id), accepted: true } }, { $sample: { size: 10 } }]);
        const populatedReviews = await Review.populate(reviews, { path: '_studentID', path: '_chanceID' }); 
        return sendResponse(res, 200, "تم استرجاع التقييمات بنجاح", { reviews: populatedReviews });
    } catch (err) {
        console.log(err.message);
        return sendResponse(res, 500, err.message, "حدث خطأ في خادم السيرفر");
    }
}

// Export getReviews
module.exports = getReviews;