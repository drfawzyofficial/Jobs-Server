// JS Strict Mode
"use strict";

// Import Models
const Student = require('../../models/Student');
const Code = require('../../models/Code');

// Import Utilities
const sendResponse = require('../../utils/sendResponse');

/**
 * Function to validate a password.
 * Ensures that the password meets the required conditions.
 * @param {string} password - The password to validate.
 * @returns {object} - Returns an object with 'isValid' and 'message'.
 */
const validatePassword = (password, password_confirmation) => {
    // Check if password is provided
    if (!password || password.trim().length === 0) {
        return {
            isValid: false,
            message: "حقل كلمة السر إجباري"
        };
    }

    // Check if password meets the minimum length requirement
    if (password.trim().length < 6) {
        return {
            isValid: false,
            message: "يجب أن تكون كلمة السر على الأقل 6 أحرف"
        };
    }

    if(password !== password_confirmation)   {
        return {
            isValid: false,
            message: "كلمتا المرور غير متطابقتين"
        };
    }

    // If all conditions are met, return a valid response
    return {
        isValid: true,
        message: "كلمتا السر متطابقتين"
    };
};

/**
 * Method for resetting a student's password using a code.
 * Validates the provided code and updates the student's password.
 */
const resetPasswordChange = async (req, res) => {
    try {
        // Extract data from the request body
        const { identifier, code, password, password_confirmation } = req.body;

        // Find the student by email or phone
        const student = await Student.findOne({
            $or: [{ email: identifier }, { phone: identifier }]
        });
        if (!student) {
            return sendResponse(res, 401, "البريد الإلكتروني أو رقم الهاتف خطأ");
        }

        // Validate the provided code
        if (!code || code.trim().length === 0) {
            return sendResponse(res, 400, "حقل الرمز المرسل مطلوب");
        }

        // Check if the passwords match
        if (password !== password_confirmation) {
            return sendResponse(res, 400, "كلمتا المرور غير متطابقتين");
        }

        let passwordValidation = validatePassword(password, password_confirmation);
        if(!passwordValidation.isValid) return sendResponse(res, 400, passwordValidation.message);

        // Find the code associated with the student
        const sent_code = await Code.findOne({ _studentID: student._id, for: "ResetPassword" });
        if (!sent_code) {
            return sendResponse(res, 401, "تم انتهاء صلاحية الرمز");
        }

        // Verify if the provided code matches the stored code
        const isMatch = await sent_code.checkCode(code);
        if (!isMatch) {
            return sendResponse(res, 400, "الرمز غير متطابق");
        }

        // Hash the new password
        const new_password = await student.cryptPassword(password);

        // Update the student's password
        await Student.findByIdAndUpdate(student._id, { password: new_password });

        // Send success response
        return sendResponse(res, 200, "تم استعادة كلمة السر بنجاح");
    } catch (err) {
        // Log the error and send error response
        console.error("Error in resetPasswordChange:", err.message);
        return sendResponse(res, 500, err.message, "حدث خطأ في خادم السيرفر");
    }
};

// Export the resetPasswordChange function
module.exports = resetPasswordChange;
