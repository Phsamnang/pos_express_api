const { DataTypes } = require("sequelize");
const database = require("../config/database");
const User = require("./user");

const Attendance = database.define(
  "Attendance",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
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
    },
    status: {
      type: DataTypes.ENUM("Present", "Absent", "Late", "Early Leave"),
      defaultValue: "Present",
    },
  },
  {
    underscored: true,
  }
);

module.exports = Attendance;
