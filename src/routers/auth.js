const express = require("express");
const router = express.Router();
const Admin = require("../models/userSchema");
const Employee = require("../models/employeeSchema");
const bcrypt = require("bcryptjs");
const {
  generateRandomPassword,
  sendCredentialsByEmail,
  generateToken,
  verifyToken,
} = require("../common");

router.post("/createadmin", async (req, res) => {
  const { name, email } = req.body;
  let password = generateRandomPassword();
  const hashedPassword = bcrypt.hashSync(password, 10);

  if (!name || !email) {
    return res.status(422).json({ error: "Please fill all required field" });
  }

  Admin.findOne({ email: email })
    .then((userExist) => {
      if (userExist) {
        return res.status(422).json({ error: "Email already exist" });
      }

      sendCredentialsByEmail(email, password);

      const data = {
        name,
        email,
        password: hashedPassword,
        role: "admin",
        plan: "free",
        isPasswordChanged: false,
      };

      const admin = new Admin(data);
      admin
        .save()
        .then(() => {
          res.status(201).json({ message: "admin created successfully" });
        })
        .catch(() => {
          res.status(500).json({ error: "admin not created" });
        });
    })
    .catch((err) => {
      console.log(err, "Error in Signup");
    });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Please provide email and password" });
  }

  try {
    const admin = await Admin.findOne({ email });
    if (admin) {
      const passwordMatch = await bcrypt.compare(password, admin.password);
      if (passwordMatch) {
        const token = generateToken({
          userId: admin._id,
          email: admin.email,
          role: admin.role,
          name: admin.name,
        });

        return res.status(200).json({
          message: "Admin login successful",
          user: admin,
          token: token,
        });
      }
    }

    const employee = await Employee.findOne({ email });
    if (employee) {
      const passwordMatch = await bcrypt.compare(password, employee.password);
      if (passwordMatch) {
        const token = generateToken({
          userId: employee._id,
          email: employee.email,
          role: employee.role,
          name: employee.name,
          companyName: employee.companyName,
          companyId: employee.companyId,
        });
        return res.status(200).json({
          message: "Employee login successful",
          user: employee,
          token: token,
        });
      }
    }

    return res.status(401).json({ error: "Invalid email or password" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/getall", async (req, res) => {
  try {
    const users = await Admin.find({}, "-password");
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/createemp", verifyToken, async (req, res) => {
  const { name, email } = req.body;
  const tokenData = req.user;

  let password = generateRandomPassword();
  const hashedPassword = bcrypt.hashSync(password, 10);

  if (!name || !email) {
    return res.status(422).json({ error: "Please fill all required field" });
  }

  Employee.findOne({ email: email })
    .then((userExist) => {
      if (userExist) {
        return res.status(422).json({ error: "Email already exist" });
      }

      sendCredentialsByEmail(email, password);

      const data = {
        companyId: tokenData.userId,
        companyName: tokenData.name,
        name,
        email,
        password: hashedPassword,
        role: "employee",
        isPasswordChanged: false,
      };

      const admin = new Employee(data);
      admin
        .save()
        .then(() => {
          res.status(201).json({ message: "Employee created successfully" });
        })
        .catch(() => {
          res.status(500).json({ error: "Employee not created" });
        });
    })
    .catch((err) => {
      console.log(err, "Error in create employee");
    });
});

router.get("/getEmp", verifyToken, async (req, res) => {
  try {
    const { userId } = req.user;
    const users = await Employee.find({ companyId: userId }, "-password");
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/getEmp/:empId", verifyToken, async (req, res) => {
  try {
    const { companyId } = req.user;
    const { empId } = req.params;

    const employee = await Employee.findOne(
      { _id: empId, companyId: companyId },
      "-password"
    );

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.status(200).json(employee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/change-password", verifyToken, async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (!oldPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({
      error: "Please provide old password, new password, and confirm password",
    });
  }

  if (newPassword !== confirmPassword) {
    return res
      .status(400)
      .json({ error: "New password and confirm password do not match" });
  }

  const userId = req.user.userId;
  const role = req.user.role;

  try {
    let user;
    if (role === "admin") {
      user = await Admin.findById(userId);
    } else if (role === "employee") {
      user = await Employee.findById(userId);
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Incorrect old password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    user.isPasswordChanged = true;

    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
