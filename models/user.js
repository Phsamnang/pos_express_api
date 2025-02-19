"use strict";

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      // your user fields here
      // for example:
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      // ... other fields
    },
    {
      tableName: "users",
      timestamps: true,
    }
  );

  User.associate = function (models) {
    // Define one-to-one relationship with EmployeeInfo
    User.hasOne(models.EmployeeInfo, {
      foreignKey: "userId",
      as: "employeeInfo",
      onDelete: "CASCADE",
    });

    // Add purchases relationship
    User.hasMany(models.Purchase, {
      foreignKey: "userId",
      as: "purchases",
    });
  };

  return User;
};
