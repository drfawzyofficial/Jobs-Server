// JS Strict Mode
"use strict";

// Import Models
const Chance = require('../../models/Chance');

// Import Utils 
const sendResponse = require('../../utils/sendResponse');

// chanceGet method for getting a chance
const chanceGet = async (req, res) => {
    try {
        const chance = await Chance.findById({ _id: req.body.id });
        if(!chance) 
            return sendResponse(res, 404, "الوظيفة غير موجودة");
        const result = { chance: chance }
        return sendResponse(res, 200, "تم استرجاع الوظيفة بنجاح", result);
    } catch (err) {
        console.log(err.message);
        return sendResponse(res, 500, err.message, "حدث خطأ في خادم السيرفر");
    }
}

// Export chanceGet
module.exports = chanceGet;