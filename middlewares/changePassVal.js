// JS Strict Mode
"use strict";

// Packages and Utilities
const validator = require('../utils/validator');
const sendResponse = require('../utils/sendResponse');
const { ar } = require("../lang/lang");

/**
 * Middleware for validating password change requests.
 * Validates the new password using custom rules.
 */
const changePassVal = async (req, res, next) => {
    try {
        // Define validation rules for the new password
        const validationRule = {
            "new_password": "required|string|min:6|strict|confirmed"
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
        console.error('Password validation error:', err.message);
        // Optionally, send a response for the internal server error (if needed)
        return sendResponse(res, 500, "Internal Server Error");
    }
};

// Export the changePassVal middleware
module.exports = changePassVal;
