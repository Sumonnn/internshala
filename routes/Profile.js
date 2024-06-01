const express = require("express");
const router = express.Router();

// Import the required controllers functions
const {
  studentsignup,
  studentsignin,
  studentsignout,
  studentsentmail,
  studentforgetlink,
  studentresetpassword,
} = require("../controllers/Auth");
//middlewares isAuthenticated
const { isAuthenticated } = require("../middlewares/auth");

// Routes for Login, Signup, and Authentication
router.post("/student/signup", studentsignup);
router.post("/student/signin", studentsignin);
router.get("/student/signout", isAuthenticated, studentsignout);

//Routes for forget password
router.post("/student/send-mail", studentsentmail);

// Routes get /student/forget-link/:Student._id
router.get("/student/forget-link/:id", studentforgetlink);

// Routes POST /student/RESET-password/:Student._id
router.post(
  "/student/reset-password/:id",
  isAuthenticated,
  studentresetpassword
);

module.exports = router;
