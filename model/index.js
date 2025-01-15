const Category = require("./category");
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

module.exports={
    Category,
    Product,
    Table,
    Sale,
    SaleItem,
    TableType
}