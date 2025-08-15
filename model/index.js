const Attendance = require("./attendance");
const Category = require("./category");
const EmployeeInfo = require("./employeeInfo");
const Import = require("./import");
const ImportDetail = require("./importDetails");
const Loan = require("./loan");
const MenusPrice = require("./menuprice");
const Menus = require("./menus");
const Product = require("./product");
const Roles = require("./roles");
const Sale = require("./sale");
const SaleItem = require("./saleItem");
const Table = require("./table");
const TableType = require("./tabletype");
const User = require("./user");

// Associations
Table.hasMany(Sale, { foreignKey: "tableId" });
Sale.belongsTo(Table, { foreignKey: "tableId" });

Sale.hasMany(SaleItem, { foreignKey: "saleId",as : "saleItems" });
SaleItem.belongsTo(Sale, { foreignKey: "saleId",as : "sale" });

Menus.hasMany(SaleItem, { foreignKey: "menusId" });
SaleItem.belongsTo(Menus, { foreignKey: "menusId",as : "menus" });

TableType.hasMany(Table, { foreignKey: "tableTypeId",as : "tables" });
TableType.hasMany(MenusPrice, { foreignKey: "tableTypeId" });
Table.belongsTo(TableType, { foreignKey: "tableTypeId" });
MenusPrice.belongsTo(TableType, { foreignKey: "tableTypeId" });

Menus.hasMany(MenusPrice, { foreignKey: "menusId",as : "prices"});
MenusPrice.belongsTo(Menus, { foreignKey: "menusId",as : "menu" });

User.belongsTo(Roles, { foreignKey: "roleId" });
Roles.hasMany(User, { foreignKey: "roleId" });

User.belongsTo(User, { as: "Parent", foreignKey: "parentId" });
User.hasMany(User, { as: "Children", foreignKey: "parentId" });

Attendance.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Attendance, { foreignKey: "userId",as : "attendances" });

User.hasMany(Loan, { foreignKey: "userId" ,as : "loans"});
Loan.belongsTo(User, { foreignKey: "userId" });

User.hasOne(EmployeeInfo, { foreignKey: "userId", as: "tb_employee_info" });
EmployeeInfo.belongsTo(User, { foreignKey: "userId", as: "tb_user" });

ImportDetail.belongsTo(Import, { foreignKey: "importId" });
Import.hasMany(ImportDetail, { foreignKey: "importId" });

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
  User,
  Loan,
  EmployeeInfo,
  Import,
  ImportDetail,
};