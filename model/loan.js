const { DataTypes } = require("sequelize");
const database = require("../config/database");
const User = require("./user");

const Laon =database.define('laon',{
    userId:{
        type:DataTypes.INTEGER,
        references:{
            model:User,
            key:'id'
        },
        field:'emp_id'
    },
    amount:{
        type:DataTypes.DECIMAL(10,2),
        allowNull: false,
        field:'amt'
    },
    loadDate:{
        type:DataTypes.DATEONLY,
        allowNull:false,
        field:'laon_date'
    }
},{
    underscored:true
})

module.exports=Laon