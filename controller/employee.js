const { Employee } = require("../model");

exports.createEmployee = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      department,
      hireDate,
      baseSalary,
    } = req.body;

    // Basic input validation (you should add more robust validation)
    if (
      !firstName ||
      !lastName ||
      !email ||
      !hireDate ||
      !baseSalary
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newEmployee = await Employee.create({
      firstName,
      lastName,
      email,
      phone,
      department,
      hireDate,
      baseSalary,
    });

    res.status(201).json(newEmployee);
  } catch (error) {
    console.error("Error creating employee:", error);
    res.status(500).json({ error: "Failed to create employee" });
  }
};
