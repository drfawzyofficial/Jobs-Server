// JS Strict Mode
"use strict";

// Import Packages
const moment = require("moment");

// Import Models
const Helper = require("../models/Helper");

// Import Utilities
const sendResponse = require("../utils/sendResponse");

// Export chanceFilterVal Middleware
module.exports = async (req, res, next) => {
    try {
        // Extract request data
        const data = req.body;
        const errors = {};

        // Retrieve helper data
        const helper = await Helper.findById(process.env.HELPER_ID);
        const { chanceCategories, chanceSubcategories, applicantNats, IELTSDegress, CEFRDegrees, applicantEdus, applicantAges } = helper;
        const programStatusArr = ["حضوري", "عن بُعد", "حالة البرنامج"];

        // Validate chance name
        if (typeof data.chanceName === 'string') {
            if (data.chanceName.trim().length < 6) {
                errors["chanceName"] = ['اسم الفرصة لا يجب أن يقل عن 6 أحرف'];
            }
        } else {
            errors["chanceName"] = ['حقل اسم الوظيفة يجب أن يكون اسمًا'];
        }

        // Validate chance price
        // if (typeof data.chancePrice === 'string') {
        //     if (isNaN(data.chancePrice)) {
        //         errors["chancePrice"] = ['يجب أن يكون السعر رقمًا'];
        //     }
        //     if (data.chancePrice < 0) {
        //         errors["chancePrice"] = ['لا يمكن أن يكون السعر أقل من الصفر'];
        //     }
        // } else {
        //     errors["chancePrice"] = ['حقل سعر الوظيفة يجب أن يكون اسمًا'];
        // }

        // Validate chance start and end dates
        // if (data.chanceStartDate && !(new Date(data.chanceStartDate) instanceof Date)) {
        //     errors["chanceStartDate"] = ['تاريخ بداية الفرصة يجب أن يكون من النوع تاريخ'];
        // }
        // if (data.chanceEndDate && !(new Date(data.chanceEndDate) instanceof Date)) {
        //     errors["chanceEndDate"] = ['تاريخ نهاية الفرصة يجب أن يكون من النوع تاريخ'];
        // }
        // if (data.chanceStartDate && data.chanceEndDate && new Date(data.chanceEndDate) < new Date(data.chanceStartDate)) {
        //     errors["chanceEndDate"] = ['لا يمكن أن يكون ميعاد نهاية الفرصة أقل من تاريخ ميعاد بداية الفرصة'];
        // }

        // Validate program status
        if (!programStatusArr.includes(data.programStatus)) {
            errors["programStatus"] = ['يجب أن تكون حالة البرنامج حضوري أو عن بُعد'];
        }

        // Validate chanceCategory
        if (!chanceCategories.includes(data.chanceCategory)) {
            errors["chanceCategory"] = ['يجب أن يكون التصنيف صحيحًا'];
        }
        
        // Validate chanceSubcategory
        if (!chanceSubcategories.includes(data.chanceSubcategory)) {
            errors["chanceSubcategory"] = ['يجب أن يكون التصنيف الفرعي صحيحًا'];
        }

        // Validate applicant nationality
        // if (!applicantNats.includes(data.applicantNat)) {
        //     errors["applicantNat"] = ['يجب أن تكون الجنسية صحيحة'];
        // }

        // Validate applicant age
        // if (!applicantAges.includes(data.applicantAge)) {
        //     errors["applicantAge"] = ['يجب أن يكون العمر صحيحًا'];
        // }

        // Validate applicant education
        // if (!applicantEdus.includes(data.applicantEdu)) {
        //     errors["applicantEdu"] = ['يجب أن تكون المرحلة التعليمية صحيحة'];
        // }

        // If there are validation errors, return them in the response
        if (Object.keys(errors).length > 0) {
            return sendResponse(res, 400, "Validation failed", { errors });
        }

        // Proceed to the next middleware if validation passes
        next();
    } catch (err) {
        // Log the error for debugging
        console.error('chance filter validation error:', err.message);
        // Send a server error response
        return sendResponse(res, 500, "Internal Server Error");
    }
};
