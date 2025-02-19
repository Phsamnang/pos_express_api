const User = require("../model/user");
const bcrypt = require("bcryptjs"); // Import bcrypt
const jwt = require("jsonwebtoken");
require("dotenv").config();
exports.register = async (req, res) => {
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
      username,
      password: hashedPassword,
      name,
    });

    // Generate JWT token (make sure process.env.JWT_SECRET is set)
    const token = jwt.sign(
      { userId: newUser.id, name: name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({ accessToken: token }); // Send the token in the response
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ error: "Unable to register user" });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Password is incorrect!" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, name: user.name },
      process.env.JWT_SECRET
    );

    res.status(200).json({ accessToken: token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to log in" });
  }
};

exports.createEmployee = async (req, res) => {
  try {
    const { username, password, name } = req.body;

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Get token from Bearer header

    if (!token) {
      return res
        .status(401)
        .json({ error: "Access denied. No token provided." });
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

    res.status(201).json({ message: "Employee created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to create employee" });
  }
};
