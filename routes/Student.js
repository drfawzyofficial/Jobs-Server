// Packages
const express = require("express");
const router = express.Router();

// Controllers
const {
    studentSignup,
    studentLogin,
    createContact,
    forgotPassword,
    resetPassword,
    resetPasswordChange,
    getStudentData,
    studentDelete,
    studentLogout,
    submitCode,
    enableNotifications,
    resendCode,
    changePassword,
    getWishlists,
    editProfile,
    sendReview,
    getReviews,
    chancesGet,
    EnglishChancesRelated,
    BrainChancesRelated,
    chanceGet,
    studentGetStatistics,
    IncrementChance
} = require("../controllers/index");

// Middlewares
const {
    checkStudent,
    signupValidation,
    changePassVal,
    updateAvatar,
    profileValidation
} = require("../middlewares/index");

// Routes
router.post("/signup", studentSignup);
router.post("/login", studentLogin);
router.post("/password/forgot", forgotPassword);
router.post("/password/reset", resetPassword);
router.post("/password/reset/change", resetPasswordChange);
router.post("/contact/create", checkStudent, createContact);
router.get("/logout", checkStudent, studentLogout);
router.get("/getprofile", checkStudent, getStudentData);
router.post("/editProfile", checkStudent, editProfile);
router.delete("/delete", checkStudent, studentDelete);
router.post("/enablenotifications", checkStudent, enableNotifications);
router.post("/code/submit", checkStudent, submitCode);
router.post("/code/resend", checkStudent, resendCode);
router.post("/password/change", checkStudent, changePassword);
router.post("/wishlists/get", checkStudent, getWishlists);
router.post("/review/send", checkStudent, sendReview);
router.post("/reviews/get", checkStudent, getReviews);
router.get("/chances/get", checkStudent, chancesGet);
router.post("/chances/english/related/get", checkStudent, EnglishChancesRelated);
router.post("/chances/brain/related/get", checkStudent, BrainChancesRelated);
router.get("/chance/get", checkStudent, chanceGet);
router.get("/statistics/get", checkStudent, studentGetStatistics);
router.post("/chance/increment", checkStudent, IncrementChance);
// router.post("/update-avatar", checkStudent, updateAvatar, uploadImage);

// Export Router
module.exports = router;
