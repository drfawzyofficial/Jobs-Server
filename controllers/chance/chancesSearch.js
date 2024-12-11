// JS Strict Mode
"use strict";

// Import Packages
const moment = require("moment");

// Import Models
const Chance = require('../../models/Chance');

// Import Utils 
const sendResponse = require('../../utils/sendResponse');

// chancesSearch for searching for a chance
const chancesSearch = async (req, res) => {
    try {
        let filter = { };
        const { chanceName, programStatus, chanceCategory, chanceSubcategory } = req.body;

        if(chanceName !== "")
            filter["chanceName"] = chanceName
        if(programStatus.trim() !== "حالة البرنامج")
            filter["programStatus"] = programStatus
        if(chanceCategory!== "التصنيف الرئيسي")
            filter["chanceCategory"] = chanceCategory
        if(chanceSubcategory!== "التصنيف الفرعي")
            filter["chanceSubcategory"] = chanceSubcategory
        
        let chances = await Chance.find(filter);
        let chancesCount = Math.ceil(chances.length / 10);
        return sendResponse(res, 200, "تم فلترة البحث بنجاح", {chances, chancesCount});
    } catch (err) {
        return sendResponse(res, 500, err.message, "حدث خطأ في خادم السيرفر");
    }
}

// Export chancesSearch
module.exports = chancesSearch;