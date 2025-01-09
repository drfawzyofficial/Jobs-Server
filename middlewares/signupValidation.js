// JS Strict Mode
"use strict";

// Packages and Utilities
const validator = require('../utils/validator');
const sendResponse = require('../utils/sendResponse');
const { ar } = require("../lang/lang");

/**
 * Middleware for validating signup requests.
 * Validates fullname, email, and password using custom rules.
 * 
 */

const signupValidation = async (req, res, next) => {
    try {
        // Define validation rules
        const validationRule = {
            "first_name": "required|string|min:3",
            "last_name": "required|string|min:3",
            "email": "required|string|email|exist:Student,email",
            "phone": "required|string|min:10|max:15|exist:Student,phone",
            "password": "required|string|min:6|strict|confirmed",
            "applicantGender": "required|string|in:ذكر,أنثى",
            "DOB": "required|date", 
            "applicantEdu": "required|string",
            "saudinationality": "required|boolean",
            "tookEnglishTest": "required|boolean",
            "tookBrainTest": "required|boolean",
            "interests": "required|array|min:3",
            "Subinterests": "required|array|min:3"
        };

        // Perform validation
        await validator(req.body, validationRule, ar, (err, status) => {
            if (!status) {
                // If validation fails, send an error response
                return sendResponse(res, 400, "فشل في التحقق من المدخلات", err);
            }
            // Proceed to the next middleware if validation is successful
            next();
        });
    } catch (err) {
        // Log the error message for debugging
        console.error('Validation error:', err.message);
        // Optionally, send a response for the internal server error (if needed)
        return sendResponse(res, 500, "حدث خطأ داخلي في الخادم");
    }
};

// Export the signupValidation middleware
module.exports = signupValidation;
