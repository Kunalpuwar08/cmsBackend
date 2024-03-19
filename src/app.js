const mongoose = require("mongoose");
const express = require("express");
const admin = require("firebase-admin");
require("dotenv").config();

const credentials = {
  type: process.env.TYPE,
  project_id:process.env.PROJECTID,
  private_key_id:process.env.PRIVATEKEYID,
  private_key:process.env.PRIVATEKEY.replace(/\\n/g, '\n'),
  client_email:process.env.CLIENTEMAIL,
  client_id:process.env.CLIENTID,
  auth_uri:process.env.AUTHURI,
  token_uri:process.env.TOKENURI,
  auth_provider_x509_cert_url:process.env.AUTHPROVIDERURI,
  client_x509_cert_url:process.env.CLIENTX50URI,
  universe_domain:process.env.UNIVERSEDOMAIN,
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
