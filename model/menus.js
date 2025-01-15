const { DataTypes } = require("sequelize");
const database = require("../config/database");
const Category = require("./category");

const Menus =database.define('menus',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        allowNull:false
    },
    name:{
        type:DataTypes.STRING
    },
    categoryId:{
        type:DataTypes.INTEGER,
        references:{
            model:Category,
            key:'id'
        }
    }
})


module.exports=Menus;