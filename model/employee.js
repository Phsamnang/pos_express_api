const { DataTypes } = require("sequelize");
const database = require("../config/database");

const Employee = database.define("Employee", {
  firstName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
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
});

module.exports=Employee
