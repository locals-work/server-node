var express = require("express");
var authRouter = require("./auth");
var recordRouter = require("./record");

var app = express();

app.use("/auth/", authRouter);
app.use("/book/", recordRouter);

module.exports = app;
