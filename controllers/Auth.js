const studentModel = require("../models/studentModel");

//signup code
exports.studentsignup = async (req, res) => {
  try {
    //fetch the data from req.body
    const { email, password } = req.body;

    //validation
    if (!email && !password) {
      return res.status(403).json({
        success: false,
        message: "All fields are require",
      });
    }

    //check user already exist or not
    const existingUser = await studentModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User is already registered",
      });
    }

    //🛑password encryption krte hbe but ami we can use technic for password encryption into the model a pre method ar madhome

    //entry create in DB
    const user = await new studentModel({
      email,
      password,
    }).save();

    console.log("create enrty");

    //return the response
    return res.status(200).json({
      success: true,
      message: "data created successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User cannot be registered. please try again",
    });
  }
};

//singin code
exports.studentsignin = async (req, res) => {
  try {
    //fetch the data from req.body
    const { email, password } = req.body;

    //validation
    if (!email && !password) {
      return res.status(403).json({
        success: false,
        message: "All fields are require",
      });
    }

    //check user already exist or not
    const existingUser = await studentModel.findOne({ email }).select("+password");

    //check user is exiting or not
    if (!existingUser) {
      return res.status(401).json({
        success: false,
        message: "User is not registered, please signup first",
      });
    }
 
    //password check isMatch or not
    const isMatch = await existingUser.comparePassword(password);

    //return the response
    if (isMatch) {
      return res.status(200).json({
        success: true,
        message: "Logged in successfully",
        data: existingUser,
      });     
    } else {
      return res.status(401).json({
        success: false,
        message: "Password did not match",
      });
    }
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Login Failure, please try again",
    });
  }
};
