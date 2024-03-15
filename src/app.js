const mongoose = require("mongoose");
const express = require("express");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

const authRoute = require("./routers/auth");
const todoRoute = require("./routers/todo");
const projectRoute = require("./routers/project");

const DB = process.env.DATABASE;
console.log(DB);
console.log(process.env);


mongoose
  .connect(DB)
  .then(() => {
    console.log("DB connected successfully");
  })
  .catch((err) => {
    console.log("DB Connection Failed");
  });

const ipMiddleware = require("express-ip");
const { ipChecker } = require("./common");

// app.use(ipChecker)
app.use(express.json());
app.use(ipMiddleware().getIpInfoMiddleware);

app.get("/", async (req, res) => {
  res.send("Welcome To CMS Backend");
});

app.use("/", authRoute);
app.use("/todo", todoRoute);
app.use("/project", projectRoute);

app.listen(port, () => {
  console.log(`connection is live at port no ${port}`);
});
