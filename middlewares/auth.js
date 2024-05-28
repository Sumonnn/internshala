const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/ErrorHandle");

exports.isAuthenticated = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return next(
        new ErrorHandler("please login into access the resourse", 401)
      );
    }

    const { id } = jwt.verify(token, process.env.JWT_SECRET);

    //req.id = id

    next();
  } catch (error) {
    return next(new ErrorHandler("error in middlewares auth section", 500));
  }
};
