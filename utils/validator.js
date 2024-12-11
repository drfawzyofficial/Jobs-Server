
// JS Strict Mode
"use strict";

const Validator = require('validatorjs');

// Regular expression for strong password validation.
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]/;

// Custom password validation rule.
Validator.register('strict', value => passwordRegex.test(value),
    'Password must contain at least one uppercase letter, one lowercase letter, and one number.');

/**
 * Custom rule for checking the existence of a value in the database.
 * @param {string} value - The value to check.
 * @param {string} attribute - The database attribute to validate against.
 * @param {Object} req - The request object.
 * @param {Function} passes - Callback function for validation result.
 */
Validator.registerAsync('exist', async (value, attribute, req, passes) => {
    if (!attribute) throw new Error('Specify Requirements i.e fieldName: exist:table,column');

    const [table, column] = attribute.split(",");
    if (!table || !column) throw new Error(`Invalid format for validation rule on ${attribute}`);

    const Model = require(`../models/${table}`);
    const found = await Model.findOne({ [column]: value });
    found ? passes(false, `The ${column} is already found.`) : passes();
});

/**
 * Validates input data against defined rules using Validator.js.
 * @param {Object} body - The data to validate.
 * @param {Object} rules - The validation rules.
 * @param {Object} customMessages - Custom error messages.
 * @param {Function} callback - Callback function for the validation result.
 */
const validator = async (body, rules, customMessages, callback) => {
    const validation = new Validator(body, rules, customMessages);
    validation.passes(() => callback(null, true));
    validation.fails(() => callback(validation.errors, false));
};

module.exports = validator;
