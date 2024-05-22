const express = require("express");
const router = express.Router();

// Import the required controllers functions
const { studentsignup, studentsignin } = require("../controllers/Auth");

// Routes for Login, Signup, and Authentication
router.post("/student/signup", studentsignup);
router.post("/student/signin", studentsignin);

module.exports = router;
