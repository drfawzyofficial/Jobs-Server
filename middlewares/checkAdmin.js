// JS Strict Mode
"use strict";

// Packages and Models
const jwt = require("jsonwebtoken");
const sendResponse = require("../utils/sendResponse");
const Admin = require("../models/Admin");

// Environment Variables
const JWT_KEY = process.env.JWT_KEY;

/**
 * Middleware to authenticate and authorize admins using JWT.
 * Checks if the provided JWT token is valid and the associated admin exists.
 */
module.exports = async (req, res, next) => {
    try {
        // Extract the token from the Authorization header
        const token = req.headers.authorization.split(" ")[1];

        // Verify the token using the secret key
        const decoded = jwt.verify(token, JWT_KEY);

        // Find the admin by the ID from the decoded token
        const admin = await Admin.findById(decoded._id);
        if (!admin) {
            // If the admin does not exist, return an error response
            return sendResponse(res, 401, "هذا المسؤول  غير موجود في قاعدة البيانات");
        }

        // Attach the decoded user data to the request object
        req.user = decoded;

        // Proceed to the next middleware or route handler
        next();
    } catch (err) {
        // Log the error for debugging purposes
        console.error('Authentication error:', err.message);

        // If token verification fails or any other error occurs, return an error response
        return sendResponse(res, 401, "فشل في عملية التحقق");
    }
};
