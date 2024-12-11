// JS Strict Mode
"use strict";

// Import Packages
const jwt = require('jsonwebtoken');

// Import Models
const Admin = require('../../models/Admin');

// Import Utils 
const sendResponse = require('../../utils/sendResponse');

// Admin Login Controller
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await Admin.findOne({ email: email });
        if (!admin) {
            return sendResponse(res, 401, "البريد الإلكتروني غير موجود");
        }
        let isMatch = await admin.validatePassword(password);

        if (!isMatch) return sendResponse(res, 401, "كلمة السر غير صحيحة");

        const token = jwt.sign({ _id: admin._id }, process.env.JWT_KEY);
        const result = { token: token };
        return sendResponse(res, 200, "تم تسجيل الدخول بنجاح", result);
    } catch (err) {
        return sendResponse(res, 500, err.message, "حدث خطأ في خادم السيرفر");
    }
}


// Export adminLogin
module.exports = adminLogin;