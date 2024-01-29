const mongoose = require("mongoose");

// Define the contact schema
const contactSchema = new mongoose.Schema(
  {
    User: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true],
    },
    name: {
      type: String,
      required: [true, "Please add the contact name"],
    },
    email: {
      type: String,
      required: [true, "Please add the contact email address"],
    },
    phone: {
      type: String,
      required: [true, "Please add the contact phone number"],
    },
  },
  { timestamps: true } // add createdAt and updatedAt fields
);

// Create a new model using the contact schema
const Contact = new mongoose.model("Contact", contactSchema);

// Export the model for use in other files
module.exports = Contact;
