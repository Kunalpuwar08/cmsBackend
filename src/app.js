const mongoose = require("mongoose");
const express = require("express");
const admin = require("firebase-admin");
require("dotenv").config();

const credentials = {
  type: process.env.TYPE,
  private_key_id: process.env.private_key_id,
  private_key: process.env.private_key,
  client_email: process.env.client_email,
  client_id: process.env.client_id,
  auth_uri: process.env.auth_uri,
  token_uri: process.env.token_uri,
  auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
  client_x509_cert_url: process.env.client_x509_cert_url,
  universe_domain: process.env.universe_domain,
};

admin.initializeApp({
  credential: admin.credential.cert(credentials),
  storageBucket: process.env.STORAGEBUCKET,
});

const app = express();
const port = process.env.PORT || 3000;

const authRoute = require("./routers/auth");
const todoRoute = require("./routers/todo");
const projectRoute = require("./routers/project");
const WDRoute = require("./routers/workingday");
const leaveRoute = require("./routers/leave");
const assetRoute = require("./routers/asset");

const DB = process.env.DATABASE;

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
app.use("/", WDRoute);
app.use("/", leaveRoute);
app.use("/asset", assetRoute);

app.listen(port, () => {
  console.log(`connection is live at port no ${port}`);
});
