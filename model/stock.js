const { DataTypes } = require("sequelize");
const database = require("../config/database");

const stock=database.define("Stock", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field:'prod_id'
    },
    quantity: {
        type: DataTypes.FLOAT,
        allowNull: false,
        field:'qty'
    },
},{
    tableName: "tb_stock",
    timestamps: false,
    underscored: true,
})
module.exports = stock;