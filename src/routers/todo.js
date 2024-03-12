const express = require("express");
const { verifyToken } = require("../common");
const router = express.Router();

router.get("/", async (req, res, next) => {
  const allowedSubnet = "192.168.1";
  const clientIP = req.ip;
  const ipv4Address = clientIP.split(".").slice(0, 3).join(".");
  const client = ipv4Address.includes("::ffff:")
    ? ipv4Address.split(":").pop()
    : ipv4Address;

  console.log("Allowed Subnet:", allowedSubnet);
  console.log("Client Subnet:", client);

  // Check if the client's IP address is within the allowed subnet
  if (client === allowedSubnet) {
    next();
  } else {
    res.status(403).send("Forbidden");
  }
});

module.exports = router;
