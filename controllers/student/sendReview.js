// Import Models
const Chance = require('../../models/Chance');
const Review = require('../../models/Review');
// Import Utilities
const sendResponse = require('../../utils/sendResponse');

// Route handler for creating a new review entry.
const sendReview = async (req, res, next) => {
    try {
        // Extract the comment and stars from the request body.
        const { comment, stars } = req.body;


        const chance = await Chance.findById({ _id: req.body._chanceID });

        if(!chance)  return sendResponse(
            res,
            404,
            "الفرصة غير موجودة"
        );

        if (typeof(comment) !== "string" || comment.trim().length < 100 || comment.trim().length > 300)
            return sendResponse(
                res,
                400,
                "حقل التعليق يجب أن يتراوح بين 100 و500 حرف"
            );


        if (typeof(stars) !== "number" || stars < 0 || stars > 5)
            return sendResponse(
                res,
                400,
                "حقل نجوم التقييم يجب أن يكون صحيحًا"
            );

        // Check if a review exists in the database.
        const existingReview = await Review.findOne({ _studentID: req.user._id, _chanceID: req.body._chanceID });

        // If a review with the same email exists, return an error response.
        if (existingReview && existingReview.accepted === false) {
            return sendResponse(
                res,
                400,
                "لقد قمت بإضافة تعليق سابقًا ومازال تحت قيد المراجعة"
            );
        } else if (existingReview && existingReview.accepted === true) {
            return sendResponse(
                res,
                400,
                "لقد قمت بإضافة تعليق سابقًا وتم قبوله من طرف المسئول"
            );
        }



        // Create a new review with the provided data and save it to the database.
        const review = await new Review({ _studentID: req.user._id, _chanceID: req.body._chanceID, comment: comment, stars: stars }).save();

        // Send a success response indicating the review has been created.
        return sendResponse(
            res,
            200,
            'تم إرسال تعليقك إلى المسؤول  وهو بإنتظار الموافقة',
            review
        );
    } catch (err) {
        // If an error occurs, send a server error response with the error message.
        return sendResponse(res, 500, err.message);
    }
}

// Export the createContact function for use in routes.
module.exports = sendReview;
