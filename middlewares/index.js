// JS Strict Mode
"use strict";

// Require all Middlewares
const checkAdmin = require('./checkAdmin');
const checkStudent = require('./checkStudent');
const signupValidation = require('./signupValidation');
const contactVal = require('./contactVal');
const profileValidation = require('./profileValidation');
const changePassVal = require("./changePassVal")
const updateAvatar = require("./updateAvatar")
const chanceValidation = require('./chanceValidation');
const chanceAnotherVal = require('./chanceAnotherVal');
const chanceFilterVal = require('./chanceFilterVal');

// Export all Middlewares
module.exports = {profileValidation, changePassVal, updateAvatar, checkAdmin, checkStudent, signupValidation, contactVal, chanceValidation, chanceAnotherVal, chanceFilterVal}