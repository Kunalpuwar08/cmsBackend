const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const jwtKey = "inventorySecretKey";

function generateRandomPassword() {
  const randomstring = require("randomstring");
  return randomstring.generate(12);
}

function sendCredentialsByEmail(email, password) {
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "elliot.ferry@ethereal.email",
      pass: "RTb1QqNHEdGJzVFURz",
    },
  });

  const mailOptions = {
    from: '"Buisness Hub" <elliot.ferry@ethereal.email>',
    to: email,
    subject: "Your credentials for buisness hub",
    text: `Your new account credentials:\nEmail: ${email}\nPassword: ${password}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
}

function verifyToken(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) return res.status(403).json({ message: "No token provided." });

  jwt.verify(token, jwtKey, (err, decoded) => {
    if (err)
      return res.status(401).json({ message: "Failed to authenticate token." });
    req.user = decoded;
    next();
  });
}

function generateToken(data) {
  return jwt.sign(data, jwtKey, { expiresIn: "1w" });
}

module.exports = {
  generateRandomPassword,
  sendCredentialsByEmail,
  verifyToken,
  generateToken,
};
