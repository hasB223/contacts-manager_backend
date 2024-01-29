const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/validateTokenHandler");
const {
  registerUser,
  loginUser,
  currentUser,
} = require("../controllers/userController");

// Define routes for registering, logging in, and getting current user details
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/current", validateToken, currentUser);

module.exports = router;
