const Attendance = require("./attendance");
const Category = require("./category");
const Employee = require("./employeeInfor");
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
Employee.hasMany(Attendance, { foreignKey: "employeeId" });
Attendance.belongsTo(Employee, { foreignKey: "employeeId" });
User.belongsTo(Roles, { foreignKey: "role_id" });
Roles.hasMany(User, { foreignKey: "role_id" });
User.belongsTo(User, { as: "Parent", foreignKey: "p_id" });
User.hasMany(User, { as: "Children", foreignKey: "p_id" });

module.exports = {
  Category,
  Product,
  Table,
  Sale,
  SaleItem,
  TableType,
  MenusPrice,
  Menus,
  Employee,
  Attendance,
  Roles,
};
