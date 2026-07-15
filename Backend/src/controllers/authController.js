const User = require("../models/user");
const jwt = require("jsonwebtoken");

/**
 * Helper function to generate JWT token
 * (In a real app, move this to a separate utils/auth.js file)
 */
const signToken = (id) => {
  // Ensure you have JWT_SECRET in your .env file
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/signup
 * @access  Public
 */
const signup = async (req, res, next) => {
  try {
    // 1. Create the user
    // We let Mongoose handle the validation (email format, password length) 
    // and the pre-save hook handle the password hashing.
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    //  Send Success Response
    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      // token, // Provided for mobile clients or local storage setups
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
    });

  } catch (error) {
    //  Handle Specific Mongoose Errors

    // Handle Duplicate Email (MongoDB Unique Constraint Error)
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A user with this email already exists.",
      });
    }

    // Handle Mongoose Validation Errors (e.g., invalid email regex, password too short)
    if (error.name === "ValidationError") {
      // Extract all custom validation messages from the schema
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: "Invalid input data",
        errors: messages,
      });
    }

    // Pass all other unhandled errors to the global Express error handler
    // rather than using console.error() and sending a hardcoded 500 here.
    console.error("Signup Error:");
    console.error(error);
    console.error(error.stack);
    
    return res.status(500).json({
    success:false,
    message:"Internal Server Error"
});
  }
};

module.exports = {
  signup,
};