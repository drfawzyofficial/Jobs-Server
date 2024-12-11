// Import Mongoose
const mongoose = require('mongoose');

// Define Contact Schema
let contactSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: [true, "حقل الاسم إجباري"], // Required field with custom error message
        minlength: [6, 'يجب أن يتكون الاسم من 6 أحرف على الأقل'], // Minimum length of 6 characters
        trim: true, // Remove leading and trailing spaces
    },
    email: {
        type: String,
        trim: true, // Remove leading and trailing spaces
        lowercase: true, // Store email in lowercase for consistency
        required: [true, "حقل البريد الإلكتروني إجباري"], // Required field with custom error message
        unique: true, // Ensure the email is unique in the collection
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 
            'من فضلك أدخل بريد إلكتروني صالح' // Validate email format with a regex pattern
        ],
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'], // Required field with custom error message
        match: [
            /^(\+?\d{1,4}[-.\s]?)?(\(?\d{1,4}\)?[-.\s]?)?[\d-.\s]{5,15}$/,
            'من فضلك أدخل رقم هاتف صحيح' // Validate phone number format with a regex pattern
        ],
        minlength: [10, 'يجب أن يتكون رقم الهاتف من 10 أرقام على الأقل'], // Minimum length of 10 digits
        maxlength: [15, 'رقم الهاتف لا يمكن أن يتجاوز 15 رقما'], // Maximum length of 15 digits
    },
    message: {
        type: String,
        required: [true, 'الرسالة مطلوبة'], // Required field with custom error message
        minlength: [100, 'يجب أن تكون الرسالة 100 حرف على الأقل'], // Minimum length of 100 characters
        maxlength: [500, 'لا يمكن أن تتجاوز الرسالة 500 حرف'] // Maximum length of 500 characters
    }
});

// Create the Contact Model
let Contact = mongoose.model('Contact', contactSchema);

// Export the Contact Model
module.exports = Contact;
