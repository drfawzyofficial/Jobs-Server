// JS Strict Mode
"use strict";

// Import Models
const Chance = require('../../models/Chance');
const Helper = require('../../models/Helper');
const Student = require('../../models/Student');
// Import Utils 
const sendResponse = require('../../utils/sendResponse');

// Import Variables
const chance_cases = ["open", "closed", "not_started"];

// Import Functions
const getChancesByCase = async (chance_case) => {
    const today = new Date().toISOString().split('T')[0]; // Get today's date

    let query = {};

    if (chance_case === "open") {
        query = {
            chanceRegStartDate: { $lte: today }, // Start date <= today
            chanceRegEndDate: { $gte: today },   // End date >= today
        };
    } else if (chance_case === "closed") {
        query = {
            chanceRegEndDate: { $lt: today }, // End date < today
        };
    } else if (chance_case === "not_started") {
        query = {
            chanceRegStartDate: { $gt: today }, // Start date > today
        };
    } else return {}
    return query;
}

const search = async (chance_case, edu_case, interest_case, interests) => {
    let search_query = {};
    
    let chance_case_query = await getChancesByCase(chance_case);
    if (Object.keys(chance_case_query).length !== 0)
        for (let key in chance_case_query) {
            search_query[key] = chance_case_query[key];
        }
    if(edu_case !== "none")
        search_query.applicantEdus = { $in: [edu_case] };
    if(interest_case !== "none") {
        if(interest_case === "more_relevant")
            search_query.chanceCategory = { $in: interests };
        else
        search_query.chanceCategory = interest_case;
    }
        
     return search_query;
}

// chancesGet method for getting all chances
const chancesGet = async (req, res) => {
    try {
        let chance_cases = ["none", "open", "closed", "not_started"];
        const student = await Student.findOne({ _id: req.user._id });
        let helper = await Helper.findById({ _id: process.env.HELPER_ID });
        let applicantEdus = helper.applicantEdus;
        let chanceCategories = helper.chanceCategories;
        applicantEdus.push("none");
        chanceCategories.push("none");
        chanceCategories.push("more_relevant");
        let page_no =parseInt(req.query.page_no);
        let chance_case = req.query.chance_case;
        let edu_case = req.query.edu_case;
        let interest_case = req.query.interest_case;
        if(!page_no) {
            return sendResponse(res, 400, "رقم الصفحة إجباري");
        }
        if(page_no < 0) {
            return sendResponse(res, 400, "رقم الصفحة لا يمكن أن يكون رقمًا سلبيًا");
        }
        if (!chance_cases.includes(chance_case))
            return sendResponse(res, 400, "حالة الفرصة يجب أن تكون قيمة صحيحة");
        if (!applicantEdus.includes(edu_case))
            return sendResponse(res, 400, "المرحلة التعليمية يجب أن تكون قيمة صحيحة");
        if (!chanceCategories.includes(interest_case))
            return sendResponse(res, 400, "التصنيف الأساسي يجب أن يكون قيمة صحيحة");
        let search_query = await search(chance_case, edu_case, interest_case, student.interests);
        const chancesCount = Math.ceil(await Chance.find(search_query).count() / 8);
        const chances = await Chance.find(search_query).limit(8).skip(8 * (page_no - 1)).exec()
        return sendResponse(res, 200, "تم استعادة جميع الوظائف بنجاح", { chances, chancesCount });
    } catch (err) {
        console.log(err.message);
        return sendResponse(res, 500, err.message, "حدث خطأ في خادم السيرفر");
    }
}

// Export chancesGet
module.exports = chancesGet;