const User = require("../models/userModels");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

//@desc Register a user
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    // Check for missing values
    // If any value is missing, return an error and pass it to the error handler middleware
    if (!username || !email || !password) {
      res.status(400);
      throw new Error("All fields are mandatory!");
    }

    // Find if the user already in the databse
    const registeredEmail = await User.findOne({ email });
    if (registeredEmail) {
      res.status(400);
      throw new Error("User already registered!");
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user into database
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      timestamp: Date.now(),
    });

    // Send a new object that excludes the password property
    const { password: _, ...userWithoutPassword } = user._doc;
    return res.status(201).json(userWithoutPassword);
  } catch (err) {
    console.log(err);
    return next(err);
  }
});

//@desc Login a user
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Check for missing values
    // If any value is missing, return an error and pass it to the error handler middleware
    if (!email || !password) {
      res.status(400);
      throw new Error("All fields are mandatory!");
    }

    // Find the user in the database
    const user = await User.findOne({ email });
    if (!user) {
      // If the user doesn't exist, return an error and pass it to the error handler middleware
      res.status(401);
      throw new Error("Invalid email or password!");
    }

    // Compare the provided password with the hashed password in the database
    if (user && (await bcrypt.compare(password, user.password))) {
      // If the passwords match, create a JWT token and send it to the client
      const accessToken = jwt.sign(
        {
          user: {
            username: user.username,
            email: user.email,
            id: user.id,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
      );
      res.status(200).json({ accessToken });
    } else {
      // If the passwords don't match, return an error and pass it to the error handler middleware
      res.status(401);
      throw new Error("Invalid email or password!");
    }
  } catch (err) {
    console.log(err);
    return next(err);
  }
});

//@desc Get current user details
//@route GET /api/users/current
//@access private
const currentUser = asyncHandler(async (req, res, next) => {
  try {
    // Check if req object exists and includes user data
    if (!req || !req.user) {
      throw new Error("Unable to retrieve user data");
    }
    // create a new object that excludes the password property
    const { password: _, ...userWithoutPassword } = req.user;
    return res.status(200).json(userWithoutPassword);
  } catch (err) {
    return next(err);
  }
});

module.exports = { registerUser, loginUser, currentUser };
