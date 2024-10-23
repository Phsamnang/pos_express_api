const Category = require("./category");
const Product = require("./product");
const Sale = require("./sale");
const SaleItem = require("./saleItem");
const Table = require("./table");

Category.hasMany(Product,{foreignKey:'categoryId'})
Product.belongsTo(Category,{foreignKey:'categoryId'})
Table.hasMany(Sale,{foreignKey:'tableId'})
Sale.belongsTo(Table,{foreignKey:'tableId'})
Sale.hasMany(SaleItem,{foreignKey:'saleId'})
SaleItem.belongsTo(Sale,{foreignKey:'saleId'})
Product.hasMany(SaleItem,{foreignKey:'productId'})
SaleItem.belongsTo(Product,{foreignKey:'productId'})

module.exports={
    Category,
    Product,
    Table,
    Sale,
    SaleItem
}