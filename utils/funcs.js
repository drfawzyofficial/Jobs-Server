
// Utility functions for various validations

// Checks if a number is within a specified range.
const inRange = (x, min, max) => {
  return (x >= min && x <= max);
};

/**
* Validates if a given date string matches the 'YYYY-MM-DD' format.
* @param {string} dateString - The date string to validate.
* @returns {boolean} True if the date string is valid, false otherwise.
*/
function isValidDate(dateString) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  return regex.test(dateString);
}

module.exports = { inRange, isValidDate };
