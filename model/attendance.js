const { DataTypes } = require("sequelize");
const database = require("../config/database");
const User = require("./user");

const Attendance = database.define(
  "Attendance",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "emp_id",
    },
    timeIn: {
      type: DataTypes.TIME,
      field: "time_in",
    },
    timeOut: {
      type: DataTypes.TIME,
      field: "time_out",
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "date",
    },
    status: {
      type: DataTypes.ENUM("Present", "Absent", "Late", "Early Leave"),
      defaultValue: "Present",
      field: "sts",
    },
  },
  {
    underscored: true,
    tableName: "tb_attendance",
  }
);

module.exports = Attendance;
