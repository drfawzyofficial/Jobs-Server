// Import Models
const Contact = require('../../models/Contact');

// Import Utilities
const sendResponse = require('../../utils/sendResponse');

// Route handler for creating a new contact entry.
const createContact = async (req, res, next) => {
    try {
        // Extract the email from the request body.
        const { email } = req.body;
        
        // Check if a contact with the same email already exists in the database.
        const existingContact = await Contact.findOne({ email });

        // If a contact with the same email exists, return an error response.
        if (existingContact) {
            return sendResponse(
                res, 
                400, 
                "لقد تم استخدام هذا البريد الإلكتروني بالفعل لإرسال نموذج الاتصال. انتظر حتى يتم مراجعته"
            );
        }

        // Create a new contact with the provided data and save it to the database.
        const contact = await new Contact(req.body).save();

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
