// Import Mongoose
const mongoose = require('mongoose');

// Define Review Schema
let reviewSchema = new mongoose.Schema({
    _studentID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Student", // Reference to the Student model
      },
    _chanceID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Chance", // Reference to the chance model
    },
    comment: {
        type: String,
        required: [true, 'الرسالة مطلوبة'], // Required field with custom error message
        minlength: [15, 'يجب أن تكون الرسالة 15 حرف على الأقل'], // Minimum length of 100 characters
        maxlength: [2000, 'لا يمكن أن تتجاوز الرسالة 2000 حرف'] // Maximum length of 500 characters
    },
    stars: { type: Number, min: 0, max: 5 },
    accepted: {
        type: Boolean,
        required: true,
        default: false
    }
});

// Create the Review Model
let Reivew = mongoose.model('Review', reviewSchema);

// Export the Review Model
module.exports = Reivew;
