const express = require("express");
const app = express();
//env file ar jnno
require("dotenv").config();

//DB Setup done
const { DBconnect } = require("./config/database");
DBconnect();

//logger
const logger = require("morgan");
app.use(logger("tiny"));

//body-parser
app.use(express.json());
app.use(express.urlencoded({extended: false}));// may be is it optional?,i don't know

//session and cookie
const session = require("express-session");
const cookieparser = require("cookie-parser");
app.use(session({
    resave:true,
    saveUninitialized:true,
    secret: process.env.EXPRESS_SESSION_SECRET
}));
app.use(cookieparser());


//route define
const indexRoute = require("./routes/indexRoute");
const profileRoute = require("./routes/Profile");
app.use("/api/v1",indexRoute);
app.use("/api/v1",profileRoute);

//Error Handle
const { generateError } = require("./middlewares/GenerateError");
const ErrorHandle = require("./utils/ErrorHandle");
app.all("*",(req,res,next)=>{
    next(new ErrorHandle("Page Not Found",404));
})
app.use(generateError);


//server listen code
const PORT = process.env.PORT;
app.listen(PORT,()=>{
    console.log(`server running at ${PORT} number port!!`);
})