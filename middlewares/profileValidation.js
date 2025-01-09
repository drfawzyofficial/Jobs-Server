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
            "first_name": "required|string|min:3",
            "last_name": "required|string|min:3",
            "email": "required|string|email",
            "phone": "required|string|min:10|max:15",
            "applicantGender": "required|string|in:ذكر,أنثى",
            "applicantEdu": "required|string",
            "DOB": "required|date", 
            "applicantEdu": "required|string",
            "saudinationality": "required|boolean",
            "tookEnglishTest": "required|boolean",
            "tookBrainTest": "required|boolean",
            "interests": "required|array|min:3",
            "Subinterests": "required|array|min:3"
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
