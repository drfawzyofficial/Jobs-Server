
// Packages
const express = require("express");
const router = express.Router();

// Controllers
const {
    helperGet,
    helperPost,
    deleteChanceCategory,
    deleteChanceSubcategory,
    deleteApplicantEdu,
    helperStatistics
} = require("../controllers/index");

// Middlewares
const { checkAdmin } = require("../middlewares/index");

// Routes
router.post("/post", checkAdmin, helperPost);
router.delete("/deletechanceCategory", checkAdmin, deleteChanceCategory);
router.delete("/deletechancesubcategory", checkAdmin, deleteChanceSubcategory);
router.delete("/deleteApplicantEdu", checkAdmin, deleteApplicantEdu);
router.get("/get", helperGet);
router.get("/statistics/get", helperStatistics);

// Export Router
module.exports = router;
