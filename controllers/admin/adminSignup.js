// JS Strict Mode
"use strict";

// Import Packages
const bcrypt = require("bcryptjs");

// Import Models
const Admin = require('../../models/Admin');

// Import Utils 
const sendResponse = require('../../utils/sendResponse');

// Signup method for creating a student
const adminSignup = async (req, res) => {
    try {

        const { fullname, email, password } = req.body;
        const admin = await new Admin({ fullname, email, password }).save();
        return sendResponse(res, 201, "تم إنشاء حساب الأدمن بنجاح", admin);
    } catch (err) {
        return sendResponse(res, 400, err.message, "حدث خطأ في خادم السيرفر");
    }
}

// Export studentSignup
module.exports = adminSignup;