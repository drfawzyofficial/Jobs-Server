
// Packages
const express = require("express");
const router = express.Router();

// Controllers
const {
    helperGet,
    helperPost,
    deleteChanceCategory,
    deletechanceSubcategory,
    deleteApplicantEdu,
} = require("../controllers/index");

// Middlewares
const { checkAdmin } = require("../middlewares/index");

// Routes
router.post("/post", checkAdmin, helperPost);
router.delete("/deletechanceCategory", checkAdmin, deleteChanceCategory);
router.delete("/deletechanceSubcategory", checkAdmin, deletechanceSubcategory);
router.delete("/deleteApplicantEdu", checkAdmin, deleteApplicantEdu);
router.get("/get", helperGet);

// Export Router
module.exports = router;
