const employeeInfo = require("../models/employeeInfo");
const Attendance = require("./attendance");
const Category = require("./category");
const EmployeeInfo = require("./employeeInfor");
const Laon = require("./loan");
const MenusPrice = require("./menuprice");
const Menus = require("./menus");
const Product = require("./product");
const Roles = require("./roles");
const Sale = require("./sale");
const SaleItem = require("./saleItem");
const Table = require("./table");
const TableType = require("./tabletype");
const User = require("./user");

Category.hasMany(Product, { foreignKey: "categoryId" });
Product.belongsTo(Category, { foreignKey: "categoryId" });
Table.hasMany(Sale, { foreignKey: "tableId" });
Sale.belongsTo(Table, { foreignKey: "tableId" });
Sale.hasMany(SaleItem, { foreignKey: "saleId" });
SaleItem.belongsTo(Sale, { foreignKey: "saleId" });
Product.hasMany(SaleItem, { foreignKey: "productId" });
SaleItem.belongsTo(Product, { foreignKey: "productId" });
TableType.hasMany(Table, { foreignKey: "tableTypeId" });
Table.belongsTo(TableType, { foreignKey: "tableTypeId" });
MenusPrice.belongsTo(TableType, { foreignKey: "tableTypeId" });
MenusPrice.belongsTo(Menus, { foreignKey: "meneuId" });
Menus.hasMany(MenusPrice);
Table.hasMany(MenusPrice);
User.belongsTo(Roles, { foreignKey: "role_id" });
Roles.hasMany(User, { foreignKey: "role_id" });
User.belongsTo(User, { as: "Parent", foreignKey: "p_id" });
User.hasMany(User, { as: "Children", foreignKey: "p_id" });
Attendance.belongsTo(User, { foreignKey: "emp_id" });
User.hasMany(Attendance, { foreignKey: "emp_id" }),
  User.hasMany(Laon, { foreignKey: "emp_id" });
Laon.belongsTo(User, { foreignKey: "emp_id" });
User.hasOne(EmployeeInfo, { foreignKey: "emp_id" });
EmployeeInfo.belongsTo(User, { foreignKey: "emp_id" });

const clearColumnT = (worksheet) => {
  if (!worksheet) return;

  const startRow = 11;
  // Get the used range to determine the last row
  const usedRange = worksheet.getUsedRange();
  if (!usedRange) return;

  const lastRow = usedRange.lastRow?.number || startRow;

  // Clear content in column T from row 11 onwards
  for (let row = startRow; row <= lastRow; row++) {
    const cell = worksheet.getCell(`T${row}`);
    cell.value = null;
    // Maintain center alignment if needed
    cell.alignment = {
      vertical: "middle",
      horizontal: "center",
    };
  }
};

module.exports = {
  Category,
  Product,
  Table,
  Sale,
  SaleItem,
  TableType,
  MenusPrice,
  Menus,
  Attendance,
  Roles,
};
