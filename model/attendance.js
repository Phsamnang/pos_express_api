const { DataTypes } = require("sequelize");
const database = require("../config/database");
const Employee = require("./employee");

const Attendance = database.define("Attendance", {
  employeeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Employee,
      key: 'id',
    },
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

module.exports=Attendance