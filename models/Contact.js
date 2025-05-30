// Import Mongoose
const mongoose = require('mongoose');

// Define Contact Schema
let contactSchema = new mongoose.Schema({
    _studentID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Student", // Reference to the Student model
    },
    subject: {
        type: String,
        required: [true, 'الموضوع مطلوب'], // Required field with custom error message
        minlength: [3, 'يجب أن يكون الموضوع 3 أحرف على الأقل'], // Minimum length of 15 characters
        maxlength: [50, 'لا يمكن أن يتجاوز الموضوع 50 حرف'] // Maximum length of 50 characters
    },
    message: {
        type: String,
        required: [true, 'الرسالة مطلوبة'], // Required field with custom error message
        minlength: [15, 'يجب أن تكون الرسالة 15 حرف على الأقل'], // Minimum length of 15 characters
        maxlength: [2000, 'لا يمكن أن تتجاوز الرسالة 2000 حرف'] // Maximum length of 500 characters
    }
});

// Create the Contact Model
let Contact = mongoose.model('Contact', contactSchema);

// Export the Contact Model
module.exports = Contact;
