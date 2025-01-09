// JS Strict Mode
"use strict";

// Import Packages

// Import Models
const Chance = require('../../models/Chance');

// Import Utils 
const sendResponse = require('../../utils/sendResponse');

// Increment clicks
const IncrementChance = async (req, res) => {
    try {
        const _chanceID = req.body._chanceID;
        await Chance.findByIdAndUpdate(_chanceID, { $inc: { noOfClicks: 1 } });
        return sendResponse(res, 200, "تم زيادة عداد الفرصة");
    } catch (err) {
        return sendResponse(res, 500, err.message, "حدث خطأ في خادم السيرفر");
    }
}

// Export IncrementChance
module.exports = IncrementChance;