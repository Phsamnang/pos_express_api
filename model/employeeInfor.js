const { DataTypes } = require("sequelize");
const database = require("../config/database");
const User = require("./user");

const EmployeeInfo = database.define(
  "emp_info",
  {
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
      field: "emp_id",
    },
    phone: {
      type: DataTypes.STRING,
    },
    hireDate: {
      type: DataTypes.DATEONLY,
    },
    baseSalary: {
      type: DataTypes.DECIMAL(10, 2),
    },
  },
  {
    underscored: false,
  }
);

module.exports = EmployeeInfo;
