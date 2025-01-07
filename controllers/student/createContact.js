// Import Models
const Contact = require('../../models/Contact');
const Student = require('../../models/Student');

// Import Utilities
const sendResponse = require('../../utils/sendResponse');

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


// Route handler for creating a new contact entry.
const createContact = async (req, res, next) => {
    try {
        const student = await Student.findById(req.user._id);
        const { first_name, last_name, email, phone } = student;
        const message = req.body.message;
        const messageValidate = validateMessage(message);
        if (!messageValidate.isValid) {
            return sendResponse(res, 400, messageValidate.message);
        }
        // Check if a contact with the same email already exists in the database.
        const existingContact = await Contact.findOne({ email });

        // If a contact with the same email exists, return an error response.
        if (existingContact) {
            return sendResponse(
                res,
                400,
                "لقد تم إرسال نموذج اتصال من هذا الحساب من ذي قبل. انتظر حتى يتم مراجعته"
            );
        }

        // Create a new contact with the provided data and save it to the database.
        const contact = await new Contact({ first_name, last_name, email, phone, message }).save();

        // Send a success response indicating the contact has been created.
        return sendResponse(
            res,
            200,
            'تم إرسال مشكلتك بنجاح إلى المسئول. شكرًا لتواصلك معنا',
            contact
        );
    } catch (err) {
        // If an error occurs, send a server error response with the error message.
        return sendResponse(res, 500, err.message);
    }
}

// Export the createContact function for use in routes.
module.exports = createContact;
