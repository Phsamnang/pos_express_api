const User = require("../model/user");
const bcrypt = require("bcryptjs"); // Import bcrypt
const jwt = require("jsonwebtoken");
const { Roles, EmployeeInfo } = require("../model");
const { createResponse } = require("../utils/responseApi");
const { sequelize } = require("../models");

require("dotenv").config();
exports.register = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { username, password, name } = req.body;
    // Check if user already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Create the new user
    const newUser = await User.create({
      username: username.toLowerCase(),
      password: hashedPassword,
      name,
    });

    // Generate JWT token (make sure process.env.JWT_SECRET is set)
    const token = jwt.sign(
      { userId: newUser.id, name: name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    await transaction.commit();

    const response = createResponse(true, "User registered successfully", {
      accessToken: token,
      id: newUser.id,
      name: newUser.name,
    });

    return res.status(201).json(response);
  } catch (err) {
    console.error(err); 
    await transaction.rollback();
    // Log the error for debugging
    return res.status(500).json(createResponse(false, "Unable to register user"));
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ where: { username: username.toLowerCase() } });
    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json(createResponse(false, "Password is incorrect!"));
    }
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, name: user.name },
      process.env.JWT_SECRET
    );

    return res.status(200).json(createResponse(true, "Login successful", {
      accessToken: token,
      id: user.id,
      name: user.name
    }));
  } catch (err) {
    console.error(err);
    return res.status(500).json(createResponse(false, "Unable to log in"));
  }
};

exports.createEmployee = async (req, res) => {
  try {
    const { username, password, name, salary, phone, hire } = req.body;

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Get token from Bearer header

    if (!token) {
      return res
        .status(401)
        .json(createResponse(false, "Access denied. No token provided."));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const employee = await User.create({
      username: username,
      password: hashedPassword,
      name: name,
      p_id: req.user.userId,
    });

    await EmployeeInfo.create({
      userId: employee.id,
      baseSalary: salary,
      phone: phone,
      hireDate: hire,
    });

    res.status(201).json({ message: "Employee created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to create employee" });
  }
};

exports.getEmployee = async (req, res) => {
  try {
    const employees = await User.findAll({
      where: {
        // Fixed syntax: use colon instead of curly brace
        parentId: req.userId,
      },
      include: {
        model: EmployeeInfo,
        as: "emp_infos",
        attributes: ["baseSalary", "phone", "hireDate"],
        required: false,
      },
    });

    if (!employees.length) {
      return res.status(404).json({
        success: false,
        message: "No employees found",
      });
    }
    return res.status(200).json({
      success: true,
      data: employees.map((u) => ({
        id: u.id,
        usr_nm: u.username,
        nm: u.name,
        emp_info: u.emp_infos ? u.emp_infos : null,
      })),
    });
  } catch (error) {
    console.error("Error fetching employees:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
