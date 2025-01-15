const { DataTypes } = require("sequelize");
const database = require("../config/database");
const TableType = require("./tabletype");
const Menus = require("./menus");

const MenusPrice=database.define('menus_price',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    price:{
        type:DataTypes.DECIMAL(10,2)
    },
    tableTypeId:{
        type:DataTypes.INTEGER,
        references:{
            model:TableType,
            key:'id'
        }
    },
    menusId:{
       type:DataTypes.INTEGER,
       references:{
        model:Menus,
        key:'id'
       }
    }
})

module.exports=MenusPrice