const { DataTypes } = require("sequelize");
const database = require("../config/database");

const stockUsing = database.define("StockUsing",{

    menuId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'menu_id',
    },
    productId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'prod_id'
    },
    amountUsing:{
        type: DataTypes.FLOAT,
        allowNull: false,
        field: 'amt_using'
    }
}, {
    tableName: "tb_stock_using",
    timestamps: false,
    underscored: true
});

module.exports = stockUsing;
