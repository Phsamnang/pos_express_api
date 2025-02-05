const { DataTypes } = require("sequelize");
const database = require("../config/database");

const Roles=database.define('Role',{
     name:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true,
        feild:'nm'
     },
     permission:{
        type:DataTypes.JSON,
        allowNull:true,
        field:'perms'
     }
},{
    underscored:true
})

module.exports=Roles