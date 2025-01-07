// JS Strict Mode
"use strict";

// Import Models
const Chance = require('../../models/Chance');
const Review = require('../../models/Review');

// Import Utils 
const sendResponse = require('../../utils/sendResponse');

// chanceRemove method for deleting a chance
const chanceRemove = async (req, res) => {
    try {
        let chance = await Chance.findById({ _id: req.body._id });
        if(!chance) 
            return sendResponse(res, 404, "الفرصة غير موجودة");
         chance = await Chance.findByIdAndRemove({ _id: req.body._id });
        await Review.deleteMany({ _chanceID: req.body._id });
        return sendResponse(res, 200, "تم حذف الوظيفة بنجاح", chance);
    } catch (err) {
        return sendResponse(res, 500, err.message, "حدث خطأ في خادم السيرفر");
    }
}

// Export chanceRemove
module.exports = chanceRemove;