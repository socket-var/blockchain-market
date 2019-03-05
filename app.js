const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const mongoose = require("mongoose");

const createContract = require("./ethereum/marketContract");

// router definition files
const authRouter = require("./rest_api/routes/auth");
const adminRouter = require("./rest_api/routes/admin");
const userRouter = require("./rest_api/routes/user");
const productRouter = require("./rest_api/routes/products");

//  1 admin router, user router, productRouter

// instantiate server
const app = express();

if (process.env.NODE_ENV !== "production") {
  mongoose.set("debug", true);
  require("dotenv").config();
}

//define ethereum contract here
const contract = createContract(process.env.CONTRACT_ADDRESS);

// connect to db
const dbURL = process.env.DB_URL;

require(path.join(__dirname, "rest_api/models/db_connect"))(dbURL);

// some boilerplate middleware for logging and handling requests
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "client", "build")));

// use routes
app.use("/auth", authRouter(contract));
app.use("/api/admin", adminRouter(contract));
app.use("/api/user", userRouter(contract));
app.use("/api/products", productRouter(contract));

// needed for Single-page application to reroute to index page
app.get("*", function(req, res, next) {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500).json({ errorMessage: "Internal Server Error" });
});

module.exports = app;
