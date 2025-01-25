// JS Strict Mode
"use strict";

// Require all Controllers

/* For Student */
const studentSignup = require('./student/studentSignup');
const studentLogin = require('./student/studentLogin');
const createContact = require('./student/createContact');
const forgotPassword = require('./student/forgotPassword');
const resetPassword = require('./student/resetPassword');
const resetPasswordChange = require('./student/resetPasswordChange');
const studentLogout = require('./student/studentLogout');
const getStudentData = require('./student/getStudentData');
const studentDelete = require('./student/studentDelete');
const submitCode = require('./student/submitCode');
const resendCode = require('./student/resendCode');
const changePassword = require('./student/changePassword');
const uploadImage = require('./student/uploadImage');
const getWishlists = require('./student/getWishlists');
const editProfile = require('./student/editProfile');
const sendReview = require('./student/sendReview');
const getReviews = require('./student/getReviews');
const studentGetStatistics = require('./student/studentGetStatistics');
const IncrementChance = require("./student/IncrementChance");
/* for Student */

/* for Admin */
const adminSignup = require('./admin/adminSignup');
const adminLogin = require('./admin/adminLogin');
const getProfileData = require('./admin/getProfileData');
const getStatistics = require('./admin/getStatistics');
const getAdmins = require('./admin/getAdmins');
const adminRemove = require('./admin/adminRemove');
const getStudents = require('./admin/getStudents');
const getContacts = require('./admin/getContacts');
const adminChancesGet = require('./admin/adminChancesGet');
const adminChanceReviewsGet = require('./admin/adminChanceReviewsGet');
const adminChanceReviewAccept = require('./admin/adminChanceReviewAccept');
const adminChanceReviewDelete = require('./admin/adminChanceReviewDelete');
const studentRemove = require('./admin/studentRemove');
const studentContactRemove = require('./admin/studentContactRemove');
const studentMessage = require('./admin/studentMessage');
const studentContactMessage = require('./admin/studentContactMessage');
/* for Admin */

/* for Chance */
const chanceCreate = require('./chance/chanceCreate');
const chancesGet = require('./chance/chancesGet');
const EnglishChancesRelated = require('./chance/EnglishChancesRelated');
const BrainChancesRelated = require('./chance/BrainChancesRelated');
const chancesSearch = require('./chance/chancesSearch');
const chanceGet = require('./chance/chanceGet');
const chanceUpdate = require('./chance/chanceUpdate');
const chanceRemove = require('./chance/chanceRemove');
const helperGet = require('./helper/helperGet');
const helperPost = require('./helper/helperPost');
const deleteChanceCategory = require('./helper/deleteChanceCategory');
const deletechancesubcategory = require('./helper/deletechancesubcategory');
const deleteApplicantEdu = require('./helper/deleteApplicantEdu');
const helperStatistics = require('./helper/helperStatistics');
/* for chance */

// Export All Controllers
module.exports = {adminSignup, editProfile, uploadImage, getWishlists, sendReview, getReviews, studentSignup, createContact, studentLogin, forgotPassword, resetPassword, resetPasswordChange, studentLogout, studentDelete, getStudentData, submitCode, resendCode, changePassword, adminLogin, getProfileData, getStatistics, chanceCreate, chancesGet, EnglishChancesRelated, BrainChancesRelated, adminChancesGet, chancesSearch, chanceGet, chanceUpdate, chanceRemove, adminChanceReviewsGet, helperGet, helperPost, deleteChanceCategory, deleteApplicantEdu, helperStatistics,deletechancesubcategory, adminChanceReviewAccept, adminChanceReviewDelete, getStudents, getContacts, studentGetStatistics, IncrementChance, getAdmins, adminRemove, studentRemove, studentContactRemove, studentMessage, studentContactMessage}