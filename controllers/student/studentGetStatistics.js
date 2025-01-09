// JS Strict Mode
"use strict";

// Import Packages

// Import Models
const Chance = require('../../models/Chance');
const Student = require('../../models/Student');

// Import Utils 
const sendResponse = require('../../utils/sendResponse');

// getStatistics method for getting statistics data
const getStatistics = async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const user = await Student.findById({ _id: req.user._id });
        // General Statistics
        const totalChances = await Chance.find({}).count();
        const locatedChances = await Chance.find({ programStatus: "حضوري" }).count();
        const remoteChances = await Chance.find({ programStatus: "عن بعد" }).count();
        const specialConditionsChances = await Chance.find({ specialConditions: true }).count();

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

        // Special Analysis
        const studentsByGender = await Student.find({
            applicantGender: user.applicantGender, _id: { $ne: user._id }
        }).count();
        const studentsByEducationLevel = await Student.find({
            applicantEdu: user.applicantEdu, _id: { $ne: user._id }
        }).count();
        const studentsByAccommodation = await Student.find({
            saudiCity: user.saudiCity, _id: { $ne: user._id }
        }).count();

      


        // Compile statistics into a single object
        const statistics = {
            general: {
                totalChances,
                locatedChances,
                remoteChances,
                specialConditionsChances
            },
            dateBased: {
                openChances,
                closedChances, 
                notStartedChances
            },
            special: {
                studentsByGender, 
                studentsByEducationLevel, 
                studentsByAccommodation
            },
        };

        // Send response
        return sendResponse(res, 200, "Statistics Data", statistics);
    } catch (err) {
        return sendResponse(res, 500, err.message, "حدث خطأ في خادم السيرفر");
    }
};

// Export getStatistics
module.exports = getStatistics;
