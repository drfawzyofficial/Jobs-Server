// Include necessary packages.
const express = require('express');
const compression = require('compression');
// const responseTime = require('response-time');
// const cors = require('cors');
// const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');

// Database connection.
require('./connection/mongoose');

// Load environment variables.
dotenv.config({ path: path.join(__dirname, '.env') });

// Define server port.
const port = process.env.PORT || 3000;

// Initialize Express app.
const app = express();

// Middleware for serving static files from the 'uploads' directory.
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware setup.
app.use(compression()); // Compress all HTTP responses.
app.use(helmet()); // Secure the app by setting various HTTP headers.
// app.use(responseTime()); // Add X-Response-Time header to responses.
// app.use(morgan('dev')); // HTTP request logger.
// app.use(cors()); // Enable Cross-Origin Resource Sharing.
app.use(express.json({ limit: '50mb' })); // Parse JSON with a large payload.
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data.
app.use(mongoSanitize()); // Prevent NoSQL injection.

// Import routes.
const { Admin, Student, Helper } = require('./routes/index');

// Define routes.
app.use('/api/v1/admin', Admin);
app.use('/api/v1/student', Student);
app.use('/api/v1/helper', Helper);

// Start the server and listen on the defined port.
app.listen(port, () => {
    console.log(`Server is running on Port: ${port}`);
});
