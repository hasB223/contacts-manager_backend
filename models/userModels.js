const mongoose = require("mongoose");

// Define the user schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please add the username"],
  },
  email: {
    type: String,
    required: [true, "Please add the user email address"],
  },
  password: {
    type: String,
    required: [true, "Please add the user password"],
  },
  timestamp: {
    type: Date,
    required: [true],
  },
});

// Create a new model using the user schema
const User = new mongoose.model("User", userSchema);

// Export the model for use in other files
module.exports = User;
