// JS Strict Mode
"use strict";

// Import Packages

// Import Models
const Student = require('../../models/Student');
const Admin = require('../../models/Admin');
const Chance = require('../../models/Chance');

// Import Utils 
const sendResponse = require('../../utils/sendResponse');

// getStatistics method for getting statistics data
const getStatistics = async (req, res) => {
    try {
        const admins_count = await Admin.find({ }).count();
        const students_count = await Student.find({ }).count();
        const chances_count = await Chance.find({ }).count();
        return sendResponse(res, 200, "Statistics Data", { admins_count: admins_count, students_count: students_count, chances_count: chances_count});
    } catch (err) {
        return sendResponse(res, 500, err.message, "حدث خطأ في خادم السيرفر");
    }
}

// Export getStatistics
module.exports = getStatistics;