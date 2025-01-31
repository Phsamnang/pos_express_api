const { Employee, Attendance } = require("../model");

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
    if (!firstName || !lastName || !baseSalary) {
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

exports.checkAttendance = async (req, res) => {
  try {
    const { employeeId, status } = req.body;
    const today = new Date();
    const dateOnly = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const isAttendance = await Attendance.findOne({
      where: {
       employeeId:employeeId,
       date: dateOnly,
      },
    });
    const employee = await Employee.findByPk(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    if (isAttendance) {
      return res.status(200).json({ message: "Attendance already recorded" });
    }

    const newAttendance = await Attendance.create({
      employeeId,
      date: today,
      status,
    });

    res.status(201).json(newAttendance);
  } catch (error) {
    console.error("Error creating attendance:", error);
    res.status(500).json({ message: "Failed to create attendance" });
  }
};
    