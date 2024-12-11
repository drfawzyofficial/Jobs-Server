
// Packages
const express = require("express");
const router = express.Router();

// Controllers
const {
    adminSignup,
    adminLogin,
    getProfileData,
    getStatistics,
    getStudents,
    studentRemove,
    studentMessage,
    chanceCreate,
    chancesSearch,
    chanceUpdate,
    chanceRemove,
    adminChancesGet,
    adminChanceReviewAccept,
    adminChanceReviewDelete,
    adminChanceReviewsGet,
    getAdmins,
    adminRemove
} = require("../controllers/index");

// Middlewares
const { checkAdmin, chanceValidation, chanceAnotherVal, chanceFilterVal } = require("../middlewares/index");

// Routes
router.post("/signup", adminSignup);
router.post("/login", adminLogin);
router.get("/getprofile", checkAdmin, getProfileData);
router.get("/getadmins", checkAdmin, getAdmins);
router.delete("/admin/remove", checkAdmin, adminRemove);
router.get("/statistics/get", getStatistics);
router.get("/getstudents", checkAdmin, getStudents);
router.post("/chance/reviews/get", checkAdmin, adminChanceReviewsGet);
router.post("/chance/review/accept", checkAdmin, adminChanceReviewAccept);
router.delete("/chance/review/delete", checkAdmin, adminChanceReviewDelete);
router.get("/chances/get", checkAdmin, adminChancesGet);
router.delete("/student/remove", checkAdmin, studentRemove);
router.post("/student/message", checkAdmin, studentMessage);
router.post("/chance/create", checkAdmin, chanceValidation, chanceAnotherVal, chanceCreate);
router.put("/chance/update", checkAdmin, chanceValidation, chanceAnotherVal, chanceUpdate);
router.delete("/chance/remove", checkAdmin, chanceRemove);
router.post("/chance/searchchances", checkAdmin, chanceFilterVal, chancesSearch);

// Export Router
module.exports = router;    
