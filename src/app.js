const mongoose = require("mongoose");
const express = require("express");
const authRoute = require("./routers/auth");

require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;

const DB = process.env.DATABASE;

mongoose
  .connect(DB)
  .then(() => {
    console.log("DB connected successfully");
  })
  .catch((err) => {
    console.log("DB Connection Failed");
  });

app.use(express.json());

app.get("/", async (req, res) => {
  res.send("Welcome To CMS Backend");
});

app.use("/", authRoute);

app.listen(port, () => {
  console.log(`connection is live at port no ${port}`);
});
