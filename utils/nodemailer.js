const nodemailer = require("nodemailer");
const ErrorHandler = require("./ErrorHandle");

exports.sendmail = async (req,res,next,url) => {
  const transport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    post: 465,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const mailOptions = {
    from: "Su Mon | Private Limited",
    to: `${req.body.email}`,
    subject: "password Reset Link",
    html: `<h1>Click link below to reset password</h1>
                   <a href="${url}">Password Reset Link</a>`,
  };

  transport.sendMail(mailOptions, (err, info) => {
    if (err) return next(new ErrorHandler(err, 500));
    console.log(info);
    return res.status(200).json({
      message: "mail sent successfully",
      url,
    });
  });
};
