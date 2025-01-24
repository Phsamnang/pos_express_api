const Attendance = require("./attendance");
const Category = require("./category");
const Employee = require("./employee");
const MenusPrice = require("./menuprice");
const Menus = require("./menus");
const Product = require("./product");
const Sale = require("./sale");
const SaleItem = require("./saleItem");
const Table = require("./table");
const TableType = require("./tabletype");

Category.hasMany(Product,{foreignKey:'categoryId'})
Product.belongsTo(Category,{foreignKey:'categoryId'})
Table.hasMany(Sale,{foreignKey:'tableId'})
Sale.belongsTo(Table,{foreignKey:'tableId'})
Sale.hasMany(SaleItem,{foreignKey:'saleId'})
SaleItem.belongsTo(Sale,{foreignKey:'saleId'})
Product.hasMany(SaleItem,{foreignKey:'productId'})
SaleItem.belongsTo(Product,{foreignKey:'productId'})
TableType.hasMany(Table,{foreignKey:'tableTypeId'})
Table.belongsTo(TableType, { foreignKey: "tableTypeId" });
MenusPrice.belongsTo(TableType, { foreignKey: "tableTypeId" });
MenusPrice.belongsTo(Menus,{foreignKey:"meneuId"})
Menus.hasMany(MenusPrice)
Table.hasMany(MenusPrice)
Employee.hasMany(Attendance, { foreignKey: "employeeId" });
Attendance.belongsTo(Employee, { foreignKey: "employeeId" });

module.exports={
    Category,
    Product,
    Table,
    Sale,
    SaleItem,
    TableType,
    MenusPrice,
    Menus,
    Employee,
    Attendance
}