const mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const studentSchema = mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      select: false,
      maxLength: [15, "Password should not exceed more than 15 characters"],
      minLength: [6, "Password should have atleast 6 characters"],
      //   match: [],
    },
    resetPasswordToken: {
      type: String,
      default: "0",
    },
  },
  { timestamps: true }
);

studentSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSaltSync(10);
    const hash = await bcrypt.hashSync(user.password, salt);
    user.password = hash;
    next();
  } catch (err) {
    next(err);
  }
});

studentSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compareSync(candidatePassword, this.password);
};

studentSchema.methods.getjwttoken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

module.exports = mongoose.model("student", studentSchema);
