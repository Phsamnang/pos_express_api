const { DataTypes } = require("sequelize");
const database = require("../config/database");
const User = require("./user");
const EmployeeInfo = database.define(
  "tb_employee_info",
  {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: "emp_id",
    },
    phone: {
      type: DataTypes.STRING,
      field: "phone",
    },
    hireDate: {
      type: DataTypes.DATEONLY,
      field: "hire_date",
    },
    baseSalary: {
      type: DataTypes.DECIMAL(10, 2),
      field: "base_salary",
    },
  },
  {
    underscored: false,
    tableName: "tb_employee_info",
  }
);

module.exports = EmployeeInfo;
