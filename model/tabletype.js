const { DataTypes } = require("sequelize");
const database = require("../config/database");

const TableType=database.define('table_type',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    name:{
        type:DataTypes.STRING
    }
})

module.exports=TableType