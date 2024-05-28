const express = require("express");
const router = express.Router();

// Import the required controllers functions
const { studentsignup, studentsignin, studentsignout } = require("../controllers/Auth");
//middlewares isAuthenticated
const { isAuthenticated } = require("../middlewares/auth");

// Routes for Login, Signup, and Authentication
router.post("/student/signup", studentsignup);
router.post("/student/signin", studentsignin);
router.get("/student/signout", isAuthenticated ,studentsignout);

module.exports = router;
