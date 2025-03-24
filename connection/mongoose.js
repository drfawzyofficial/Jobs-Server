// JS Strict Mode
"use strict";

// Import Packages
const mongoose = require("mongoose");

// Set Mongoose configurations
// mongoose.set('strictQuery', true);I. 

// MongoDB connection function
const connectToDatabase = async () => {
    try {
        // Establish a connection to MongoDB
        await mongoose.connect("mongodb://127.0.0.1:27017/chances", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            connectTimeoutMS: 10000, // Optional: Set connection timeout to 10 seconds
        });
        console.log("Connected to MongoDB successfully.");
    } catch (err) {
        // Log the error message for debugging
        console.error("Error connecting to MongoDB:", err.message);

        // Optionally, exit the process if the connection fails
        process.exit(1);
    }
};

// Execute the connection function
connectToDatabase();

// Connection on mongoDB Atlas
// const mongoose = require("mongoose");
// mongoose.set('strictQuery', true);
// (async () => {
//   try {
//     await mongoose.connect("mongodb+srv://khatatt:khatatt@khatattsite.k0xupfo.mongodb.net/chances?retryWrites=true&w=majority&appName=Khatattsite");
//     console.log("Connected to MongoDB successfully.");
//   } catch (err) {I. I. I. 
//     console.error(err.message);
//   }
// })()