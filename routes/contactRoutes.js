const express = require("express");
const validateToken = require("../middleware/validateTokenHandler");
const router = express.Router();
const {
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
} = require("../controllers/contactController");

// Use middleware to validate token for all routes in this router
router.use(validateToken);

// Route to get all contacts and create a new contact
router.route("/").get(getContacts).post(createContact);

// Route to get, update, and delete a specific contact
router.route("/:id").get(getContact).put(updateContact).delete(deleteContact);

// Export the router
module.exports = router;
