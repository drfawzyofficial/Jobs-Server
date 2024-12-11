// Import Models
const Review = require('../../models/Review');

// Import Utilities
const sendResponse = require('../../utils/sendResponse');

// Route handler for creating a new review entry.
const sendReview = async (req, res, next) => {
    try {
        // Extract the email from the request body.
        const comment = req.body.comment;

        if(comment.trim().length === 0)
            return sendResponse(
                res, 
                400, 
                "حقل التعليق يجب الأ يكون فارغًا"
            );
        
        // Check if a review with the same email already exists in the database.
        const existingReview = await Review.findOne({ _studentID: req.user._id, _chanceID: req.body.id });

        // If a review with the same email exists, return an error response.
        if (existingReview && existingReview.accepted === false) {
            return sendResponse(
                res, 
                400, 
                "لقد قمت بإضافة تعليق سابقًا ومازال تحت قيد المراجعة"
            );
        } else if(existingReview && existingReview.accepted === true) {
            return sendResponse(
                res, 
                400, 
                "لقد قمت بإضافة تعليق سابقًا وتم قبوله من طرف المسئول"
            );
        }



        // Create a new review with the provided data and save it to the database.
        const review = await new Review({ _studentID: req.user._id, _chanceID: req.body.id, comment: comment}).save();

        // Send a success response indicating the review has been created.
        return sendResponse(
            res, 
            200, 
            'تم إرسال تعليقك إلى المسئول وهو بإنتظار الموافقة', 
            review
        );
    } catch (err) {
        // If an error occurs, send a server error response with the error message.
        return sendResponse(res, 500, err.message);
    }
}

// Export the createContact function for use in routes.
module.exports = sendReview;
