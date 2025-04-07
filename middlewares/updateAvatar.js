// JS Strict Mode
"use strict";

// Packages
const multer = require("multer");
const sendResponse = require("../utils/sendResponse");

// Multer Storage Configuration for profile images
const profileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/avatars/');
  },
  filename: function (req, file, cb) {
    cb(null, `${req.user._id}-${file.fieldname}.png`);
  },
});

// Multer Storage Configuration for system images
const systemStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/hospital_avatars/');
  },
  filename: function (req, file, cb) {
    cb(null, `${req.user._id}-${file.fieldname}.png`);
  },
});

/**
 * Middleware to handle avatar updates.
 * Dynamically sets the storage based on the request URL.
 */
const updateAvatar = (req, res, next) => {
  let storageOriginal;

  // Select storage based on the request URL
  if (req.originalUrl === "/api/v1/student/update-avatar") {
    storageOriginal = profileStorage;
  } else if (req.originalUrl === "/api/system/image/update") {
    storageOriginal = systemStorage;
  }

  // Configure multer upload with the selected storage
  const upload = multer({ storage: storageOriginal }).single('avatar');

  // Handle the file upload
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError || err) {
      return sendResponse(res, 400, err.message);
    }

    // Check if a file was uploaded
    if (!req.file) {
      return sendResponse(res, 400, 'الرجاء رفع صورة');
    }

    // Proceed to the next middleware or route handler
    next();
  });
};

// Export the updateAvatar middleware
module.exports = updateAvatar;
