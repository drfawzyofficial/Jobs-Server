
// Utility functions for various validations

// Checks if a number is within a specified range.
const inRange = (x, min, max) => (x >= min && x <= max);

const isRequired = (value) => value !== undefined && value !== null && value !== "";

const isString = (value) =>  typeof value === "string";

const isBoolean = (value) => typeof value === "boolean";

const isMinLength = (value, min) => value.trim().length >= min;

const isMaxLength = (value, max) => value.trim().length <= max;

const matchesRegex = (value, pattern) => pattern.test(value);

const isInList = (value, list) => list.includes(value);

const isArray = (value) => Array.isArray(value) && value.length > 0;

const isMinArrayLength = (value, min) => isArray(value) && value.length >= min;

const isConfirmed = (value, confirmValue) => value.trim() === confirmValue.trim();


module.exports = {isRequired, isString, isBoolean, isMinLength, isMaxLength, matchesRegex, isInList, isArray, isMinArrayLength, isConfirmed, inRange };
