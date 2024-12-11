// Enable JS Strict Mode: Helps catch common coding mistakes.
"use strict";

// Import the sendResponse utility for sending responses.
const sendResponse = require('../utils/sendResponse');

// Validate Fullname: Checks if the fullname is provided and meets length requirements.
const validateFullname = (fullname) => {
    if (!fullname) {
        return { isValid: false, message: 'حقل الاسم إجباري' };
    }

    if (fullname.trim().length < 6) {
        return { isValid: false, message: 'يجب أن يتكون الاسم من 6 أحرف على الأقل' };
    }

    return { isValid: true, message: 'الاسم صالح' };
}

// Validate Email: Checks if the email is provided, correctly formatted, and in lowercase.
const validateEmail = (email) => {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (!email) {
        return { isValid: false, message: 'حقل البريد الإلكتروني إجباري' };
    }

    if (!emailRegex.test(email.trim().toLowerCase())) {
        return { isValid: false, message: 'من فضلك أدخل بريد إلكتروني صالح' };
    }

    return { isValid: true, message: 'البريد الإلكتروني صالح' };
}

// Validate Phone: Ensures the phone number is provided, matches the pattern, and falls within length limits.
const validatePhone = (phone) => {
    const phoneRegex = /^(\+?\d{1,4}[-.\s]?)?(\(?\d{1,4}\)?[-.\s]?)?[\d-.\s]{5,15}$/;
    const numericPhone = phone.replace(/\D/g, '');

    if (!phone) {
        return { isValid: false, message: 'حقل رقم الهاتف إجباري' };
    }

    if (!phoneRegex.test(phone)) {
        return { isValid: false, message: 'من فضلك أدخل رقم هاتف صحيح' };
    }

    if (numericPhone.length < 10) {
        return { isValid: false, message: 'يجب أن يتكون رقم الهاتف من 10 أرقام على الأقل' };
    }

    if (numericPhone.length > 15) {
        return { isValid: false, message: 'رقم الهاتف لا يمكن أن يتجاوز 15 رقما' };
    }

    return { isValid: true, message: 'رقم الهاتف صالح' };
}

// Validate Message: Checks if the message is provided and falls within the length requirements.
const validateMessage = (message) => {
    if (!message) {
        return { isValid: false, message: 'حقل الرسالة إجباري' };
    }

    if (message.length < 100) {
        return { isValid: false, message: 'يجب أن تكون الرسالة 100 حرف على الأقل' };
    }

    if (message.length > 500) {
        return { isValid: false, message: 'لا يمكن أن تتجاوز الرسالة 500 حرف' };
    }

    return { isValid: true, message: 'الرسالة صالحة' };
}

// Middleware for validating request body before proceeding.
module.exports = async (req, res, next) => {
    try {
        // Extract data from the request body.
        const { fullname, email, phone, message } = req.body;

        // Validate each field using respective functions.
        const fullnameValidate = validateFullname(fullname);
        const emailValidate = validateEmail(email);
        const phoneValidate = validatePhone(phone);
        const messageValidate = validateMessage(message);

        // If any validation fails, return the respective error message.
        if (!fullnameValidate.isValid) {
            return sendResponse(res, 400, fullnameValidate.message);
        }
        if (!emailValidate.isValid) {
            return sendResponse(res, 400, emailValidate.message);
        }
        if (!phoneValidate.isValid) {
            return sendResponse(res, 400, phoneValidate.message);
        }
        if (!messageValidate.isValid) {
            return sendResponse(res, 400, messageValidate.message);
        }

        // If all validations pass, proceed to the next middleware or function.
        next();
    } catch (err) {
        // Handle any server-side errors during the validation process.
        return sendResponse(res, 500, err.message);
    }
}
