const studentModel = require("../models/studentModel");
const { sendtoken } = require("../utils/SendToken");
const { sendmail } = require("../utils/nodemailer");

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
    const existingStudent = await studentModel.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: "User is already registered",
      });
    }

    //🛑password encryption krte hbe but ami we can use technic for password encryption into the model a pre method ar madhome

    //entry create in DB
    const student = await new studentModel({
      email,
      password,
    }).save();

    // console.log("create enrty");

    //return the response

    sendtoken(student, 201, res);

    // return res.status(200).json({
    //   success: true,
    //   message: "data created successfully",
    //   data: user,
    // });
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
    const existingStudent = await studentModel
      .findOne({ email })
      .select("+password");

    //check user is exiting or not
    if (!existingStudent) {
      return res.status(401).json({
        success: false,
        message: "User is not registered, please signup first",
      });
    }

    //password check isMatch or not
    const isMatch = await existingStudent.comparePassword(password);

    //return the response
    if (isMatch) {
      sendtoken(existingStudent, 200, res);
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

//signout code
exports.studentsignout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.json({
      message: "Successfully signout!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Logout Failure, please try again",
    });
  }
};

//forget password code
exports.studentsentmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    const existingStudent = await studentModel.findOne({ email }).exec();

    if (!existingStudent) {
      return res.status(401).json({
        success: false,
        message: "User is not registered, please signup first",
      });
    }

    //if email are existing then you will send the mail this email ...
    const url = `${req.protocol}://${req.get("host")}/student/forget-link/${
      existingStudent._id
    }`;

    //mail send
    await sendmail(req, res, next, url);
    existingStudent.resetPasswordToken = "0";
    await existingStudent.save();

    //send a response
    res.status(200).json({
      success: true,
      data: existingStudent,
      url,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "You Can't Forget Password, please try again",
    });
  }
};

//studentforgetlink
exports.studentforgetlink = async (req, res) => {
  try {
    const existingStudent = await studentModel.findById(req.params.id).exec();

    if (!existingStudent) {
      return res.status(401).json({
        success: false,
        message: "User is not registered, please signup first",
      });
    }

    if (existingStudent.resetPasswordToken == "0") {
      existingStudent.resetPasswordToken = "1";
      existingStudent.password = req.body.password;
      await existingStudent.save();
    } else {
      return res.status(500).json({
        success: false,
        message: "This link can't work please re-generate forget-link!",
      });
    }

    return res.status(200).json({
      success: true,
      existingStudent,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        "You Can't Forget Password! may be internal server error, please try again",
    });
  }
};

//studentresetpassword
exports.studentresetpassword = async (req, res) => {
  try {
    const student = await studentModel.findById(req.params.id).exec();

    student.password = req.body.password;
    await student.save();

    return res.status(200).json({
      success: true,
      student,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        "You Can't Reset-Password! may be internal server error, please try again",
    });
  }
};
