// Import Models
const Contact = require('../../models/Contact');

// Import Utilities
const sendResponse = require('../../utils/sendResponse');
const { isRequired, isString, isMinLength, isMaxLength } = require("../../utils/funcs");


// Route handler for creating a new contact entry.
const createContact = async (req, res, next) => {
    try {
        const { subject, message } = req.body;
        const errors = {};
        
        if (!isRequired(subject) || !isString(subject) || !isMinLength(subject, 3) || !isMaxLength(subject, 50)) {
            errors["subject"] = ["حقل الموضوع مطلوب ويجب أن يكون نصًا بطول 3 أحرف على الأقل و50 حرف كحد أقصى"];
        }

        if (!isRequired(message) || !isString(message) || !isMinLength(message, 15) || !isMaxLength(message, 2000)) {
            errors["message"] = ["حقل الرسالة مطلوب ويجب أن يكون نصًا بطول 15 حرفًا على الأقل و2000 حرف كحد أقصى"];
        }

        // Check for validation errors
        if (Object.keys(errors).length) {
            return sendResponse(res, 400, "فشل في عملية تحقق المدخلات", { errors });
        }

        // Check if a contact with the same email already exists in the database.
        const existingContact = await Contact.findOne({ _studentID: req.user._id });

        // If a contact with the same email exists, return an error response.
        if (existingContact) {
            return sendResponse(
                res,
                403,
                "لقد تم إرسال نموذج اتصال من هذا الحساب من ذي قبل. انتظر حتى يتم مراجعته"
            );
        }

        // Create a new contact with the provided data and save it to the database.
        const contact = await new Contact({ _studentID: req.user._id, subject: subject, message: message }).save();

        // Send a success response indicating the contact has been created.
        return sendResponse(
            res,
            200,
            'تم إرسال مشكلتك بنجاح إلى المسؤول. شكرًا لتواصلك معنا.',
            contact
        );
    } catch (err) {
        console.log(err.message);
        // If an error occurs, send a server error response with the error message.
        return sendResponse(res, 500, err.message);
    }
}

// Export the createContact function for use in routes.
module.exports = createContact;
