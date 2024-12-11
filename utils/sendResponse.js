// Enable JS Strict Mode: Helps catch common coding mistakes.
"use strict";

/**
 * Utility function to send a standardized JSON response.
 * @param {Object} res - The Express response object.
 * @param {number} statusCode - The HTTP status code for the response.
 * @param {string} message - A message describing the outcome of the request.
 * @param {Object|null} [result=null] - Optional data to include in the response.
 * @returns {Object} The response object with status and JSON data.
 */
const sendResponse = (res, statusCode, message, result = null) => {
    return res.status(statusCode).json({
        statusCode: statusCode,
        message: message,
        result: result,
    });
};

// Export the sendResponse function for use in other parts of the application.
module.exports = sendResponse;
