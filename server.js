// Import required modules
const express = require("express"); // Express framework for Node.js
const dotenv = require("dotenv").config(); // dotenv module for loading environment variables
const bodyParser = require("body-parser"); // body-parser middleware for parsing request bodies
const errorHandler = require("./middleware/errorHandler"); // Custom error handling middleware
const morgan = require("morgan"); // morgan middleware for logging HTTP requests
const connect = require("./config/dbConnection"); // Custom module for connecting to MongoDB database

// Create express app
const app = express();

//Apply middleware functions
app.use(express.json()); // Parse incoming JSON data
app.use(bodyParser.urlencoded({ extended: true })); // Parse incoming request bodies with urlencoded payloads
app.use(bodyParser.json()); // Parse incoming JSON data
app.use(morgan("tiny")); // Log HTTP requests with "tiny" log format

// Define routes
app.use("/api/contacts", require("./routes/contactRoutes")); // Use contactRoutes for /api/contacts endpoint
app.use("/api/users", require("./routes/userRoutes")); // Use userRoutes for /api/users endpoint

// Apply error handling middleware function
app.use(errorHandler);

const port = process.env.PORT || 5001; // Set port number from environment variable or use 5001 as default

// Define start function to connect to database and start server
const start = async () => {
  try {
    await connect(); // Connect to MongoDB database
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error(`Error starting server: ${error.message}`);
  }
};

start(); // Call start function to start server
