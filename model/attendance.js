const { DataTypes } = require("sequelize");
const database = require("../config/database");

const Attendance = database.define("Attendance", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  employeeId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: Employee,
      key: "employeeId",
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