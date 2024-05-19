require("dotenv").config();
const express = require("express");
const app = express();
const logger = require("morgan");
const PORT = process.env.PORT;
const { generateError } = require("./middlewares/GenerateError");
const ErrorHandle = require("./utils/ErrorHandle");
const indexRoute = require("./routes/indexRoute");

//logger
app.use(logger("tiny"));
app.use("/api/v1",indexRoute);
app.all("*",(req,res,next)=>{
    next(new ErrorHandle("Page Not Found",404));
})
app.use(generateError);



app.listen(PORT,()=>{
    console.log(`server running at ${PORT} number port!!`);
})