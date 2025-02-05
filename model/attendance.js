const { DataTypes } = require("sequelize");
const database = require("../config/database");
const Employee = require("./employeeInfor");
const User = require("./user");

const Attendance = database.define("Attendance", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
    field: "emp_id",
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("Present", "Absent", "Late", "Early Leave"),
    defaultValue: "Present",
  },
});

module.exports = Attendance;
