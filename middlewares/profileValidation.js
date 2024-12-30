// JS Strict Mode
"use strict";

// Packages and Utilities
const validator = require('../utils/validator');
const sendResponse = require('../utils/sendResponse');
const { ar } = require("../lang/lang");

/**
 * Middleware for validating profile update requests.
 * Validates fields like fullname, email, gender, and various standards.
 */
const profileValidation = async (req, res, next) => {
    try {
        // Define validation rules for profile fields
        const validationRule = {
            "fullname": "required|string|min:6",
            "email": "required|string|email",
            "gender": "required|string|in:ذكر,أنثى",
            "applicantAge": "required|string",
            // "applicantNat": "required|string",
            "applicantEdu": "required|string",
            "dOB": "required|string",
            "bio": "string|min:50|max:150",
            "tags": "required|array",
            "EnglishStandard.IELTSDegree": "string",
            "EnglishStandard.TOFELDegree": "string",
            "EnglishStandard.TOEICDegree": "string",
            "EnglishStandard.DUOLINGODegree": "string",
            "EnglishStandard.stepDegree": "string",
            "EnglishStandard.CEFRDegree": "string",
            "BrainStandard.Sat": "string",
            "BrainStandard.Qudrat": "string",
            "BrainStandard.GAT": "string",
            "BrainStandard.act": "string",
            "BrainStandard.Talent": "string",
            "CurStandard.SaudiCur": "string",
            "CurStandard.BritishCur": "string",
        };

        // Perform validation using the provided rules
        await validator(req.body, validationRule, ar, (err, status) => {
            if (!status) {
                // If validation fails, send an error response
                return sendResponse(res, 400, "فشل في عملية تحقق المدخلات", err);
            }
            // Proceed to the next middleware if validation is successful
            next();
        });
    } catch (err) {
        // Log the error message for debugging
        console.error('Profile validation error:', err.message);
        // Optionally, send a response for the internal server error (if needed)
        return sendResponse(res, 500, "حدث خطأ داخلي في الخادم");
    }
};

// Export the profileValidation middleware
module.exports = profileValidation;
