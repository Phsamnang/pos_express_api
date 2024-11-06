const { DataTypes } = require("sequelize");
const database = require("../config/database");

const User = database.define('User', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,   
      // validate: {
      //   isEmail: true 
      // }
    },
     name: {
      type: DataTypes.STRING,
      allowNull: false,  
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
   
  });
  (async () => {
    try {
      await database.sync({ alter: true }); 
      console.log('Migration successful!');
    } catch (error) {
      console.error('Error migrating database:', error);
    }
  })(); 
  module.exports = User;