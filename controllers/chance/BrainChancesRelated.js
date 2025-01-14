// JS Strict Mode
"use strict";

// Import Models
const Chance = require('../../models/Chance');
const Student = require('../../models/Student');

// Import Utils 
const sendResponse = require('../../utils/sendResponse');

// EnglishChancesGet method for getting a chance
const BrainChancesRelated = async (req, res) => {
    try {
        const user = await Student.findById(req.user._id);
        const chance = await Chance.findById(req.body._id);
        if(!chance)
            return sendResponse(res, 404, "الفرصة غير موجودة");
        let search_query = {applicantEdus: { $in: [user.applicantEdu] }, chanceSubcategory: "عقلي", _id: { $ne: req.body._id } };
        const chances = await Chance.find(search_query);
        const result = { chances: chances };
        return sendResponse(res, 200, "تم استرجاع الفرص بنجاح", result);
    } catch (err) {
        console.log(err.message);
        return sendResponse(res, 500, err.message, "حدث خطأ في خادم السيرفر");
    }
}

// Export BrainChancesRelated
module.exports = BrainChancesRelated;