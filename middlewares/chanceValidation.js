// JS Strict Mode
"use strict";

// Packages and Utilities
const validator = require('../utils/validator');
const sendResponse = require('../utils/sendResponse');
const { ar } = require("../lang/lang");

/**
 * Middleware for validating chance creation and update requests.
 * Validates fields like chanceName, chanceCategory, chanceStartDate, chanceEndDate, and various standards.
 */
const chanceValidation = async (req, res, next) => {
    try {
        // Define validation rules for chance fields
        const validationRule = {
            "chanceName": "required|string|min:4",
            "chanceLink": "url",
            "chancePrice": "string",
            "chanceImage": "string",
            "provider": "required|string|min:2",
            "specialConditions": "required",
            "chanceCategory": "required|string",
            "chanceSubcategory": "required|string",
            "marketingDesc": "required|string",
            "chanceDesc": "required|string|min:15|max:2000",
            "chanceRegStartDate": "required|string",
            "chanceRegEndDate": "required|string",
            "chanceStartDate": "required|string",
            "chanceEndDate": "required|string",
            "applicantAge": "required|string",
            "applicantEdus": "required|array|min:1",
            "cities": "array",
            "applicantGender": "required|string",
            "documentsContent": "string",
            "notesContent": "required|string|min:15|max:2000",
        };

        // Perform validation using the provided rules
        await validator(req.body, validationRule, ar, (err, status) => {
            if (!status) {
                // If validation fails, send an error response
                return sendResponse(res, 400, "Validation failed", err);
            }
            // Proceed to the next middleware if validation is successful
            next();
        });
    } catch (err) {
        // Log the error message for debugging
        console.error('chance validation error:', err.message);
        // Send a response for internal server error
        return sendResponse(res, 500, "Internal Server Error");
    }
};

// Export the chanceValidation middleware
module.exports = chanceValidation;
