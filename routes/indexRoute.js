const express = require("express");
const { isAuthenticated } = require("../middlewares/auth");
const router = express.Router();

router.get("/", isAuthenticated, (req, res, next) => {
  res.send("home page ");
}); 

module.exports = router;
