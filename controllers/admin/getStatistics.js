// JS Strict Mode
"use strict";

// Import Packages

// Import Models
const Student = require('../../models/Student');
const Admin = require('../../models/Admin');
const Chance = require('../../models/Chance');
const Contact = require('../../models/Contact');

// Import Utils 
const sendResponse = require('../../utils/sendResponse');

// getStatistics method for getting statistics data
const getStatistics = async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const user = await Student.findById({ _id: req.user._id });

        // General Statistics
        const admins_count = await Admin.find({}).count();
        const students_count = await Student.find({}).count();
        const chances_count = await Chance.find({}).count();
        const contacts_count = await Contact.find({}).count();

        // Date-based Insights
        const openChances = await Chance.find({
            chanceRegStartDate: { $lte: today },
            chanceRegEndDate: { $gte: today },
        }).count();
        const closedChances = await Chance.find({
            chanceRegEndDate: { $lt: today }
        }).count();
        const notStartedChances = await Chance.find({
            chanceRegStartDate: { $gt: today }
        }).count();
        const specialConditionsChances = await Chance.find({ specialConditions: true }).count();

        // Student-Specific Statistics
        const students = await Student.find({});
        
        // Gender Distribution
        const genderDistribution = {
            male: students.filter(student => student.applicantGender === 'ذكر').length,
            female: students.filter(student => student.applicantGender === 'أنثى').length
        };

        // Online Status Distribution
        const onlineStatus = {
            online: students.filter(student => student.online).length,
            offline: students.filter(student => !student.online).length
        };
      
        // Compile statistics into a single object
        const statistics = {
            general: {
                admins_count,
                students_count,
                chances_count,
                contacts_count
            },
            chance: {
                openChances,
                closedChances,
                notStartedChances,
                specialConditionsChances
            },
            student: {
                genderDistribution,
                onlineStatus,
            }
        };
        console.log(statistics);
        return sendResponse(res, 200, "Statistics Data", statistics);
    } catch (err) {
        return sendResponse(res, 500, err.message, "حدث خطأ في خادم السيرفر");
    }
}

// Export getStatistics
module.exports = getStatistics;
