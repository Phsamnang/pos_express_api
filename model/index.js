const employeeInfo = require("../models/employeeInfo");
const Attendance = require("./attendance");
const Category = require("./category");
const EmployeeInfo = require("./employeeInfor");
const Import = require("./import");
const ImportDetail = require("./importDetails");
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
Table.hasMany(Sale, { foreignKey: "tableId" });
Sale.belongsTo(Table, { foreignKey: "tableId" });
Sale.hasMany(SaleItem, { foreignKey: "saleId" });
SaleItem.belongsTo(Sale, { foreignKey: "saleId" });
Menus.hasMany(SaleItem, { foreignKey: "menusId" });
SaleItem.belongsTo(Menus, { foreignKey: "menusId" });
TableType.hasMany(Table, { foreignKey: "table_type_id" });
TableType.hasMany(MenusPrice, { foreignKey: "table_type_id" });
Table.belongsTo(TableType, { foreignKey: "table_type_id" });
MenusPrice.belongsTo(TableType, { foreignKey: "table_type_id" });
Menus.hasMany(MenusPrice, { foreignKey: "menus_id" });
MenusPrice.belongsTo(Menus, { foreignKey: "menus_id" });
User.belongsTo(Roles, { foreignKey: "role_id" });
Roles.hasMany(User, { foreignKey: "role_id" });
User.belongsTo(User, { as: "Parent", foreignKey: "p_id" });
User.hasMany(User, { as: "Children", foreignKey: "p_id" });
Attendance.belongsTo(User, { foreignKey: "emp_id" });
User.hasMany(Attendance, { foreignKey: "emp_id" }),
  User.hasMany(Laon, { foreignKey: "emp_id" });
Laon.belongsTo(User, { foreignKey: "emp_id" });
User.hasOne(EmployeeInfo, { foreignKey: "emp_id", as: "emp_infos" });
EmployeeInfo.belongsTo(User, { foreignKey: "emp_id", as: "user" });
ImportDetail.belongsTo(Import, { foreignKey: "imp_id" });
Import.hasMany(ImportDetail, { foreignKey: "imp_id" });
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
